const CheckIn = require('../models/CheckIn');
const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Submit a daily check-in (homework)
exports.submitCheckIn = async (req, res) => {
  try {
    const { groupId, day, image_data, caption } = req.body;

    if (!groupId || day === undefined || !image_data) {
      return res.status(400).json({ message: 'groupId, day, and image_data are required' });
    }

    const parsedDay = parseInt(day, 10);
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const targetMember = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!targetMember) return res.status(403).json({ message: 'You are not a member of this group' });
    if (targetMember.status !== 'active') return res.status(403).json({ message: 'You are not active in this group' });

    // Upsert equivalent: find existing for today, update or create new
    let checkIn = await CheckIn.findOne({ user: req.user._id, group: groupId, day: parsedDay });
    
    if (checkIn) {
      checkIn.image_data = image_data;
      checkIn.caption = caption;
      checkIn.status = 'pending';
      await checkIn.save();
    } else {
      checkIn = await CheckIn.create({
        user: req.user._id,
        group: groupId,
        day: parsedDay,
        image_data,
        caption,
        status: 'pending',
      });
    }

    res.status(200).json({ message: 'Homework submitted successfully', checkIn });
  } catch (error) {
    console.error('Error in submitCheckIn:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get assigned homework for review
exports.getHomeworkForReview = async (req, res) => {
  try {
    const groupId = req.params.id;
    const day = parseInt(req.query.day, 10);

    if (isNaN(day)) return res.status(400).json({ message: 'Invalid day' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const n = group.members.length;
    if (n < 2) return res.status(400).json({ message: 'Not enough members for peer reviews' });

    const reviewerMember = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!reviewerMember || reviewerMember.status !== 'active') {
      return res.status(403).json({ message: 'You are not an active member' });
    }

    const member_ids = group.members.map(m => m.user.toString()).sort();
    const reviewer_index = member_ids.indexOf(req.user._id.toString());
    
    const shift = (day % (n - 1)) + 1;
    const reviewee_index = (reviewer_index + shift) % n;
    const assigned_reviewee_id = member_ids[reviewee_index];

    if (assigned_reviewee_id === req.user._id.toString()) {
      return res.status(403).json({ message: 'Self-review strictly prohibited' });
    }

    const checkIn = await CheckIn.findOne({
      user: assigned_reviewee_id,
      group: groupId,
      day: day
    }).populate('user', 'name email avatar');

    if (!checkIn) {
      return res.status(404).json({ message: 'No homework submitted by the assigned peer yet' });
    }

    res.status(200).json({
      message: 'Homework found',
      reviewee_id: assigned_reviewee_id,
      checkIn
    });
  } catch (error) {
    console.error('Error in getHomeworkForReview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Evaluate assigned homework
exports.verifyCheckIn = async (req, res) => {
  try {
    const checkInId = req.params.id; // Or we can pass it in body. Using id from params as original.
    const { decision } = req.body; 

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision, must be "approve" or "reject"' });
    }

    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) return res.status(404).json({ message: 'Check-in not found' });

    if (checkIn.status !== 'pending') {
      return res.status(400).json({ message: 'Submission has already been evaluated' });
    }

    const group = await Group.findById(checkIn.group);
    const n = group.members.length;

    // Verify current user is actually the assigned reviewer
    const member_ids = group.members.map(m => m.user.toString()).sort();
    const reviewer_index = member_ids.indexOf(req.user._id.toString());
    const shift = (checkIn.day % (n - 1)) + 1;
    const reviewee_index = (reviewer_index + shift) % n;
    
    if (member_ids[reviewee_index] !== checkIn.user.toString()) {
        return res.status(403).json({ message: 'You are not assigned to review this user today' });
    }

    checkIn.status = decision;
    checkIn.verifiedBy = req.user._id;
    await checkIn.save();

    if (decision === 'approve') {
      const targetIndex = group.members.findIndex(m => m.user.toString() === checkIn.user.toString());
      if (targetIndex !== -1) {
        group.members[targetIndex].streak += 1;
        group.members[targetIndex].lastCompletedDay = checkIn.day;
      }
      await group.save();
      
      return res.status(200).json({ message: 'Homework approved', status: 'approved', checkIn });
    } else {
      const PENALTY_AMOUNT = 10;
      let remaining_balance = 0;
      
      for (let i = 0; i < group.members.length; i++) {
        let member = group.members[i];
        if (member.user.toString() === checkIn.user.toString()) {
            member.balance -= PENALTY_AMOUNT;
            remaining_balance = member.balance;
            if (member.balance <= 0) {
                member.status = 'kicked';
            }
        } else if (member.user.toString() === req.user._id.toString()) {
            member.balance += PENALTY_AMOUNT;
        }
      }
      group.members = group.members.filter(m => m.status === 'active');
      await group.save();

      return res.status(200).json({
        message: 'Homework rejected, penalty applied',
        status: 'rejected',
        deducted_from: checkIn.user.toString(),
        rewarded_to: req.user._id.toString(),
        remaining_balance
      });
    }
  } catch (error) {
    console.error('Error in verifyCheckIn:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
