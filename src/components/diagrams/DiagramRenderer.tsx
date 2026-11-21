'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDiagramForLesson,
  DiagramNode,
  DiagramEdge,
} from './lessonDiagrams';
import {
  Server,
  Database,
  Cpu,
  Laptop,
  Layers,
  Shield,
  Cloud,
  FileCode,
  Network,
} from 'lucide-react';

interface DiagramRendererProps {
  lessonSlug: string;
  diagramState: string;
  isPlaying: boolean;
}

const nodeIcons: Record<string, React.ReactNode> = {
  client: <Laptop className="w-5 h-5" />,
  compiler: <FileCode className="w-5 h-5" />,
  code: <FileCode className="w-5 h-5" />,
  jvm: <Cpu className="w-5 h-5" />,
  memory: <Layers className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  gateway: <Network className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  queue: <Layers className="w-5 h-5" />,
};

export function DiagramRenderer({
  lessonSlug,
  diagramState,
  isPlaying,
}: DiagramRendererProps) {
  const config = getDiagramForLesson(lessonSlug);
  const currentState =
    config.states[diagramState] ||
    config.states['recap'] ||
    Object.values(config.states)[0] || {
      activeNodeIds: config.nodes.map((n) => n.id),
      highlightNodeIds: [],
      animatedEdgeIds: config.edges.map((e) => e.id),
    };

  const nodeMap = new Map<string, DiagramNode>(config.nodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-[#F7F4EE] dark:bg-[#151412] border border-cream-300 dark:border-charcoal-700">
      {/* Metric Telemetry Pill */}
      {currentState.metricPill && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-charcoal-800/90 shadow-sm border border-cream-300 dark:border-charcoal-700 text-xs font-mono">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: currentState.metricPill.color || '#4E8752' }}
          />
          <span className="text-charcoal-500 dark:text-cream-400">
            {currentState.metricPill.label}:
          </span>
          <span className="font-bold text-charcoal-900 dark:text-cream-100">
            {currentState.metricPill.value}
          </span>
        </div>
      )}

      {/* Isometric SVG Canvas */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full max-h-[550px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Isometric Diamond Grid Pattern */}
          <pattern
            id="isometric-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 40 20 L 20 40 L 0 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-cream-300/70 dark:text-charcoal-800"
            />
          </pattern>

          {/* Gradients */}
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E8752" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2E6932" stopOpacity="0.95" />
          </linearGradient>

          {/* Marker arrow */}
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#8C887E" />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect width="800" height="500" fill="url(#isometric-grid)" />

        {/* Edges & Connections */}
        <g className="edges-layer">
          {config.edges.map((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            const isAnimated =
              isPlaying && currentState.animatedEdgeIds.includes(edge.id);
            const edgeColor = edge.color || '#8C887E';

            // Calculate center points
            const x1 = fromNode.x;
            const y1 = fromNode.y;
            const x2 = toNode.x;
            const y2 = toNode.y;

            // Curve control point
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 20;

            const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

            return (
              <g key={edge.id}>
                {/* Background path line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth="2"
                  strokeDasharray={edge.dashed ? '4 4' : undefined}
                  className="opacity-40 dark:opacity-50"
                />

                {/* Animated Packet traversing the path */}
                {isAnimated && (
                  <motion.circle
                    r="4.5"
                    fill={edgeColor}
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: '100%' }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      offsetPath: `path("${pathData}")`,
                    }}
                  />
                )}

                {/* Edge Label */}
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-medium fill-charcoal-600 dark:fill-cream-400 select-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes Layer */}
        <g className="nodes-layer">
          {config.nodes.map((node) => {
            const isActive = currentState.activeNodeIds.includes(node.id);
            const isHighlighted = currentState.highlightNodeIds.includes(node.id);

            const nodeBg = isActive
              ? node.color || '#4E8752'
              : 'rgba(160, 155, 145, 0.2)';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
              >
                {/* Glowing Highlight Ring */}
                {isHighlighted && (
                  <motion.circle
                    r="44"
                    fill="none"
                    stroke={node.color || '#4E8752'}
                    strokeWidth="2.5"
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ scale: 1.25, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}

                {/* 3D Isometric Server Box Base Shadow */}
                <ellipse
                  cx="0"
                  cy="32"
                  rx="38"
                  ry="12"
                  fill="rgba(0,0,0,0.08)"
                  className="dark:fill-black/30"
                />

                {/* Main Node Card Shape */}
                <rect
                  x="-36"
                  y="-26"
                  width="72"
                  height="52"
                  rx="14"
                  fill={nodeBg}
                  className="transition-colors duration-300 shadow-md"
                  stroke={isHighlighted ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isHighlighted ? '2' : '1'}
                />

                {/* Inner Icon Container */}
                <foreignObject x="-14" y="-18" width="28" height="28">
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isActive ? 'text-white' : 'text-charcoal-400 dark:text-cream-500'
                    }`}
                  >
                    {nodeIcons[node.type] || <Server className="w-5 h-5" />}
                  </div>
                </foreignObject>

                {/* Node Main Title */}
                <text
                  x="0"
                  y="40"
                  textAnchor="middle"
                  className="text-xs font-mono font-bold fill-charcoal-900 dark:fill-cream-100"
                >
                  {node.label}
                </text>

                {/* Node Subtitle */}
                {node.sublabel && (
                  <text
                    x="0"
                    y="54"
                    textAnchor="middle"
                    className="text-[10px] font-sans font-medium fill-charcoal-500 dark:fill-cream-400"
                  >
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
