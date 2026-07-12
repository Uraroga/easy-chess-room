import React from 'react';

type PieceTone = 'white' | 'black';

const PIECE_VIEW_BOX = '0 0 48 48';
const PIECE_STROKE_WIDTH = 3.2;

const PIECE_COLORS: Record<PieceTone, { fill: string; stroke: string }> = {
  white: {
    fill: '#fff7df',
    stroke: '#263241',
  },
  black: {
    fill: '#172033',
    stroke: '#f7f0da',
  },
};

interface PieceSvgProps {
  tone: PieceTone;
  children: React.ReactNode;
}

const PieceSvg: React.FC<PieceSvgProps> = ({ tone, children }) => {
  const colors = PIECE_COLORS[tone];

  return (
    <svg
      viewBox={PIECE_VIEW_BOX}
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={PIECE_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
};

const Pawn: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <circle cx="24" cy="13.5" r="6.4" />
    <path d="M15.5 36.5C16.4 28.4 19.4 23 24 23s7.6 5.4 8.5 13.5z" />
    <rect x="10" y="36" width="28" height="6" rx="3" />
  </PieceSvg>
);

const Knight: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <path d="M12 41h27c-.3-8.7-2.2-14.7-7.9-19.1l.3-8.3-5.3 4.2-5.8-6.8-1.3 9.2c-4.8 2.4-7.2 6-7.2 10.2 0 3.8 2.2 6.1 6.1 7.4z" />
    <path d="M18.7 29.2c3.9.7 7.4-.4 10.4-3.2" fill="none" />
    <path d="M30.8 21.8c3 1.7 4.9 4.1 5.8 7.2" fill="none" />
    <circle cx="26.6" cy="20.7" r="1" fill={PIECE_COLORS[tone].stroke} stroke="none" />
  </PieceSvg>
);

const Bishop: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <path d="M24 6.5C17.8 11 14.7 16.3 14.7 22.3c0 5.1 2.3 8.8 6.3 10.2h6c4-1.4 6.3-5.1 6.3-10.2 0-6-3.1-11.3-9.3-15.8z" />
    <path d="M28.5 14.7 19.4 27" fill="none" />
    <path d="M17.5 33.5h13" fill="none" />
    <rect x="12" y="36" width="24" height="6" rx="3" />
  </PieceSvg>
);

const Rook: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <path d="M10.5 9.5h7v5h4.2v-5h4.6v5h4.2v-5h7v10h-27z" />
    <path d="M14 19.5h20v16.8H14z" />
    <path d="M17 26h14" fill="none" />
    <rect x="10" y="36" width="28" height="6" rx="3" />
  </PieceSvg>
);

const Queen: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <path d="M9.5 29.5 12 12.8l7.5 10.5L24 8l4.5 15.3L36 12.8l2.5 16.7z" />
    <circle cx="12" cy="12.8" r="2.8" />
    <circle cx="24" cy="8" r="2.8" />
    <circle cx="36" cy="12.8" r="2.8" />
    <path d="M12.5 30.5h23" fill="none" />
    <rect x="12" y="35.5" width="24" height="6.5" rx="3.25" />
  </PieceSvg>
);

const King: React.FC<{ tone: PieceTone }> = ({ tone }) => (
  <PieceSvg tone={tone}>
    <path d="M24 7v11" fill="none" />
    <path d="M19.5 11.5h9" fill="none" />
    <path d="M12 30.2c1.5-7.7 5.4-11.7 12-11.7s10.5 4 12 11.7z" />
    <path d="M15 30.5h18" fill="none" />
    <rect x="12" y="35.5" width="24" height="6.5" rx="3.25" />
  </PieceSvg>
);

// Piece SVGs
export const PIECE_SVGS: Record<string, React.ReactNode> = {
  wP: <Pawn tone="white" />,
  wN: <Knight tone="white" />,
  wB: <Bishop tone="white" />,
  wR: <Rook tone="white" />,
  wQ: <Queen tone="white" />,
  wK: <King tone="white" />,
  bP: <Pawn tone="black" />,
  bN: <Knight tone="black" />,
  bB: <Bishop tone="black" />,
  bR: <Rook tone="black" />,
  bQ: <Queen tone="black" />,
  bK: <King tone="black" />,
};
