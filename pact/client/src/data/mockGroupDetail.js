// Mock detail data for group 'g1' — 100 Days of Code (GitHub type)
// Current date: March 25, 2026

export const mockGroupDetail = {
  id: 'g1',
  name: '100 Days of Code',
  type: 'GitHub',
  pactType: 'money',        // 'free' | 'money'
  depositAmount: 50,         // ₹ initial deposit per member
  penaltyPerMiss: 10,        // ₹ deducted per missed day
  stakePool: 210,            // ₹ total currently in the pool
  groupStreak: 18,
  consistency: 92,
  level: 6,
  xp: 2100,
  xpNext: 3000,

  // Circular accountability chain this week: Neha→Arjun→Rhea→Karthik→Sam→Neha
  // Each member[i] is accountable TO member[i+1]
  accountabilityChain: ['m1', 'm2', 'm3', 'm4', 'm5'],
  members: [
    { id: 'm1', name: 'Neha',    initials: 'N', color: '#7c3aed', streak: 18, consistency: 94, xp: 2340, checkedIn: true,  time: '6:14 AM', isYou: true,  depositBalance: 40 },
    { id: 'm2', name: 'Arjun',   initials: 'A', color: '#2563eb', streak: 20, consistency: 96, xp: 2840, checkedIn: true,  time: '5:58 AM', isYou: false, depositBalance: 50 },
    { id: 'm3', name: 'Rhea',    initials: 'R', color: '#059669', streak: 15, consistency: 92, xp: 2100, checkedIn: true,  time: '8:32 AM', isYou: false, depositBalance: 30 },
    { id: 'm4', name: 'Karthik', initials: 'K', color: '#d97706', streak: 10, consistency: 78, xp: 1420, checkedIn: false, time: null,      isYou: false, depositBalance: 20 },
    { id: 'm5', name: 'Sam',     initials: 'S', color: '#db2777', streak: 12, consistency: 88, xp: 1880, checkedIn: false, time: null,      isYou: false, depositBalance: 30 },
  ],

  // March 2026 — allDone: true = all members checked in, partial = some, false = none/future
  // March 1 is a Sunday. Today is March 25 (Tuesday).
  calendarData: {
    year: 2026,
    month: 2, // 0-indexed: 2 = March
    days: [
      // day, status: 'all' | 'partial' | 'none' | 'future'
      { day: 1,  status: 'all'     },
      { day: 2,  status: 'all'     },
      { day: 3,  status: 'all'     },
      { day: 4,  status: 'all'     },
      { day: 5,  status: 'all'     },
      { day: 6,  status: 'all'     },
      { day: 7,  status: 'partial' },
      { day: 8,  status: 'all'     },
      { day: 9,  status: 'all'     },
      { day: 10, status: 'all'     },
      { day: 11, status: 'all'     },
      { day: 12, status: 'partial' },
      { day: 13, status: 'all'     },
      { day: 14, status: 'all'     },
      { day: 15, status: 'all'     },
      { day: 16, status: 'all'     },
      { day: 17, status: 'all'     },
      { day: 18, status: 'all'     },
      { day: 19, status: 'all'     },
      { day: 20, status: 'all'     },
      { day: 21, status: 'partial' },
      { day: 22, status: 'all'     },
      { day: 23, status: 'all'     },
      { day: 24, status: 'all'     },
      { day: 25, status: 'partial' }, // today
      { day: 26, status: 'future'  },
      { day: 27, status: 'future'  },
      { day: 28, status: 'future'  },
      { day: 29, status: 'future'  },
      { day: 30, status: 'future'  },
      { day: 31, status: 'future'  },
    ],
  },

  // Heatmap — 16 weeks × 7 days. 0=none 1=light 2=med 3=dark 4=max
  heatmap: (() => {
    const weeks = [];
    for (let w = 0; w < 16; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const flat = w * 7 + d;
        // build a realistic pattern
        if (flat > 111) { days.push(Math.floor(Math.random() * 5)); }
        else if (flat < 14) { days.push(Math.random() > 0.5 ? 1 : 0); }
        else if (flat < 56) { days.push(Math.floor(Math.random() * 3)); }
        else { days.push(Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0); }
      }
      weeks.push(days);
    }
    return weeks;
  })(),
};
