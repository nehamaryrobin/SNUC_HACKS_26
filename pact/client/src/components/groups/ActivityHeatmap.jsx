import React from 'react';

const HEAT_COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function ActivityHeatmap({ weeks }) {
  // weeks: 16 weeks × 7 days; each cell is 0–4
  // We show Mon–Sun (rows) × 16 weeks (cols)
  const today = new Date(2026, 2, 25); // March 25, 2026
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks.flat().length + 1);

  // Compute month labels (which column each month starts at)
  const monthLabels = [];
  let prevMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + w * 7);
    const m = d.getMonth();
    if (m !== prevMonth) { monthLabels.push({ col: w, label: MONTHS[m] }); prevMonth = m; }
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Month labels */}
      <div className="flex mb-1" style={{ paddingLeft: 24 }}>
        {monthLabels.map((ml) => (
          <span
            key={ml.label}
            className="text-xs text-gray-400 font-medium"
            style={{ position: 'relative', left: ml.col * 16 - (monthLabels.indexOf(ml) > 0 ? monthLabels[monthLabels.indexOf(ml)-1].col * 16 : 0), minWidth: 32 }}
          >
            {ml.label}
          </span>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
            <div key={i} className="text-xs text-gray-400 h-3 flex items-center" style={{ fontSize: 10 }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((val, di) => (
              <div
                key={di}
                title={`activity: ${val}`}
                className="rounded-sm"
                style={{ width: 12, height: 12, backgroundColor: HEAT_COLORS[val] ?? HEAT_COLORS[0] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
