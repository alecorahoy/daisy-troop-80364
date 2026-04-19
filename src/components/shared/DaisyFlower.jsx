import React from 'react';

/**
 * The 10 Daisy petals as defined by Girl Scouts USA — each is one line of the Girl Scout Law.
 */
export const PETALS = [
  { key: 'lightBlue',  color: '#93c5fd', law: 'Honest and fair' },
  { key: 'yellow',     color: '#fcd34d', law: 'Friendly and helpful' },
  { key: 'springGreen',color: '#86efac', law: 'Considerate and caring' },
  { key: 'red',        color: '#fca5a5', law: 'Courageous and strong' },
  { key: 'orange',     color: '#fdba74', law: 'Responsible for what I say and do' },
  { key: 'magenta',    color: '#f9a8d4', law: 'Respect myself and others' },
  { key: 'violet',     color: '#c4b5fd', law: 'Respect authority' },
  { key: 'rose',       color: '#f9a8d4', law: 'Use resources wisely' },
  { key: 'skyBlue',    color: '#7dd3fc', law: 'Make the world a better place' },
  { key: 'gold',       color: '#fde047', law: 'Be a sister to every Girl Scout' },
];

/**
 * Beautiful SVG daisy with 10 petals arranged around a center.
 * Earned petals are full-color; unearned petals are muted (greyscale).
 */
export default function DaisyFlower({ earned = {}, size = 140, onPetalClick, animatedBloom = true }) {
  const cx = size / 2;
  const cy = size / 2;
  const petalLength = size * 0.36;
  const petalWidth = size * 0.17;
  const centerR = size * 0.12;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <defs>
        <radialGradient id="daisy-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>

      {PETALS.map((petal, i) => {
        const angle = (i / PETALS.length) * 2 * Math.PI - Math.PI / 2;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const px = cx + dx * (centerR + petalLength / 2);
        const py = cy + dy * (centerR + petalLength / 2);
        const rotDeg = (angle * 180) / Math.PI + 90;
        const isEarned = !!earned[petal.key];
        const clickable = !!onPetalClick;

        return (
          <g
            key={petal.key}
            transform={`translate(${px} ${py}) rotate(${rotDeg})`}
            onClick={clickable ? () => onPetalClick(petal.key) : undefined}
            style={{
              cursor: clickable ? 'pointer' : 'default',
            }}
          >
            <ellipse
              cx={0}
              cy={0}
              rx={petalWidth / 2}
              ry={petalLength / 2}
              fill={isEarned ? petal.color : '#f3f4f6'}
              stroke={isEarned ? '#fff' : '#d1d5db'}
              strokeWidth="1.5"
              strokeDasharray={isEarned ? '0' : '3 2'}
            />
            <title>{petal.law}</title>
          </g>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={centerR} fill="url(#daisy-center)" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
