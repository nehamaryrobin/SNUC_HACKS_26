const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Get the total aggregated wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id });
    
    let totalEarnings = 0;
    const deposits = [];

    groups.forEach(group => {
      const member = group.members.find(m => m.user.toString() === req.user._id.toString());
      if (member) {
        // Simple heuristic: earnings is the amount greater than their original deposit 
        // Real logic usually requires ledger tables. For MVP:
        const initialDeposit = group.deposit_amount || 0;
        const currentBalance = member.balance || 0;
        
        deposits.push({
          groupId: group._id,
          groupName: group.name,
          balance: currentBalance
        });

        if (currentBalance > initialDeposit) {
            totalEarnings += (currentBalance - initialDeposit);
        }
      }
    });

    res.json({
      totalEarnings,
      deposits
    });
  } catch (error) {
    console.error('Error in getWalletBalance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Deposit money into a group
exports.depositFunds = async (req, res) => {
  try {
    const { groupId, amount } = req.body;
    if (!groupId || !amount) {
        return res.status(400).json({ message: 'groupId and amount are required' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member) return res.status(403).json({ message: 'You are not in this group' });

    // Simulate deposit topup
    member.balance += Number(amount);
    group.potAmount += Number(amount);
    
    // If they were kicked due to $0 balance, make them active again
    if (member.balance > 0 && member.status !== 'active') {
        member.status = 'active';
    }

    await group.save();

    res.json({ message: `Successfully deposited $${amount}`, balance: member.balance });
  } catch (error) {
    console.error('Error in depositFunds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Withdraw money
// Note: This is a hackathon simulation of pulling funds out.
exports.withdrawFunds = async (req, res) => {
  try {
    const { amount, upiId } = req.body;

    if (!amount || !upiId) {
      return res.status(400).json({ message: 'Amount and UPI ID are required' });
    }

    // Usually you would deduct from a global wallet or specific groups.
    // For this simulation, we'll just mock success.
    res.json({ 
      message: `Successfully initiated withdrawal of $${amount} to ${upiId}`,
      status: 'processing'
    });
  } catch (error) {
    console.error('Error in withdrawFunds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
