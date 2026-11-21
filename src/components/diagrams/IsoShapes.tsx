'use client';

import React from 'react';

// Isometric projection helper: converts isometric grid (gx, gy, gz) to 2D screen coordinates
export function isoToScreen(gx: number, gy: number, gz: number = 0, originX = 400, originY = 240) {
  // 30 degree projection: cos(30°) ≈ 0.866, sin(30°) = 0.5
  const x = originX + (gx - gy) * 1.732 * 20;
  const y = originY + (gx + gy) * 20 - gz;
  return { x, y };
}

// 3D Isometric Diamond Block / Server Box
export interface IsoBlockProps {
  cx: number;
  cy: number;
  w?: number;
  d?: number;
  h?: number;
  topColor?: string;
  leftColor?: string;
  rightColor?: string;
  strokeColor?: string;
  label?: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  is2D?: boolean;
  icon?: 'server' | 'database' | 'client' | 'cpu' | 'shield' | 'gateway';
}

export function IsoBlock({
  cx,
  cy,
  w = 94,
  d = 50,
  h = 32,
  topColor = '#243242',
  leftColor = '#1A2533',
  rightColor = '#131B26',
  strokeColor = 'rgba(255, 255, 255, 0.25)',
  label,
  sublabel,
  badge,
  badgeColor = '#4E8752',
  isActive = true,
  isHighlighted = false,
  is2D = false,
}: IsoBlockProps) {
  const hw = w / 2;
  const hd = d / 2;

  // Auto-fit badge width so words never overlap or spill outside pill
  const badgeLen = badge?.length || 0;
  const pillW = Math.max(56, badgeLen * 6.5 + 24);
  const pillHalf = pillW / 2;
  const dotX = -pillHalf + 9;

  // 2D Flat Mode (High contrast, crisp mobile rendering)
  if (is2D) {
    return (
      <g className="transition-all duration-300">
        {/* Pulse highlight */}
        {isHighlighted && (
          <rect
            x={cx - hw - 5}
            y={cy - hd - 5}
            width={w + 10}
            height={d + 10}
            rx="14"
            fill="none"
            stroke={badgeColor}
            strokeWidth="2.5"
            className="animate-pulse"
          />
        )}

        {/* 2D Flat Card */}
        <rect
          x={cx - hw}
          y={cy - hd}
          width={w}
          height={d}
          rx="10"
          fill={isActive ? topColor : '#22201D'}
          stroke={isHighlighted ? badgeColor : strokeColor}
          strokeWidth={isHighlighted ? '2' : '1.2'}
        />

        {/* Status Badge */}
        {badge && (
          <g transform={`translate(${cx}, ${cy - hd - 12})`}>
            <rect
              x={-pillHalf}
              y="-9"
              width={pillW}
              height="18"
              rx="9"
              fill="rgba(18, 17, 16, 0.95)"
              stroke={badgeColor}
              strokeWidth="1.2"
            />
            <circle cx={dotX} cy="-0.5" r="2.5" fill={badgeColor} />
            <text
              x="4"
              y="3.5"
              textAnchor="middle"
              fill="#FFFFFF"
              className="text-[9px] font-mono font-bold select-none"
            >
              {badge}
            </text>
          </g>
        )}

        {/* Label */}
        {label && (
          <text
            x={cx}
            y={cy - (sublabel ? 3 : -3)}
            textAnchor="middle"
            fill="#FFFFFF"
            className="text-[10px] font-mono font-bold select-none pointer-events-none"
          >
            {label}
          </text>
        )}

        {/* Sublabel */}
        {sublabel && (
          <text
            x={cx}
            y={cy + 11}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.75)"
            className="text-[8.5px] font-sans font-medium select-none pointer-events-none"
          >
            {sublabel}
          </text>
        )}
      </g>
    );
  }

  // Diamond Top Face (cx, cy - h)
  const topPoints = `
    ${cx},${cy - h}
    ${cx + hw},${cy - h + hd}
    ${cx},${cy - h + d}
    ${cx - hw},${cy - h + hd}
  `;

  // Left Face
  const leftPoints = `
    ${cx - hw},${cy - h + hd}
    ${cx},${cy - h + d}
    ${cx},${cy + d}
    ${cx - hw},${cy + hd}
  `;

  // Right Face
  const rightPoints = `
    ${cx},${cy - h + d}
    ${cx + hw},${cy - h + hd}
    ${cx + hw},${cy + hd}
    ${cx},${cy + d}
  `;

  // Base Drop Shadow
  const shadowPoints = `
    ${cx},${cy + 8}
    ${cx + hw + 10},${cy + hd + 8}
    ${cx},${cy + d + 12}
    ${cx - hw - 10},${cy + hd + 8}
  `;

  return (
    <g className="transition-all duration-300">
      {/* Soft Base Shadow */}
      <polygon
        points={shadowPoints}
        fill="rgba(0, 0, 0, 0.25)"
        filter="blur(4px)"
      />

      {/* Pulse Highlight Ring */}
      {isHighlighted && (
        <ellipse
          cx={cx}
          cy={cy - h + hd}
          rx={hw + 14}
          ry={hd + 8}
          fill="none"
          stroke={badgeColor}
          strokeWidth="2.5"
          className="animate-pulse"
        />
      )}

      {/* 3D Extruded Faces */}
      <polygon
        points={leftPoints}
        fill={isActive ? leftColor : '#22201D'}
        stroke={strokeColor}
        strokeWidth="1"
      />
      <polygon
        points={rightPoints}
        fill={isActive ? rightColor : '#1A1916'}
        stroke={strokeColor}
        strokeWidth="1"
      />

      {/* Rack vent lines on right face */}
      <line
        x1={cx + 8}
        y1={cy - h + d + 8}
        x2={cx + hw - 8}
        y2={cy - h + hd + 8}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      <line
        x1={cx + 8}
        y1={cy - h + d + 16}
        x2={cx + hw - 8}
        y2={cy - h + hd + 16}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />

      {/* Diamond Top Face */}
      <polygon
        points={topPoints}
        fill={isActive ? topColor : '#2E2B26'}
        stroke={strokeColor}
        strokeWidth={isHighlighted ? '2' : '1.2'}
      />

      {/* Status Badge floating cleanly above block */}
      {badge && (
        <g transform={`translate(${cx}, ${cy - h - 14})`}>
          <rect
            x={-pillHalf}
            y="-10"
            width={pillW}
            height="18"
            rx="9"
            fill="rgba(18, 17, 16, 0.92)"
            stroke={badgeColor}
            strokeWidth="1.2"
          />
          <circle cx={dotX} cy="-1" r="2.5" fill={badgeColor} />
          <text
            x={4}
            y="3"
            textAnchor="middle"
            fill="#FFFFFF"
            className="text-[9px] font-mono font-bold select-none"
          >
            {badge}
          </text>
        </g>
      )}

      {/* Centered Node Label on top face */}
      {label && (
        <text
          x={cx}
          y={cy - h + hd - (sublabel ? 3 : -2)}
          textAnchor="middle"
          fill="#FFFFFF"
          className="text-[10px] font-mono font-bold select-none drop-shadow-sm pointer-events-none"
        >
          {label}
        </text>
      )}

      {/* Sublabel */}
      {sublabel && (
        <text
          x={cx}
          y={cy - h + hd + 10}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.75)"
          className="text-[8.5px] font-sans font-medium select-none pointer-events-none"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

// 3D Isometric Platform (Pedestal slab with rounded diamond profile)
export interface IsoPedestalProps {
  cx: number;
  cy: number;
  w?: number;
  d?: number;
  h?: number;
  fillTop?: string;
  fillSide?: string;
  label?: string;
}

export function IsoPedestal({
  cx,
  cy,
  w = 160,
  d = 90,
  h = 16,
  fillTop = '#22201D',
  fillSide = '#161513',
  label,
}: IsoPedestalProps) {
  const hw = w / 2;
  const hd = d / 2;

  // Auto-fit label pill
  const labelLen = label?.length || 0;
  const pedW = Math.max(90, labelLen * 7 + 24);

  return (
    <g>
      {/* Base shadow */}
      <ellipse
        cx={cx}
        cy={cy + hd + h}
        rx={hw + 10}
        ry={hd + 6}
        fill="rgba(0,0,0,0.3)"
        filter="blur(6px)"
      />

      {/* 3D Extruded Front Rim */}
      <path
        d={`
          M ${cx - hw} ${cy + hd}
          L ${cx - hw} ${cy + hd + h}
          Q ${cx} ${cy + d + h + 6} ${cx + hw} ${cy + hd + h}
          L ${cx + hw} ${cy + hd}
          Q ${cx} ${cy + d + 6} ${cx - hw} ${cy + hd}
          Z
        `}
        fill={fillSide}
      />

      {/* Smooth Rounded Diamond Top Face */}
      <path
        d={`
          M ${cx} ${cy}
          Q ${cx + hw * 0.6} ${cy + hd * 0.3} ${cx + hw} ${cy + hd}
          Q ${cx + hw * 0.6} ${cy + hd * 1.7} ${cx} ${cy + d}
          Q ${cx - hw * 0.6} ${cy + hd * 1.7} ${cx - hw} ${cy + hd}
          Q ${cx - hw * 0.6} ${cy + hd * 0.3} ${cx} ${cy}
          Z
        `}
        fill={fillTop}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Platform Pill Label */}
      {label && (
        <g transform={`translate(${cx}, ${cy + d + h + 16})`}>
          <rect
            x={-pedW / 2}
            y="-11"
            width={pedW}
            height="22"
            rx="11"
            fill="#22201D"
            stroke="#444038"
            strokeWidth="1.2"
            className="shadow-sm"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ECE8E1"
            className="text-[10px] font-mono font-bold select-none"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

// 3D Isometric Cylinder / Database drum
export function IsoDatabase({
  cx,
  cy,
  rx = 34,
  ry = 18,
  h = 44,
  color = '#AB47BC',
  label = 'MongoDB',
  sublabel = 'BSON Store',
  badge,
  isHighlighted = false,
}: {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  h?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  badge?: string;
  isHighlighted?: boolean;
}) {
  const dbBadgeW = Math.max(48, (badge?.length || 0) * 6.5 + 18);

  return (
    <g>
      {/* Base Shadow */}
      <ellipse cx={cx} cy={cy + h + 6} rx={rx + 8} ry={ry + 4} fill="rgba(0,0,0,0.25)" filter="blur(4px)" />

      {/* Pulse */}
      {isHighlighted && (
        <ellipse cx={cx} cy={cy} rx={rx + 12} ry={ry + 8} fill="none" stroke={color} strokeWidth="2.5" className="animate-pulse" />
      )}

      {/* Drum Body */}
      <path
        d={`
          M ${cx - rx} ${cy}
          L ${cx - rx} ${cy + h}
          A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h}
          L ${cx + rx} ${cy}
          A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}
          Z
        `}
        fill="#1C1826"
        stroke="rgba(255,255,255,0.2)"
      />

      {/* Groove Ring Lines */}
      <path
        d={`M ${cx - rx} ${cy + h * 0.35} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h * 0.35}`}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />
      <path
        d={`M ${cx - rx} ${cy + h * 0.7} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h * 0.7}`}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />

      {/* Top Cap */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* Status Badge */}
      {badge && (
        <g transform={`translate(${cx}, ${cy - 16})`}>
          <rect x={-dbBadgeW / 2} y="-9" width={dbBadgeW} height="18" rx="9" fill="rgba(20,20,20,0.9)" stroke={color} strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-mono font-bold select-none">
            {badge}
          </text>
        </g>
      )}

      {/* Labels */}
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#FFFFFF" className="text-[10px] font-mono font-bold select-none pointer-events-none">
        {label}
      </text>
      {sublabel && (
        <text x={cx} y={cy + h + 18} textAnchor="middle" fill="rgba(255,255,255,0.8)" className="text-[8.5px] font-sans font-medium select-none pointer-events-none">
          {sublabel}
        </text>
      )}
    </g>
  );
}

// 3D Isometric Client Laptop
export function IsoLaptop({
  cx,
  cy,
  label = 'Client',
  sublabel = 'HTTP / REST',
  badge = 'Online',
}: {
  cx: number;
  cy: number;
  label?: string;
  sublabel?: string;
  badge?: string;
}) {
  const bubbleW = Math.max(86, (sublabel?.length || 0) * 7 + 26);

  return (
    <g>
      {/* Base Laptop Keyboard Base (Diamond) */}
      <polygon
        points={`
          ${cx},${cy}
          ${cx + 42},${cy + 22}
          ${cx},${cy + 44}
          ${cx - 42},${cy + 22}
        `}
        fill="#2A2C30"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.2"
      />
      {/* Keyboard trackpad */}
      <polygon
        points={`
          ${cx},${cy + 26}
          ${cx + 14},${cy + 33}
          ${cx},${cy + 40}
          ${cx - 14},${cy + 33}
        `}
        fill="#3A3D44"
      />

      {/* Upright Screen */}
      <polygon
        points={`
          ${cx - 38},${cy + 18}
          ${cx + 38},${cy + 18}
          ${cx + 38},${cy - 36}
          ${cx - 38},${cy - 36}
        `}
        fill="#1E2024"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      {/* Screen Display Face */}
      <rect
        x={cx - 34}
        y={cy - 32}
        width="68"
        height="46"
        rx="2"
        fill="#4A90E2"
        opacity="0.85"
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-mono font-bold select-none pointer-events-none">
        {label}
      </text>

      {/* Floating URL Speech Bubble */}
      <g transform={`translate(${cx}, ${cy - 52})`}>
        <rect
          x={-bubbleW / 2}
          y="-11"
          width={bubbleW}
          height="22"
          rx="11"
          fill="#22201D"
          stroke="#444038"
          strokeWidth="1.2"
          className="shadow-md"
        />
        <circle cx={-bubbleW / 2 + 10} cy="0" r="3" fill="#4E8752" />
        <text x="5" y="4" textAnchor="middle" fill="#ECE8E1" className="text-[9.5px] font-mono font-bold select-none pointer-events-none">
          {sublabel}
        </text>
      </g>
    </g>
  );
}
