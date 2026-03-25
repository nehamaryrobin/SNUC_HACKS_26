const Group = require('../models/Group');
const User = require('../models/User');

// Helper to generate a random 6-character invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, stakeAmount } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const inviteCode = generateInviteCode();

    const group = await Group.create({
      name,
      description,
      inviteCode,
      members: [req.user._id],
      potAmount: stakeAmount || 0,
    });

    // Add group to user
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
    const { inviteCode, stakeAmount } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push(req.user._id);
    group.potAmount += stakeAmount || 0;
    await group.save();

    // Add group to user
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
    const group = await Group.findById(req.params.id).populate('members', 'name email avatar badges xp');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Optional: check if the requester is in the group. For now, let any authenticated user who knows the ID see it.
    if (!group.members.some((m) => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
