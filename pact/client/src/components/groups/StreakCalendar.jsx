import React from 'react';
import { Check } from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

export function StreakCalendar({ calendarData }) {
  const { year, month, days } = calendarData;
  const today = 25; // March 25, 2026

  // First day-of-week for the month (0=Sun … 6=Sat)
  const firstDow = new Date(year, month, 1).getDay();
  const totalCells = firstDow + days.length;
  const rows = Math.ceil(totalCells / 7);

  // Build flat grid with leading blanks
  const grid = Array(rows * 7).fill(null);
  days.forEach((d) => { grid[firstDow + d.day - 1] = d; });

  return (
    <div className="w-full">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        {MONTH_NAMES[month]} {year}
      </p>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const isToday = cell.day === today;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              {/* Status indicator */}
              {cell.status === 'all' && (
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 22, height: 22, background: '#22c55e' }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
              {cell.status === 'partial' && (
                <div
                  className="rounded-full"
                  style={{ width: 8, height: 8, background: '#f59e0b', marginTop: 7, marginBottom: 7 }}
                />
              )}
              {cell.status === 'future' && (
                <div style={{ width: 22, height: 22 }} />
              )}

              {/* Day number */}
              <span
                className="text-xs font-medium"
                style={{ color: isToday ? '#7c3aed' : '#9ca3af', fontWeight: isToday ? 700 : 400 }}
              >
                {cell.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
