const Group = require('../models/Group');
const User = require('../models/User');

// Helper to generate a random 6-character invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a group
exports.createGroup = async (req, res) => {
  try {
    let { name, description, payment_type, verification_type, deposit_amount } = req.body;

    if (!name || !payment_type || !verification_type) {
      return res.status(400).json({ message: 'name, payment_type, and verification_type are required' });
    }

    if (payment_type === 'paid') {
      deposit_amount = parseInt(deposit_amount, 10);
      if (isNaN(deposit_amount) || deposit_amount <= 0) {
        return res.status(400).json({ message: 'deposit_amount must be a positive integer for paid groups' });
      }
    } else if (payment_type === 'free') {
      deposit_amount = 0;
    } else {
      return res.status(400).json({ message: 'payment_type must be either "paid" or "free"' });
    }

    if (!['api', 'manual'].includes(verification_type)) {
      return res.status(400).json({ message: 'verification_type must be either "api" or "manual"' });
    }
    
    const inviteCode = generateInviteCode();

    const group = await Group.create({
      name,
      description,
      inviteCode,
      createdBy: req.user._id,
      payment_type,
      verification_type,
      deposit_amount,
      members: [
        {
          user: req.user._id,
          streak: 0,
          balance: deposit_amount,
          status: 'active',
          lastCompletedDay: null
        }
      ],
      potAmount: deposit_amount,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Error in createGroup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Join a group with an invite code
exports.joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    const depositAmount = group.deposit_amount || 0;
    group.members.push({
      user: req.user._id,
      streak: 0,
      balance: depositAmount,
      status: 'active',
      lastCompletedDay: null
    });
    group.potAmount += depositAmount;
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.json(group);
  } catch (error) {
    console.error('Error in joinGroup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get group details
exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.user', 'name email avatar badges xp');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some((m) => m.user._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get review assignments
exports.getReviewAssignments = async (req, res) => {
  try {
    const groupId = req.params.id;
    const day = parseInt(req.query.day, 10) || 0;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Include only active members? The python code doesn't filter by active here, but implies members exist.
    const member_ids = group.members.map(m => m.user.toString()).sort();
    const n = member_ids.length;

    if (n < 2) {
      return res.status(400).json({ message: 'Not enough members for peer reviews' });
    }

    const shift = (day % (n - 1)) + 1;
    const assignments = [];
    
    for (let i = 0; i < n; i++) {
      const reviewer = member_ids[i];
      const reviewee = member_ids[(i + shift) % n];
      assignments.push({ reviewer, reviewee });
    }
    
    res.json(assignments);
  } catch (error) {
    console.error('Error in getReviewAssignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Apply penalty directly
exports.applyPenalty = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { user_id, day } = req.body;
    
    if (!user_id || day === undefined) {
      return res.status(400).json({ message: 'user_id and day are required' });
    }

    const parsedDay = parseInt(day, 10);
    const group = await Group.findById(groupId);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const n = group.members.length;
    if (n < 2) return res.status(400).json({ message: 'Not enough members for penalties' });

    const targetIndex = group.members.findIndex(m => m.user.toString() === user_id);
    if (targetIndex === -1) return res.status(404).json({ message: 'User not found in group' });

    if (group.members[targetIndex].status !== 'active') {
      return res.status(400).json({ message: 'User is not active in this group' });
    }

    const member_ids = group.members.map(m => m.user.toString()).sort();
    const shift = (parsedDay % (n - 1)) + 1;
    const reviewee_index = member_ids.indexOf(user_id);
    
    let reviewer_index = (reviewee_index - shift) % n;
    if (reviewer_index < 0) reviewer_index += n;
    const reviewer_user_id = member_ids[reviewer_index];
    
    if (reviewer_user_id === user_id) {
      return res.status(400).json({ message: 'Cannot apply penalty: Supervisor is the user themselves' });
    }

    const PENALTY_AMOUNT = 10;
    let remaining_balance = 0;

    for (let i = 0; i < group.members.length; i++) {
        let member = group.members[i];
        if (member.user.toString() === user_id) {
            member.balance -= PENALTY_AMOUNT;
            remaining_balance = member.balance;
            if (member.balance <= 0) {
                member.status = 'kicked'; // Actually kicking them via status instead of array removal
            }
        } else if (member.user.toString() === reviewer_user_id) {
            member.balance += PENALTY_AMOUNT;
        }
    }
    
    // Using simple approach of marking not active if they run out of money
    group.members = group.members.filter(m => m.status === 'active');

    await group.save();
    
    res.json({
      message: 'Penalty applied',
      deducted_from: user_id,
      rewarded_to: reviewer_user_id,
      remaining_balance
    });
  } catch (error) {
    console.error('Error in applyPenalty:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all groups for logged-in user
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id })
                              .populate('createdBy', 'name')
                              .sort({ createdAt: -1 });

    const formattedGroups = groups.map(group => ({
      id: group._id,
      name: group.name,
      type: group.payment_type === 'paid' ? 'Blood Pact' : 'Casual Pact',
      memberCount: group.members.length,
      deposit_amount: group.deposit_amount,
      groupStreak: group.groupStreak
    }));

    res.json(formattedGroups);
  } catch (error) {
    console.error('Error in getUserGroups:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Explore available groups to join
exports.getExploreGroups = async (req, res) => {
  try {
    // Find groups where the user is NOT a member
    const groups = await Group.find({ 'members.user': { $ne: req.user._id } })
                              .populate('createdBy', 'name')
                              .limit(20)
                              .sort({ createdAt: -1 });

    const formattedGroups = groups.map(group => ({
      id: group._id,
      name: group.name,
      description: group.description,
      type: group.payment_type === 'paid' ? 'Blood Pact' : 'Casual Pact',
      memberCount: group.members.length,
      deposit_amount: group.deposit_amount,
      inviteCode: group.inviteCode // Exposing for easy hackathon joining
    }));

    res.json(formattedGroups);
  } catch (error) {
    console.error('Error in getExploreGroups:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Activity Heatmap Data
exports.getGroupActivity = async (req, res) => {
  try {
    const groupId = req.params.id;
    // For a real implementation, we would aggregate `CheckIn` by day/week.
    // Given the hackathon constraints, here is a visually rich realistic fallback block.
    // It creates 16 weeks of random activity 0-4
    
    const weeks = Array.from({ length: 16 }, () => 
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    );
    
    res.json({ weeks });
  } catch (error) {
    console.error('Error in getGroupActivity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Calendar formatting
exports.getGroupCalendar = async (req, res) => {
  try {
    const groupId = req.params.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1; // 1-indexed for response
    
    // In a real implementation: `CheckIn.find({ group: groupId, date: { $gte: startOfMonth, $lt: endOfMonth } })`
    // Then calculate if 'all', 'partial', or 'none' for each day.
    // For now, return a realistic structure to unblock frontend:
    
    const days = [
      { day: 1, status: 'all' },
      { day: 5, status: 'partial' },
      { day: 12, status: 'none' },
      { day: 26, status: 'future' }
    ];

    res.json({
      year,
      month,
      days
    });
  } catch (error) {
    console.error('Error in getGroupCalendar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all members of the group formatting
exports.getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.user', 'name xp avatar badges');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Format needed by the frontend Leaderboard / SquadStatus
    const formattedMembers = group.members.map(m => {
      const userObj = m.user;
      return {
        id: userObj._id,
        name: userObj.name,
        initials: userObj.name ? userObj.name.substring(0, 1).toUpperCase() : 'U',
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random hex color
        streak: m.streak,
        consistency: m.streak > 0 ? Math.min(100, m.streak * 5) : 0, // Mock heuristic
        xp: userObj.xp || 0,
        checkedIn: m.lastCompletedDay === new Date().getDate(),
        checkInTime: m.lastCompletedDay ? '06:14' : null,
        isCurrentUser: userObj._id.toString() === req.user._id.toString()
      };
    });

    res.json(formattedMembers);
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get group stake panel
exports.getGroupStake = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.user', 'name');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.json({
      stakePool: group.potAmount || 0,
      members: group.members.map(m => ({
        userId: m.user._id,
        name: m.user.name,
        depositBalance: m.balance
      }))
    });
  } catch (error) {
    console.error('Error in getGroupStake:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get accountability chain
exports.getGroupAccountability = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const member_ids = group.members.map(m => m.user.toString()).sort();
    
    // Simulate circular chain
    const n = member_ids.length;
    let partnerId = null;
    
    if (n > 1) {
      const reviewer_index = member_ids.indexOf(req.user._id.toString());
      if (reviewer_index !== -1) {
        // week shift
        const shift = 1; 
        partnerId = member_ids[(reviewer_index + shift) % n];
      }
    }

    res.json({
      weekStart: new Date(Date.now() - new Date().getDay() * 86400000).toISOString().split('T')[0],
      chain: member_ids,
      yourPartnerId: partnerId
    });
  } catch (error) {
    console.error('Error in getGroupAccountability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit check-in for a group (ROUTES.md format)
const CheckIn = require('../models/CheckIn');
exports.submitGroupCheckin = async (req, res) => {
  try {
    const { proofUrl } = req.body;
    const groupId = req.params.id;
    
    if (!proofUrl) return res.status(400).json({ message: 'proofUrl is required' });

    const checkIn = await CheckIn.create({
      user: req.user._id,
      group: groupId,
      day: new Date().getDate(),
      image_data: proofUrl, 
      status: 'pending'
    });

    res.json(checkIn);
  } catch (error) {
    console.error('Error in submitGroupCheckin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
