import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Move } from 'lucide-react';

interface LivingMemoryUniverseCanvasProps {
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  showControls?: boolean;
}

interface NodePoint {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  label: string;
  color: string;
  pulsePhase: number;
  isDragging?: boolean;
}

interface SignalPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

interface Stardust {
  x: number;
  y: number;
  vy: number;
  size: number;
  alpha: number;
  fadeSpeed: number;
}

const HERITAGE_LABELS = [
  'สยามเล่าขาน (Echoes of Siam)',
  'โบราณคดีบ้านเชียง ๓,๐๐๐ ปี',
  'พิพิธภัณฑสถานแห่งชาติ พระนคร',
  'งานช่างหลวงสิบหมู่',
  'ศูนย์มานุษยวิทยาสิรินธร',
  'มรดกผ้าทอ ๓๙๑ ชุมชน',
  'คลังความรู้ ๗๗ จังหวัด',
  'ประณีตศิลป์ราชสำนัก',
  'พระพุทธรูปศิลาร่วมสมัย',
  'คติสถาปัตยกรรมสยาม',
  'ประวัติศาสตร์วัฒนธรรม',
  'Living Memory Universe',
  'เครื่องปั้นดินเผาลายเขียนสี',
  'วรรณคดีและจารึกใบลาน',
  'ภูมิปัญญาสมุนไพรพื้นบ้าน'
];

export const LivingMemoryUniverseCanvas: React.FC<LivingMemoryUniverseCanvasProps> = ({
  className = '',
  isPaused: externalPaused,
  onTogglePause,
  showControls = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [internalPaused, setInternalPaused] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [hasUserDragged, setHasUserDragged] = useState(false);
  const isPaused = externalPaused !== undefined ? externalPaused : internalPaused;
  const audioContextRef = useRef<AudioContext | null>(null);

  // Interaction refs
  const nodesRef = useRef<NodePoint[]>([]);
  const draggedNodeIndexRef = useRef<number | null>(null);
  const hoveredNodeIndexRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerVelRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });

  // Play a gentle warm sine chime
  const playChime = useCallback((freq = 432) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.9);
      }
    } catch {
      // Audio not allowed or blocked
    }
  }, []);

  // Toggle internal ambient sound
  const toggleSound = () => {
    if (!soundActive) {
      playChime(528);
      setSoundActive(true);
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setSoundActive(false);
    }
  };

  const handlePauseToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onTogglePause) {
      onTogglePause();
    } else {
      setInternalPaused(prev => !prev);
    }
  };

  // Pointer event handlers for dragging nodes
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const nodes = nodesRef.current;
    let targetIndex = -1;
    let minDist = 32; // generous hit radius (32px)

    for (let i = 0; i < nodes.length; i++) {
      const dist = Math.hypot(nodes[i].x - x, nodes[i].y - y);
      if (dist < minDist) {
        minDist = dist;
        targetIndex = i;
      }
    }

    if (targetIndex !== -1) {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      draggedNodeIndexRef.current = targetIndex;
      nodes[targetIndex].isDragging = true;
      nodes[targetIndex].vx = 0;
      nodes[targetIndex].vy = 0;
      lastPointerRef.current = { x, y, time: performance.now() };
      canvas.style.cursor = 'grabbing';
      setHasUserDragged(true);

      if (soundActive) {
        playChime(396 + targetIndex * 24);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const nodes = nodesRef.current;
    const draggedIdx = draggedNodeIndexRef.current;

    if (draggedIdx !== null && nodes[draggedIdx]) {
      const node = nodes[draggedIdx];
      const now = performance.now();
      if (lastPointerRef.current) {
        const dt = Math.max(1, now - lastPointerRef.current.time);
        pointerVelRef.current = {
          vx: ((x - lastPointerRef.current.x) / dt) * 10,
          vy: ((y - lastPointerRef.current.y) / dt) * 10
        };
      }
      lastPointerRef.current = { x, y, time: now };

      // Clamped to canvas bounds
      node.x = Math.max(20, Math.min(canvas.width - 20, x));
      node.y = Math.max(20, Math.min(canvas.height - 20, y));
      node.vx = 0;
      node.vy = 0;
    } else {
      // Check hover
      let hovered = -1;
      for (let i = 0; i < nodes.length; i++) {
        if (Math.hypot(nodes[i].x - x, nodes[i].y - y) < 28) {
          hovered = i;
          break;
        }
      }
      hoveredNodeIndexRef.current = hovered;
      canvas.style.cursor = hovered !== -1 ? 'grab' : 'default';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const draggedIdx = draggedNodeIndexRef.current;
    if (draggedIdx !== null && nodesRef.current[draggedIdx]) {
      const node = nodesRef.current[draggedIdx];
      node.isDragging = false;
      // Inherit fling velocity with damping
      node.vx = Math.max(-2, Math.min(2, pointerVelRef.current.vx * 0.35));
      node.vy = Math.max(-2, Math.min(2, pointerVelRef.current.vy * 0.35));
      draggedNodeIndexRef.current = null;
      lastPointerRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore
      }
      if (canvas) canvas.style.cursor = 'default';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Create Nodes if not already created
    if (nodesRef.current.length === 0) {
      const nodeCount = 18;
      const initialNodes: NodePoint[] = [];
      for (let i = 0; i < nodeCount; i++) {
        initialNodes.push({
          id: i,
          x: Math.random() * (width * 0.88) + width * 0.06,
          y: Math.random() * (height * 0.52) + height * 0.08,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.32,
          radius: Math.random() * 3.5 + 4,
          baseRadius: Math.random() * 3.5 + 4,
          label: HERITAGE_LABELS[i % HERITAGE_LABELS.length],
          color: i % 3 === 0 ? '#e6c12f' : i % 3 === 1 ? '#38bdf8' : '#e8c742',
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      nodesRef.current = initialNodes;
    }

    const nodes = nodesRef.current;

    // Signal pulses traveling between nodes
    const pulses: SignalPulse[] = [];
    for (let i = 0; i < 8; i++) {
      const from = Math.floor(Math.random() * nodes.length);
      let to = Math.floor(Math.random() * nodes.length);
      if (to === from) to = (to + 1) % nodes.length;
      pulses.push({
        fromNode: from,
        toNode: to,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.007,
        color: Math.random() > 0.5 ? '#fde047' : '#38bdf8'
      });
    }

    // Stardust ascending from Thai architecture to cosmos
    const stardustCount = 38;
    const stardust: Stardust[] = [];
    for (let i = 0; i < stardustCount; i++) {
      stardust.push({
        x: width * 0.5 + (Math.random() - 0.5) * (width * 0.65),
        y: height * 0.72 + Math.random() * (height * 0.28),
        vy: -(0.4 + Math.random() * 0.85),
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        fadeSpeed: 0.003 + Math.random() * 0.005
      });
    }

    let time = 0;

    // Draw Thai Museum Roof Silhouette and Spire in Golden Wireframe
    const drawThaiArchitecture = (c: CanvasRenderingContext2D) => {
      const centerX = width * 0.5;
      const baseY = height;
      const roofScale = Math.min(width / 1100, 1.2);
      const spireTopY = height - 260 * roofScale;

      c.save();

      // Atmospheric golden back-glow around temple spire
      const glowGrad = c.createRadialGradient(
        centerX,
        spireTopY + 80 * roofScale,
        10,
        centerX,
        spireTopY + 80 * roofScale,
        280 * roofScale
      );
      glowGrad.addColorStop(0, 'rgba(230, 193, 47, 0.24)');
      glowGrad.addColorStop(0.5, 'rgba(156, 125, 92, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = glowGrad;
      c.fillRect(centerX - 350 * roofScale, height - 380 * roofScale, 700 * roofScale, 380 * roofScale);

      // Ethereal vertical energy beam rising from the top spire to the knowledge graph
      const beamGrad = c.createLinearGradient(centerX, spireTopY, centerX, 0);
      beamGrad.addColorStop(0, 'rgba(230, 193, 47, 0.6)');
      beamGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.25)');
      beamGrad.addColorStop(1, 'rgba(230, 193, 47, 0)');
      c.fillStyle = beamGrad;
      c.fillRect(centerX - 2, 0, 4, spireTopY);

      // Central Thai Spire
      c.strokeStyle = '#e6c12f';
      c.lineWidth = 1.5;
      c.shadowColor = '#e6c12f';
      c.shadowBlur = 10;

      // Spire needle tip
      c.beginPath();
      c.moveTo(centerX, spireTopY);
      c.lineTo(centerX, height - 190 * roofScale);
      c.stroke();

      // Multi-tier finials (บัวกลุ่ม & ยอดฉัตร)
      const tiers = [250, 235, 220, 205, 190];
      tiers.forEach((tY, index) => {
        const ringY = height - tY * roofScale;
        const ringW = (6 + index * 5) * roofScale;
        c.beginPath();
        c.ellipse(centerX, ringY, ringW, 2.5 * roofScale, 0, 0, Math.PI * 2);
        c.stroke();
      });

      // Tier 1: Top Gable Roof (หน้าบันชั้นบนสุด)
      c.beginPath();
      c.moveTo(centerX, height - 190 * roofScale);
      c.lineTo(centerX - 90 * roofScale, height - 130 * roofScale);
      c.lineTo(centerX - 130 * roofScale, height - 110 * roofScale);
      // Chofa finial left
      c.quadraticCurveTo(centerX - 145 * roofScale, height - 135 * roofScale, centerX - 135 * roofScale, height - 150 * roofScale);
      c.stroke();

      c.beginPath();
      c.moveTo(centerX, height - 190 * roofScale);
      c.lineTo(centerX + 90 * roofScale, height - 130 * roofScale);
      c.lineTo(centerX + 130 * roofScale, height - 110 * roofScale);
      // Chofa finial right
      c.quadraticCurveTo(centerX + 145 * roofScale, height - 135 * roofScale, centerX + 135 * roofScale, height - 150 * roofScale);
      c.stroke();

      // Tier 2: Lower Grand Heritage Roof
      const lowerGableY = height - 125 * roofScale;
      c.beginPath();
      c.moveTo(centerX, lowerGableY);
      c.lineTo(centerX - 190 * roofScale, height - 60 * roofScale);
      c.lineTo(centerX - 240 * roofScale, height - 40 * roofScale);
      c.quadraticCurveTo(centerX - 260 * roofScale, height - 70 * roofScale, centerX - 250 * roofScale, height - 90 * roofScale);
      c.stroke();

      c.beginPath();
      c.moveTo(centerX, lowerGableY);
      c.lineTo(centerX + 190 * roofScale, height - 60 * roofScale);
      c.lineTo(centerX + 240 * roofScale, height - 40 * roofScale);
      c.quadraticCurveTo(centerX + 260 * roofScale, height - 70 * roofScale, centerX + 250 * roofScale, height - 90 * roofScale);
      c.stroke();

      // Intricate Pediment Grid & Filigree (ลายจำหลักหน้าบัน)
      c.strokeStyle = 'rgba(230, 193, 47, 0.45)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(centerX - 50 * roofScale, height - 120 * roofScale);
      c.lineTo(centerX + 50 * roofScale, height - 120 * roofScale);
      c.moveTo(centerX - 80 * roofScale, height - 95 * roofScale);
      c.lineTo(centerX + 80 * roofScale, height - 95 * roofScale);
      c.moveTo(centerX - 130 * roofScale, height - 65 * roofScale);
      c.lineTo(centerX + 130 * roofScale, height - 65 * roofScale);
      c.stroke();

      // Solid dark silhouette base
      c.shadowBlur = 0;
      c.fillStyle = 'rgba(18, 12, 9, 0.88)';
      c.beginPath();
      c.moveTo(centerX - 240 * roofScale, baseY);
      c.lineTo(centerX - 240 * roofScale, height - 40 * roofScale);
      c.lineTo(centerX - 190 * roofScale, height - 60 * roofScale);
      c.lineTo(centerX, lowerGableY);
      c.lineTo(centerX + 190 * roofScale, height - 60 * roofScale);
      c.lineTo(centerX + 240 * roofScale, height - 40 * roofScale);
      c.lineTo(centerX + 240 * roofScale, baseY);
      c.closePath();
      c.fill();

      c.restore();
    };

    const render = () => {
      time += 0.015;

      // Deep galactic gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.45, '#121421');
      bgGrad.addColorStop(0.8, '#1b141a');
      bgGrad.addColorStop(1, '#0e0b08');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield background
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 45; s++) {
        const starX = (Math.sin(s * 99 + time * 0.05) * 0.5 + 0.5) * width;
        const starY = (Math.cos(s * 77 + time * 0.05) * 0.5 + 0.5) * (height * 0.8);
        const starTwinkle = Math.sin(time * 3 + s) * 0.5 + 0.5;
        ctx.globalAlpha = starTwinkle * 0.6;
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;

      // Update and draw Stardust ascending from Thai architecture
      stardust.forEach(star => {
        if (!isPaused) {
          star.y += star.vy;
          star.alpha += (Math.random() - 0.5) * 0.05;
          if (star.y < 50 || star.alpha <= 0) {
            star.y = height * 0.72 + Math.random() * (height * 0.28);
            star.alpha = Math.random() * 0.8 + 0.2;
          }
        }

        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#e6c12f';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Update Node positions (autonomous drift for non-dragging nodes)
      nodes.forEach((node, i) => {
        if (!node.isDragging) {
          if (!isPaused) {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce gently off boundaries
            if (node.x < 35) {
              node.x = 35;
              node.vx = Math.abs(node.vx);
            } else if (node.x > width - 35) {
              node.x = width - 35;
              node.vx = -Math.abs(node.vx);
            }

            if (node.y < 35) {
              node.y = 35;
              node.vy = Math.abs(node.vy);
            } else if (node.y > height * 0.65) {
              node.y = height * 0.65;
              node.vy = -Math.abs(node.vy);
            }
          }
        }
      });

      const draggedIdx = draggedNodeIndexRef.current;
      const hoveredIdx = hoveredNodeIndexRef.current;

      // Draw Connections (Neural Knowledge Graph Edges)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 210;

          if (dist < maxDist) {
            const isConnectedToActive = (draggedIdx === i || draggedIdx === j || hoveredIdx === i || hoveredIdx === j);
            const edgeAlpha = isConnectedToActive
              ? (1 - dist / maxDist) * 0.85
              : (1 - dist / maxDist) * 0.38;

            ctx.save();
            ctx.strokeStyle = isConnectedToActive
              ? `rgba(230, 193, 47, ${edgeAlpha})`
              : `rgba(230, 193, 47, ${edgeAlpha})`;
            ctx.lineWidth = isConnectedToActive ? 2.2 : 1.2;

            if (isConnectedToActive) {
              ctx.shadowColor = '#e6c12f';
              ctx.shadowBlur = 8;
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw Synaptic Signal Pulses moving along edges
      pulses.forEach(pulse => {
        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];
        if (from && to) {
          if (!isPaused) {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
              pulse.progress = 0;
              pulse.fromNode = Math.floor(Math.random() * nodes.length);
              let nextTo = Math.floor(Math.random() * nodes.length);
              if (nextTo === pulse.fromNode) nextTo = (nextTo + 1) % nodes.length;
              pulse.toNode = nextTo;
            }
          }

          const curX = from.x + (to.x - from.x) * pulse.progress;
          const curY = from.y + (to.y - from.y) * pulse.progress;

          ctx.save();
          ctx.fillStyle = pulse.color;
          ctx.shadowColor = pulse.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(curX, curY, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw Nodes & Constellation Badges
      nodes.forEach((node, idx) => {
        const isDragged = draggedIdx === idx;
        const isHovered = hoveredIdx === idx;
        const isActive = isDragged || isHovered;

        const pulse = Math.sin(time * 2.2 + node.pulsePhase) * 1.5;
        const currentRadius = (node.baseRadius + pulse) * (isDragged ? 1.6 : isHovered ? 1.35 : 1);

        ctx.save();

        // Extra glowing golden aura for active node
        if (isActive) {
          const auraGrad = ctx.createRadialGradient(
            node.x, node.y, currentRadius * 0.5,
            node.x, node.y, currentRadius * 3.6
          );
          auraGrad.addColorStop(0, 'rgba(230, 193, 47, 0.85)');
          auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
          auraGrad.addColorStop(1, 'rgba(230, 193, 47, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 3.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outer halo
        ctx.fillStyle = node.color === '#e6c12f' ? 'rgba(230, 193, 47, 0.3)' : 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = isActive ? '#ffffff' : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isActive ? 20 : 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Golden perimeter ring if active
        if (isActive) {
          ctx.strokeStyle = '#e6c12f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Interactive Rich Label Badge
        if (isActive || idx % 2 === 0) {
          const displayText = isActive ? `✦ ${node.label}` : node.label;
          ctx.font = isActive 
            ? 'bold 12px "Prompt", "Bai Jamjuree", sans-serif'
            : '11px "Prompt", "Bai Jamjuree", sans-serif';

          const textWidth = ctx.measureText(displayText).width;
          const badgePadding = isActive ? 9 : 5;
          const badgeHeight = isActive ? 24 : 18;
          const badgeX = node.x - textWidth / 2 - badgePadding;
          const badgeY = node.y - currentRadius - (isActive ? 32 : 22);

          // Badge pill background
          ctx.save();
          ctx.fillStyle = isActive ? 'rgba(18, 13, 10, 0.94)' : 'rgba(10, 10, 15, 0.75)';
          ctx.strokeStyle = isActive ? '#e6c12f' : 'rgba(230, 193, 47, 0.35)';
          ctx.lineWidth = isActive ? 1.5 : 1;
          ctx.shadowColor = isActive ? '#e6c12f' : 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = isActive ? 10 : 4;

          // Draw rounded pill
          ctx.beginPath();
          const r = badgeHeight / 2;
          ctx.roundRect(badgeX, badgeY, textWidth + badgePadding * 2, badgeHeight, r);
          ctx.fill();
          ctx.stroke();

          // Label text
          ctx.fillStyle = isActive ? '#fef08a' : 'rgba(255, 253, 247, 0.92)';
          ctx.shadowBlur = 0;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(displayText, node.x, badgeY + badgeHeight / 2);
          ctx.restore();
        }

        ctx.restore();
      });

      // Draw Thai Architectural Roof Silhouette at the base
      drawThaiArchitecture(ctx);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Interactive WebGL/Canvas with Unified Pointer Events */}
      <canvas 
        ref={canvasRef} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block cursor-default pointer-events-auto touch-none" 
      />

      {/* Cyber-Heritage Badges & Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Animated Tech Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-[#e6c12f]/40 text-white text-[11px] font-mono shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-[#e6c12f] font-semibold hidden sm:inline">ECHOES OF SIAM</span>
            <span className="text-white/80">LIVING MEMORY UNIVERSE</span>
          </div>

          {/* Sound / Ambient Chime Button */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-md ${
              soundActive
                ? 'bg-[#e6c12f] text-[#463629] border-[#e6c12f] shadow-lg shadow-[#e6c12f]/30'
                : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80 hover:text-white'
            }`}
            title={soundActive ? 'ปิดเสียงฮาร์โมนิก' : 'เปิดเสียงฮาร์โมนิกสยาม'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Play / Pause Video Animation Button */}
          <button
            onClick={handlePauseToggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#e6c12f]/60 text-white text-xs font-semibold transition-all cursor-pointer shadow-lg"
            title={isPaused ? 'เล่นวิดีโอเคลื่อนไหว' : 'พักวิดีโอเคลื่อนไหว'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#e6c12f]" />
                <span className="hidden sm:inline">เล่นวิดีโอ</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#e6c12f]" />
                <span className="hidden sm:inline">พักวิดีโอ</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Floating Interactive Gimmick Tip (Fades out gently once user interacts) */}
      <div 
        className={`absolute bottom-6 right-6 z-20 pointer-events-none transition-all duration-700 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/65 backdrop-blur-md border border-[#e6c12f]/50 text-xs text-[#ece4d4] shadow-xl ${
          hasUserDragged ? 'opacity-40 hover:opacity-100' : 'opacity-90 animate-pulse'
        }`}
      >
        <Move className="w-3.5 h-3.5 text-[#e6c12f]" />
        <span>แตะหรือคลิกลากแต่ละโหนดความรู้ไปมาได้อิสระ</span>
      </div>
    </div>
  );
};
