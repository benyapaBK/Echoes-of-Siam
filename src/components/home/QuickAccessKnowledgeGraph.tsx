import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Network, 
  Sparkles, 
  ArrowRight, 
  Landmark, 
  Tag, 
  ExternalLink, 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Info
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { GraphNode, GraphEdge, Museum } from '../../types/museum';

interface QuickAccessKnowledgeGraphProps {
  onNavigate: (tab: string, meta?: any) => void;
}

interface VisualNode {
  id: string;
  label: string;
  type: 'Museum' | 'Subject' | 'MuseumType';
  degree: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isPinned?: boolean;
  meta?: any;
}

interface VisualEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const PRESET_TOPICS = [
  { id: 'trending', label: 'ยอดนิยมสูงสุด', subject: undefined, subtitle: 'โครงข่ายภาพรวมจุดเชื่อมโยงสำคัญของสยาม' },
  { id: 'archaeology', label: 'โบราณคดี & ก่อนประวัติศาสตร์', subject: 'โบราณคดี', subtitle: 'เชื่อมโยงแหล่งขุดค้นและโบราณวัตถุ' },
  { id: 'textiles', label: 'มรดกผ้าทอ & วิถีชน', subject: 'ผ้าทอ', subtitle: 'ภูมิปัญญาผ้าซิ่น ผ้าไหม และชาติพันธุ์' },
  { id: 'pottery', label: 'เครื่องปั้นดินเผา', subject: 'เครื่องปั้นดินเผา', subtitle: 'วิวัฒนาการเครื่องปั้นดินเผาแต่ละลุ่มน้ำ' },
];

export const QuickAccessKnowledgeGraph: React.FC<QuickAccessKnowledgeGraphProps> = ({ onNavigate }) => {
  const [activeTopic, setActiveTopic] = useState('trending');
  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<VisualNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation physics state
  const visualNodesRef = useRef<VisualNode[]>([]);
  const visualEdgesRef = useRef<VisualEdge[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const draggedNodeIndexRef = useRef<number | null>(null);

  // 1. Fetch real graph data subset with low latency
  const graphSubset = useMemo(() => {
    const currentPreset = PRESET_TOPICS.find(t => t.id === activeTopic);
    return museumStore.getKnowledgeGraphData({
      focusSubject: currentPreset?.subject,
      maxNodes: 28
    });
  }, [activeTopic]);

  // 2. Initialize visual nodes and layout
  useEffect(() => {
    const container = containerRef.current;
    const width = container ? container.clientWidth : 800;
    const height = 480;

    const { nodes, edges } = graphSubset;
    const centerX = width / 2;
    const centerY = height / 2;

    const visualNodes: VisualNode[] = nodes.map((node, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2;
      const isHub = node.type === 'Subject';
      const distance = isHub ? 50 + (idx % 3) * 45 : 130 + (idx % 4) * 45;

      return {
        id: node.id,
        label: node.label,
        type: node.type as any,
        degree: node.degree || 1,
        x: centerX + Math.cos(angle) * distance + (Math.random() - 0.5) * 30,
        y: centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * 30,
        vx: 0,
        vy: 0,
        radius: isHub ? 18 : 10 + Math.min((node.degree || 1) * 1.5, 8),
        color: isHub ? '#e6c12f' : '#4ade80',
        meta: node.meta
      };
    });

    const visualEdges: VisualEdge[] = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label
    }));

    visualNodesRef.current = visualNodes;
    visualEdgesRef.current = visualEdges;

    // Default select the most central hub
    const hubNode = visualNodes.find(n => n.type === 'Subject') || visualNodes[0];
    if (hubNode) {
      setSelectedNode(hubNode);
    }
  }, [graphSubset]);

  // 3. Smooth Canvas Simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let iteration = 0;

    const render = () => {
      iteration++;
      const width = canvas.width;
      const height = canvas.height;
      const vNodes = visualNodesRef.current;
      const vEdges = visualEdgesRef.current;

      // Physics layout relaxation (first 120 frames or during drag)
      if (iteration < 180 || isDraggingRef.current) {
        const centerX = width / 2;
        const centerY = height / 2;

        // Node repulsion
        for (let i = 0; i < vNodes.length; i++) {
          for (let j = i + 1; j < vNodes.length; j++) {
            const dx = vNodes[j].x - vNodes[i].x;
            const dy = vNodes[j].y - vNodes[i].y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = vNodes[i].radius + vNodes[j].radius + 38;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.12;
              if (draggedNodeIndexRef.current !== i && !vNodes[i].isPinned) {
                vNodes[i].x -= dx * force;
                vNodes[i].y -= dy * force;
              }
              if (draggedNodeIndexRef.current !== j && !vNodes[j].isPinned) {
                vNodes[j].x += dx * force;
                vNodes[j].y += dy * force;
              }
            }
          }
        }

        // Center gravity and edge springs
        const nodeMap = new Map(vNodes.map(n => [n.id, n]));
        vEdges.forEach(e => {
          const s = nodeMap.get(e.source);
          const t = nodeMap.get(e.target);
          if (s && t) {
            const dx = t.x - s.x;
            const dy = t.y - s.y;
            const dist = Math.hypot(dx, dy) || 1;
            const targetDist = 110;
            const force = (dist - targetDist) * 0.015;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNodeIndexRef.current !== vNodes.indexOf(s) && !s.isPinned) {
              s.x += fx;
              s.y += fy;
            }
            if (draggedNodeIndexRef.current !== vNodes.indexOf(t) && !t.isPinned) {
              t.x -= fx;
              t.y -= fy;
            }
          }
        });

        // Pull gently to canvas bounds
        vNodes.forEach((n, idx) => {
          if (draggedNodeIndexRef.current === idx || n.isPinned) return;
          n.x += (centerX - n.x) * 0.008;
          n.y += (centerY - n.y) * 0.008;
          n.x = Math.max(30, Math.min(width - 30, n.x));
          n.y = Math.max(30, Math.min(height - 30, n.y));
        });
      }

      // Draw background
      ctx.clearRect(0, 0, width, height);

      // Deep galactic museum gradient
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 1.4);
      grad.addColorStop(0, '#1c1511');
      grad.addColorStop(0.6, '#140f0c');
      grad.addColorStop(1, '#0c0907');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial grid dots
      ctx.fillStyle = 'rgba(230, 193, 47, 0.06)';
      for (let gx = 20; gx < width; gx += 40) {
        for (let gy = 20; gy < height; gy += 40) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      const activeFocusId = selectedNode?.id || hoveredNode?.id;

      // Draw Edges
      const nodeMap = new Map(vNodes.map(n => [n.id, n]));
      vEdges.forEach(e => {
        const s = nodeMap.get(e.source);
        const t = nodeMap.get(e.target);
        if (!s || !t) return;

        const isHighlighted = activeFocusId && (s.id === activeFocusId || t.id === activeFocusId);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#e6c12f';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#e6c12f';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(215, 200, 178, 0.22)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      vNodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isHub = node.type === 'Subject';

        // Outer glow on hover or selected
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isHub ? 'rgba(230, 193, 47, 0.35)' : 'rgba(74, 222, 128, 0.35)';
          ctx.fill();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHub ? '#e6c12f' : '#22c55e';
        ctx.fill();

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHub ? '#b45309' : '#15803d');
        ctx.stroke();

        // Pinned anchor halo
        if (node.isPinned) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4.5, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#e6c12f';
          ctx.stroke();
        }

        // Node Label
        ctx.font = isHub ? 'bold 11px Prompt, sans-serif' : '10px Prompt, sans-serif';
        ctx.fillStyle = isSelected ? '#fef08a' : (isHub ? '#fef9c3' : 'rgba(255, 255, 255, 0.88)');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelText = node.label.length > 18 ? node.label.slice(0, 16) + '...' : node.label;
        ctx.fillText(labelText, node.x, node.y + node.radius + 4);
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [selectedNode, hoveredNode]);

  // 4. Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const vNodes = visualNodesRef.current;
    for (let i = 0; i < vNodes.length; i++) {
      const dist = Math.hypot(vNodes[i].x - x, vNodes[i].y - y);
      if (dist < vNodes[i].radius + 10) {
        draggedNodeIndexRef.current = i;
        isDraggingRef.current = true;
        vNodes[i].isPinned = true;
        setSelectedNode(vNodes[i]);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const vNodes = visualNodesRef.current;

    if (isDraggingRef.current && draggedNodeIndexRef.current !== null) {
      vNodes[draggedNodeIndexRef.current].x = x;
      vNodes[draggedNodeIndexRef.current].y = y;
    } else {
      // Find hover node
      let found: VisualNode | null = null;
      for (let i = 0; i < vNodes.length; i++) {
        const dist = Math.hypot(vNodes[i].x - x, vNodes[i].y - y);
        if (dist < vNodes[i].radius + 8) {
          found = vNodes[i];
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? 'pointer' : 'default';
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    draggedNodeIndexRef.current = null;
  };

  // Connected neighbors for currently active node
  const connectedDetails = useMemo(() => {
    if (!selectedNode) return [];
    const vNodes = visualNodesRef.current;
    const vEdges = visualEdgesRef.current;
    const nodeMap = new Map(vNodes.map(n => [n.id, n]));

    const neighborIds = new Set<string>();
    vEdges.forEach(e => {
      if (e.source === selectedNode.id) neighborIds.add(e.target);
      if (e.target === selectedNode.id) neighborIds.add(e.source);
    });

    return Array.from(neighborIds)
      .map(id => nodeMap.get(id))
      .filter((n): n is VisualNode => n !== undefined);
  }, [selectedNode]);

  return (
    <div className="w-full bg-[#1c1511] rounded-3xl border-2 border-[#d7c8b2] text-white p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
      
      {/* Top Banner Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#e6c12f]/40 text-xs text-[#e6c12f] font-heading font-medium shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e6c12f]" />
            <span>ทางลัดสืบค้นมิติความรู้ (Knowledge Graph Quick-Access)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>สำรวจสายสัมพันธ์แห่งสยาม: โครงข่ายพิพิธภัณฑ์ & ภูมิปัญญา</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#ece4d4]/80 mt-1 font-sans max-w-2xl">
            คลิกที่โหนดเพื่อดูความเชื่อมโยงของพิพิธภัณฑ์จริงและหัวเรื่องวัฒนธรรมที่เกี่ยวพันกัน พร้อมลากขยับโหนดได้อย่างอิสระ
          </p>
        </div>

        {/* Action Button to Open Full Graph */}
        <button
          onClick={() => onNavigate('graph')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e6c12f] to-[#e8c742] text-[#463629] font-heading font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:brightness-110 active:scale-98 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Network className="w-4 h-4 text-[#463629]" />
          <span>เปิดกราฟความรู้เต็มรูปแบบ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Topics Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-[#d7c8b2] font-heading font-semibold mr-1">
          หัวข้อที่น่าสนใจ:
        </span>
        {PRESET_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading transition-all cursor-pointer ${
              activeTopic === topic.id
                ? 'bg-[#e6c12f] text-[#463629] font-bold shadow-md ring-2 ring-[#e6c12f]/50'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage: Canvas on Left, Active Node Intel Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Canvas Viewport (8 cols) */}
        <div 
          ref={containerRef} 
          className="lg:col-span-8 bg-black/50 rounded-2xl border border-white/10 overflow-hidden relative min-h-[460px] sm:min-h-[480px] flex items-center justify-center select-none shadow-inner"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full block touch-none"
          />

          {/* Interactive Legend Overlays */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e6c12f]" />
              <span>หัวเรื่องภูมิปัญญา</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span>พิพิธภัณฑ์</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-white/70">
            แตะหรือคลิกลากเพื่อจัดผังโหนดได้อย่างอิสระ
          </div>
        </div>

        {/* Selected Node Details Card (4 cols) */}
        <div className="lg:col-span-4 bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col justify-between backdrop-blur-md space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] uppercase tracking-wider text-[#e6c12f] font-heading font-semibold flex items-center gap-1.5">
                {selectedNode?.type === 'Subject' ? (
                  <>
                    <Tag className="w-3.5 h-3.5 text-[#e6c12f]" />
                    <span>หัวเรื่องวัฒนธรรม</span>
                  </>
                ) : (
                  <>
                    <Landmark className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span>สถาบันพิพิธภัณฑ์</span>
                  </>
                )}
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">
                {connectedDetails.length} ความเชื่อมโยง
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-2">
                <h3 className="text-xl font-editorial font-bold text-white leading-snug">
                  {selectedNode.label}
                </h3>
                {selectedNode.meta?.province && (
                  <p className="text-xs text-[#ece4d4]/70">
                    จังหวัด: {selectedNode.meta.province} • ประเภท: {selectedNode.meta.type || 'พิพิธภัณฑ์'}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-white/60">
                คลิกที่โหนดใดก็ได้บนกราฟเพื่อแสดงข้อมูลเชิงลึก
              </p>
            )}

            {/* List of Connected Items */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] text-[#e6c12f] font-heading font-semibold block">
                โหนดที่เชื่อมต่ออยู่ ({connectedDetails.length} รายการ):
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {connectedDetails.map(neighbor => (
                  <button
                    key={neighbor.id}
                    onClick={() => setSelectedNode(neighbor)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-colors text-xs text-[#ece4d4] border border-white/5 group cursor-pointer"
                  >
                    <span className="truncate pr-2 group-hover:text-white">
                      {neighbor.label}
                    </span>
                    <span className="text-[10px] text-white/40 group-hover:text-[#e6c12f] shrink-0 font-mono">
                      {neighbor.type === 'Subject' ? 'หัวเรื่อง' : 'พิพิธภัณฑ์'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {selectedNode?.type === 'Museum' && selectedNode.meta?.id && (
              <button
                onClick={() => onNavigate('museum-detail', { museumId: selectedNode.meta.id })}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-heading font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
              >
                <span>เปิดอ่านข้อมูลพิพิธภัณฑ์นี้</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e6c12f]" />
              </button>
            )}

            {selectedNode?.type === 'Subject' && (
              <button
                onClick={() => onNavigate('subjects', { selectSubject: selectedNode.label })}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-heading font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
              >
                <span>ดูพิพิธภัณฑ์ทั้งหมดในหัวเรื่องนี้</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e6c12f]" />
              </button>
            )}

            <button
              onClick={() => onNavigate('graph', { 
                focusSubject: selectedNode?.type === 'Subject' ? selectedNode.label : undefined,
                focusMuseumId: selectedNode?.type === 'Museum' ? selectedNode.id : undefined
              })}
              className="w-full py-2.5 px-3 bg-[#e6c12f] hover:bg-[#e8c742] text-[#463629] font-heading font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>ขยายดูในหน้ากราฟความรู้หลัก</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
