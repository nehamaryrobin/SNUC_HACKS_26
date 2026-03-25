export const mockGroups = [
  {
    id: 'g1',
    name: '100 Days of Code',
    type: 'GitHub',
    memberCount: 1420,
    pactType: 'money',        // 'free' | 'money'
    depositAmount: 50,         // ₹ initial deposit
    penaltyPerMiss: 10,        // ₹ deducted per missed day
  },
  {
    id: 'g2',
    name: 'Algorithm Crushers',
    type: 'CodeForces',
    memberCount: 89,
    pactType: 'money',
    depositAmount: 100,
    penaltyPerMiss: 20,
  },
  {
    id: 'g3',
    name: 'Polyglot Club',
    type: 'Duolingo',
    memberCount: 3450,
    pactType: 'free',
    depositAmount: 0,
    penaltyPerMiss: 0,
  },
  {
    id: 'g4',
    name: 'Early Bird Runners',
    type: 'Custom',
    memberCount: 24,
    pactType: 'money',
    depositAmount: 50,
    penaltyPerMiss: 10,
  },
  {
    id: 'g5',
    name: 'UI/UX Daily Challenge',
    type: 'Custom',
    memberCount: 156,
    pactType: 'free',
    depositAmount: 0,
    penaltyPerMiss: 0,
  },
];
