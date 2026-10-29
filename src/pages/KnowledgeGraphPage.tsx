import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import cytoscape, { type Core, type EventObject, type NodeSingular } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Search, 
  Download, 
  Filter, 
  Layers, 
  ExternalLink, 
  Landmark, 
  Tag, 
  Info,
  X, 
  Compass, 
  Sparkles, 
  Network, 
  Share2, 
  Code, 
  Check, 
  Copy, 
  Image as ImageIcon, 
  BookOpen, 
  ArrowRight, 
  Eye, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle,
  Plus,
  Pin,
  PinOff,
  Lock,
  Unlock,
  Play,
  Pause,
  Palette
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { GraphNode, GraphEdge, Museum, SubjectItem, GraphBloomPreset, KnowledgeGraphImage } from '../types/museum';

interface KnowledgeGraphPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  focusSubject?: string;
  focusMuseumId?: string;
}

export interface NodeColorTheme {
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeLabel: string;
}

/**
 * Color classification engine for vibrant, highly distinct node presentation:
 * - High-contrast, radiant palettes mapped directly to cultural domains and museum classifications
 */
export const getNodeColorTheme = (node: GraphNode): NodeColorTheme => {
  if (node.type === 'Subject') {
    const name = node.label || '';
    if (/โบราณคดี|ก่อนประวัติศาสตร์|บ้านเชียง|ลพบุรี|ทวารวดี|ขุดค้น|ศิลา|ซาก|ประวัติศาสตร์/.test(name)) {
      return { bgColor: '#f59e0b', borderColor: '#d97706', textColor: '#78350f', badgeLabel: 'โบราณคดี & ยุคก่อนประวัติศาสตร์' };
    }
    if (/ช่าง|ประณีตศิลป์|หลวง|ราช|สิบหมู่|เครื่องทอง|เครื่องเงิน|ถม|สถาปัตยกรรม|มุก/.test(name)) {
      return { bgColor: '#a855f7', borderColor: '#9333ea', textColor: '#581c87', badgeLabel: 'ประณีตศิลป์ราชสำนัก' };
    }
    if (/ผ้า|ทอ|ซิ่น|ไหม|ชาติพันธุ์|วิถี|ชุมชน|ไท|ลื้อ|ยวน|กะเหรี่ยง|ม้ง|มรดก/.test(name)) {
      return { bgColor: '#10b981', borderColor: '#059669', textColor: '#064e3b', badgeLabel: 'วิถีชีวิต & มรดกผ้าทอ' };
    }
    if (/เครื่องปั้นดินเผา|สังคโลก|เครื่องเคลือบ|หัตถกรรม|จักสาน|เครื่องเรือน|เตา/.test(name)) {
      return { bgColor: '#f97316', borderColor: '#ea580c', textColor: '#7c2d12', badgeLabel: 'เครื่องปั้นดินเผา & หัตถศิลป์' };
    }
    if (/วัด|พระ|ศาสนา|พุทธ|จิตรกรรม|วิหาร|อุโบสถ|เจดีย์|ธรรมะ/.test(name)) {
      return { bgColor: '#0284c7', borderColor: '#0369a1', textColor: '#0c4a6e', badgeLabel: 'ศาสนา & จิตรกรรมพุทธ' };
    }
    if (/ธรรมชาติ|ธรณี|วิทยาศาสตร์|การเกษตร|พืช|ป่า|ทะเล|สัตว์/.test(name)) {
      return { bgColor: '#84cc16', borderColor: '#65a30d', textColor: '#365314', badgeLabel: 'ธรรมชาติ & วิทยาศาสตร์' };
    }
    return { bgColor: '#ec4899', borderColor: '#db2777', textColor: '#831843', badgeLabel: 'ภูมิปัญญาทางวัฒนธรรม' };
  }

  if (node.type === 'Museum') {
    const meta = node.meta;
    const type = meta?.type || '';
    if (/แห่งชาติ/.test(type)) {
      return { bgColor: '#dc2626', borderColor: '#b91c1c', textColor: '#450a0a', badgeLabel: 'พิพิธภัณฑสถานแห่งชาติ' };
    }
    if (/ท้องถิ่น|ชุมชน/.test(type)) {
      return { bgColor: '#16a34a', borderColor: '#15803d', textColor: '#14532d', badgeLabel: 'พิพิธภัณฑ์ท้องถิ่นและชุมชน' };
    }
    if (/มหาวิทยาลัย|การศึกษา|โรงเรียน/.test(type)) {
      return { bgColor: '#6366f1', borderColor: '#4f46e5', textColor: '#1e1b4b', badgeLabel: 'สถาบันการศึกษา / มหาวิทยาลัย' };
    }
    if (/วัด|ศาสน/.test(type)) {
      return { bgColor: '#d97706', borderColor: '#b45309', textColor: '#78350f', badgeLabel: 'พิพิธภัณฑ์วัด / ศาสนสถาน' };
    }
    if (/เอกชน|มูลนิธิ/.test(type)) {
      return { bgColor: '#9333ea', borderColor: '#7e22ce', textColor: '#3b0764', badgeLabel: 'พิพิธภัณฑ์เอกชน / มูลนิธิ' };
    }
    if (/ทหาร|ตำรวจ|ราชการ|เฉพาะทาง/.test(type)) {
      return { bgColor: '#0d9488', borderColor: '#0f766e', textColor: '#134e4a', badgeLabel: 'พิพิธภัณฑ์เฉพาะทาง' };
    }
    return { bgColor: '#854d0e', borderColor: '#713f12', textColor: '#422006', badgeLabel: 'พิพิธภัณฑ์' };
  }

  // MuseumType or other central hubs
  return { bgColor: '#06b6d4', borderColor: '#0891b2', textColor: '#164e63', badgeLabel: 'ประเภทการบริหารจัดการ' };
};

export const KnowledgeGraphPage: React.FC<KnowledgeGraphPageProps> = ({ 
  onNavigate,
  focusSubject,
  focusMuseumId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const pinnedPositionsRef = useRef(new Map<string, { x: number; y: number }>());

  // 1. Image Knowledge Graphs Slider State
  const [kgImages, setKgImages] = useState<KnowledgeGraphImage[]>(() => museumStore.getActiveKnowledgeGraphImages());
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [imageZoomLevel, setImageZoomLevel] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [isAutoSlide, setIsAutoSlide] = useState<boolean>(false);

  // 2. Active Bloom Presets from Store
  const [bloomPresets, setBloomPresets] = useState<GraphBloomPreset[]>(() => {
    return museumStore.getActiveBloomPresets().filter(p => {
      const n = (p.name || '').toLowerCase();
      const id = (p.id || '').toLowerCase();
      return !n.includes('เทส') && !n.includes('test') && !n.includes('ทดสอบ') && !id.includes('test');
    });
  });

  // View Mode: 'image' (เมนหลักขึ้นก่อน) | 'bloom' | 'interactive'
  const [viewMode, setViewMode] = useState<'image' | 'bloom' | 'interactive'>(() => {
    const activeImgs = museumStore.getActiveKnowledgeGraphImages();
    return activeImgs.length > 0 ? 'image' : 'bloom';
  });

  const [activePresetId, setActivePresetId] = useState<string>('bloom_mega_universe_all');
  const [showCypherModal, setShowCypherModal] = useState<boolean>(false);
  const [copiedCypher, setCopiedCypher] = useState<boolean>(false);

  // 3. Interactive Graph & Pinning State (ลากดึงและคงตำแหน่งไว้ได้)
  const [pinOnDrag, setPinOnDrag] = useState<boolean>(true);
  const [pinnedCount, setPinnedCount] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | undefined>(focusSubject);
  const [activeMuseumId, setActiveMuseumId] = useState<string | undefined>(focusMuseumId);
  const [nodeLimit, setNodeLimit] = useState<number>(100);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedMuseumType, setSelectedMuseumType] = useState<string>('all');
  const [showMuseums, setShowMuseums] = useState<boolean>(true);
  const [showSubjects, setShowSubjects] = useState<boolean>(true);
  const [showTypes, setShowTypes] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLayout, setCurrentLayout] = useState<string>('cose');
  const [colorTheme, setColorTheme] = useState<string>('terracotta');

  const provinces = useMemo(() => museumStore.getProvinces(), []);
  const museumTypesList = useMemo(() => museumStore.getMuseumTypes(), []);

  // If focus props passed, open interactive mode
  useEffect(() => {
    if (focusSubject || focusMuseumId) {
      setViewMode('interactive');
      setActiveSubject(focusSubject);
      setActiveMuseumId(focusMuseumId);
    }
  }, [focusSubject, focusMuseumId]);

  // Subscribe to real-time store changes
  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      const activeImgs = museumStore.getActiveKnowledgeGraphImages();
      setKgImages(activeImgs);
      const activeBlooms = museumStore.getActiveBloomPresets().filter(p => {
        const n = (p.name || '').toLowerCase();
        const id = (p.id || '').toLowerCase();
        return !n.includes('เทส') && !n.includes('test') && !n.includes('ทดสอบ') && !id.includes('test');
      });
      setBloomPresets(activeBlooms);
    });
    return () => unsub();
  }, []);

  // Current active image slide
  const currentImage = useMemo(() => {
    if (kgImages.length === 0) return null;
    const safeIdx = Math.max(0, Math.min(activeSlideIndex, kgImages.length - 1));
    return kgImages[safeIdx] || kgImages[0];
  }, [kgImages, activeSlideIndex]);

  // Auto slide effect
  useEffect(() => {
    if (!isAutoSlide || kgImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % kgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoSlide, kgImages.length]);

  const activePreset = useMemo(() => {
    return bloomPresets.find(p => p.id === activePresetId) || bloomPresets[0];
  }, [bloomPresets, activePresetId]);

  // Apply preset settings when preset is changed
  const handleSelectPreset = (preset: GraphBloomPreset) => {
    setActivePresetId(preset.id);
    setCurrentLayout(preset.layout);
    setColorTheme(preset.colorTheme);
    setNodeLimit(preset.maxNodes);
    if (preset.focusSubject) {
      setActiveSubject(preset.focusSubject);
    } else {
      setActiveSubject(undefined);
    }
  };

  // Generate graph elements based on current filter & focus (Supporting All 1,574 Data)
  const graphData = useMemo(() => {
    return museumStore.getKnowledgeGraphData({
      focusSubject: activeSubject,
      focusMuseumId: activeMuseumId,
      province: selectedProvince !== 'all' ? selectedProvince : undefined,
      museumType: selectedMuseumType !== 'all' ? selectedMuseumType : undefined,
      maxNodes: nodeLimit,
      includeAll: nodeLimit >= 1500
    });
  }, [activeSubject, activeMuseumId, selectedProvince, selectedMuseumType, nodeLimit]);

  // Color schemes for Neo4j Bloom style
  const themeColors = useMemo(() => {
    switch (colorTheme) {
      case 'emerald':
        return { museum: '#065f46', subject: '#10b981', border: '#047857', accent: '#34d399' };
      case 'royal':
        return { museum: '#1e40af', subject: '#3b82f6', border: '#1d4ed8', accent: '#60a5fa' };
      case 'gold':
        return { museum: '#78350f', subject: '#e6c12f', border: '#b45309', accent: '#fde047' };
      case 'amber':
        return { museum: '#92400e', subject: '#f59e0b', border: '#b45309', accent: '#fbbf24' };
      case 'terracotta':
      default:
        return { museum: '#9c7d5c', subject: '#e6c12f', border: '#755a3d', accent: '#e8c742' };
    }
  }, [colorTheme]);

  // Initialize Cytoscape when in bloom or interactive mode
  useEffect(() => {
    if (viewMode === 'image' || !containerRef.current) return;

    // Filter elements based on checkboxes
    const filteredNodes = graphData.nodes.filter(n => {
      if (n.type === 'Museum' && !showMuseums) return false;
      if (n.type === 'Subject' && !showSubjects) return false;
      if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = graphData.edges.filter(e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target));

    const elements = [
      ...filteredNodes.map(n => {
        const colorTheme = getNodeColorTheme(n);
        const pinnedPosition = pinnedPositionsRef.current.get(n.id);
        return {
          data: {
            id: n.id,
            label: n.label.length > 22 ? n.label.slice(0, 20) + '...' : n.label,
            fullLabel: n.label,
            type: n.type,
            degree: n.degree || 1,
            nodeMeta: n.meta,
            bgColor: colorTheme.bgColor,
            borderColor: colorTheme.borderColor,
            textColor: colorTheme.textColor,
            badgeLabel: colorTheme.badgeLabel,
            isPinned: Boolean(pinnedPosition)
          },
          ...(pinnedPosition ? { position: pinnedPosition, locked: true, classes: 'pinned' } : {})
        };
      }),
      ...filteredEdges.map(e => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          edgeType: e.type
        }
      }))
    ];

    const isBigGraph = elements.length > 250;
    const isMegaGraph = elements.length > 700;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      pixelRatio: isMegaGraph ? 1 : 'auto',
      textureOnViewport: isBigGraph,
      hideEdgesOnViewport: isMegaGraph,
      wheelSensitivity: 0.25,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#30271f',
            'font-family': 'Prompt, Bai Jamjuree, sans-serif',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'background-color': 'data(bgColor)',
            'border-width': 2.75,
            'border-color': 'data(borderColor)',
            'text-background-color': '#fffdf7',
            'text-background-opacity': 0.97,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': 'data(borderColor)',
            'text-border-width': 0.75,
            'text-border-opacity': 0.45,
            'width': 'mapData(degree, 1, 35, 24, 60)',
            'height': 'mapData(degree, 1, 35, 24, 60)',
            'shadow-blur': 14,
            'shadow-color': 'data(bgColor)',
            'shadow-opacity': 0.28,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 0.2
          } as any
        },
        {
          selector: 'node.pinned',
          style: {
            'border-width': 4,
            'border-color': themeColors.accent,
            'shadow-blur': 20,
            'shadow-color': themeColors.accent,
            'shadow-opacity': 0.9
          } as any
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 4,
            'border-color': themeColors.accent,
            'shadow-blur': 22,
            'shadow-color': themeColors.accent,
            'shadow-opacity': 0.95
          } as any
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 2.5,
            'line-color': themeColors.border,
            'target-arrow-color': themeColors.border,
            'opacity': 0.95
          }
        },
        {
          selector: 'node.dimmed',
          style: {
            'opacity': 0.2
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.6,
            'line-color': '#b8a88f',
            'target-arrow-color': '#9c7d5c',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            'opacity': 0.58
          }
        },
        {
          selector: 'edge.dimmed',
          style: {
            'opacity': 0.08
          }
        }
      ] as any,
      layout: {
        name: isMegaGraph && currentLayout === 'cose' ? 'concentric' : currentLayout,
        animate: !isBigGraph,
        animationDuration: isBigGraph ? 0 : 400,
        padding: 50,
        ...(currentLayout === 'cose' ? {
          nodeOverlap: 25,
          idealEdgeLength: () => 100,
          edgeElasticity: () => 90,
          numIter: isBigGraph ? 120 : 400
        } : {})
      } as any
    });

    // Node interaction: click to inspect and highlight neighbors
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const data = node.data();
      setSelectedEdge(null);
      setSelectedNode({
        id: data.id,
        label: data.fullLabel,
        type: data.type,
        degree: data.degree,
        meta: data.nodeMeta
      });

      cy.elements().removeClass('highlighted dimmed');
      const neighborhood = node.neighborhood().add(node);
      cy.elements().difference(neighborhood).addClass('dimmed');
      neighborhood.addClass('highlighted');
    });

    // Double-click/double-tap to toggle lock/pin
    let lastTapTime = 0;
    let lastTappedNodeId = '';
    cy.on('tap', 'node', (evt: EventObject) => {
      const now = performance.now();
      const node = evt.target;
      if (node.id() === lastTappedNodeId && now - lastTapTime < 340) {
        if (node.locked()) {
          node.unlock();
          node.removeClass('pinned');
          node.data('isPinned', false);
          pinnedPositionsRef.current.delete(node.id());
        } else {
          node.lock();
          node.addClass('pinned');
          node.data('isPinned', true);
          const position = node.position();
          pinnedPositionsRef.current.set(node.id(), { x: position.x, y: position.y });
        }
        setPinnedCount(cy.nodes('.pinned').length);
      }
      lastTapTime = now;
      lastTappedNodeId = node.id();
    });

    let dragOrigin: { x: number; y: number } | null = null;
    let draggedNeighbors: { node: NodeSingular; position: { x: number; y: number }; weight: number }[] = [];
    let dragDelta = { x: 0, y: 0 };
    let followFrame = 0;
    let followActive = false;

    // Eased follow loop: connected nodes glide toward their target offset instead of snapping.
    const followStep = () => {
      followFrame = 0;
      if (cy.destroyed()) return;
      let maxGap = 0;
      draggedNeighbors.forEach(({ node: neighbor, position: origin, weight }) => {
        if (neighbor.removed() || neighbor.locked()) return;
        const current = neighbor.position();
        const targetX = origin.x + dragDelta.x * weight;
        const targetY = origin.y + dragDelta.y * weight;
        const gapX = targetX - current.x;
        const gapY = targetY - current.y;
        maxGap = Math.max(maxGap, Math.abs(gapX), Math.abs(gapY));
        neighbor.position({ x: current.x + gapX * 0.12, y: current.y + gapY * 0.12 });
      });
      if (followActive || maxGap > 0.4) {
        followFrame = requestAnimationFrame(followStep);
      } else {
        draggedNeighbors = [];
      }
    };

    cy.on('grab', 'node', (evt: EventObject) => {
      const node = evt.target;
      node.unlock();
      dragOrigin = node.position();
      dragDelta = { x: 0, y: 0 };
      followActive = true;
      draggedNeighbors = [];
      const seen = new Set<string>([node.id()]);
      // Group by edges: direct neighbors follow strongly, second-degree neighbors follow softly.
      let frontier: NodeSingular[] = [node];
      [0.6, 0.25].forEach((weight) => {
        const next: NodeSingular[] = [];
        frontier.forEach((source) => {
          source.neighborhood('node').forEach((neighbor: NodeSingular) => {
            if (seen.has(neighbor.id()) || draggedNeighbors.length >= 80) return;
            seen.add(neighbor.id());
            next.push(neighbor);
            if (!neighbor.locked()) {
              draggedNeighbors.push({ node: neighbor, position: neighbor.position(), weight });
            }
          });
        });
        frontier = next;
      });
      if (!followFrame) followFrame = requestAnimationFrame(followStep);
    });

    cy.on('drag', 'node', (evt: EventObject) => {
      if (!dragOrigin) return;
      const position = evt.target.position();
      dragDelta = { x: position.x - dragOrigin.x, y: position.y - dragOrigin.y };
    });

    // Keep the dragged node fixed, then gently settle nearby nodes into the new graph shape.
    cy.on('dragfree', 'node', (evt: EventObject) => {
      const node = evt.target;
      if (pinOnDrag) {
        node.lock();
        node.addClass('pinned');
        node.data('isPinned', true);
        const position = node.position();
        pinnedPositionsRef.current.set(node.id(), { x: position.x, y: position.y });
        setPinnedCount(cy.nodes('.pinned').length);
      }
      // Let followers finish gliding to rest; the loop clears the group itself.
      followActive = false;
      dragOrigin = null;
      if (!followFrame) followFrame = requestAnimationFrame(followStep);
    });

    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const data = edge.data();
      setSelectedNode(null);
      setSelectedEdge({
        id: data.id,
        source: data.source,
        target: data.target,
        type: data.edgeType,
        label: data.label
      });
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
        cy.elements().removeClass('highlighted dimmed');
      }
    });

    cyRef.current = cy;
    setPinnedCount(cy.nodes('.pinned').length);

    return () => {
      if (followFrame) cancelAnimationFrame(followFrame);
      cy.destroy();
    };
  }, [graphData, showMuseums, showSubjects, showTypes, searchQuery, currentLayout, viewMode, pinOnDrag, themeColors]);

  const handleZoomIn = () => {
    if (viewMode === 'image') {
      setImageZoomLevel(z => Math.min(2.5, z + 0.25));
    } else if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.25);
    }
  };

  const handleZoomOut = () => {
    if (viewMode === 'image') {
      setImageZoomLevel(z => Math.max(0.6, z - 0.25));
    } else if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
    }
  };

  const handleFit = () => {
    if (viewMode === 'image') {
      setImageZoomLevel(1);
    } else if (cyRef.current) {
      cyRef.current.fit(undefined, 50);
    }
  };

  const handleReset = () => {
    setImageZoomLevel(1);
    setActiveSubject(undefined);
    setActiveMuseumId(undefined);
    setSearchQuery('');
    setSelectedNode(null);
    setSelectedEdge(null);
    if (cyRef.current) {
      cyRef.current.elements().removeClass('highlighted dimmed');
      cyRef.current.fit(undefined, 50);
    }
  };

  const handleLockAll = () => {
    if (!cyRef.current) return;
    cyRef.current.nodes().forEach(node => {
      node.lock();
      node.addClass('pinned');
      node.data('isPinned', true);
      const position = node.position();
      pinnedPositionsRef.current.set(node.id(), { x: position.x, y: position.y });
    });
    setPinnedCount(cyRef.current.nodes('.pinned').length);
  };

  const handleUnlockAll = () => {
    if (!cyRef.current) return;
    cyRef.current.nodes().unlock();
    cyRef.current.nodes().removeClass('pinned');
    cyRef.current.nodes().data('isPinned', false);
    pinnedPositionsRef.current.clear();
    setPinnedCount(0);
  };

  const handleToggleSelectedNodePin = () => {
    if (!cyRef.current || !selectedNode) return;
    const node = cyRef.current.getElementById(selectedNode.id);
    if (!node || node.length === 0) return;
    if (node.locked()) {
      node.unlock();
      node.removeClass('pinned');
      node.data('isPinned', false);
      pinnedPositionsRef.current.delete(node.id());
    } else {
      node.lock();
      node.addClass('pinned');
      node.data('isPinned', true);
      const position = node.position();
      pinnedPositionsRef.current.set(node.id(), { x: position.x, y: position.y });
    }
    setPinnedCount(cyRef.current.nodes('.pinned').length);
  };

  const handlePrevSlide = () => {
    if (kgImages.length === 0) return;
    setActiveSlideIndex(prev => (prev - 1 + kgImages.length) % kgImages.length);
    setImageZoomLevel(1);
  };

  const handleNextSlide = () => {
    if (kgImages.length === 0) return;
    setActiveSlideIndex(prev => (prev + 1) % kgImages.length);
    setImageZoomLevel(1);
  };

  const handleSelectSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    setImageZoomLevel(1);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `echoes_of_siam_graph_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyCypher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCypher(true);
    setTimeout(() => setCopiedCypher(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header section with modern badge and title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#d7c8b2]/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#ece4d4]/70 border border-[#d7c8b2] rounded-full text-xs font-heading font-medium text-[#463629] mb-2 shadow-2xs">
            <Network className="w-3.5 h-3.5 text-[#9c7d5c]" />
            <span>สถาปัตยกรรมกราฟความรู้มรดกสยาม • Discovery Knowledge Graph</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#463629]">
            กราฟความรู้ (Knowledge Graph)
          </h1>
          <p className="text-sm text-[#6f5a45] mt-1 max-w-3xl leading-relaxed">
            สำรวจเครือข่ายความสัมพันธ์เชิงความหมาย (Semantic Graph) ของพิพิธภัณฑ์ 1,574 แห่ง และหัวเรื่อง 2,460 เรื่อง เริ่มต้นด้วยแผนภาพความรู้หลัก (Image Knowledge Graph) หรือเลือกดูมุมมองบูมสำเร็จรูป Neo4j
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-white rounded-xl border border-[#d7c8b2] text-center shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-[#6f5a45] block font-heading">พิพิธภัณฑ์</span>
            <span className="text-lg font-bold font-editorial text-[#9c7d5c]">1,574 แห่ง</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-[#d7c8b2] text-center shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-[#6f5a45] block font-heading">หัวเรื่องเชื่อมโยง</span>
            <span className="text-lg font-bold font-editorial text-[#e6c12f]">2,460 เรื่อง</span>
          </div>
        </div>
      </div>

      {/* TOP VIEW MODE SELECTOR: Image Graph (FIRST/PRIMARY) vs Bloom Presets vs Live Network */}
      <div className="bg-[#fffdf7] rounded-2xl border border-[#d7c8b2] p-2 sm:p-2.5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          
          {/* Segmented Control Buttons */}
          <div className="flex items-center bg-[#ece4d4]/60 p-1 rounded-xl gap-1">
            
            {/* Tab 1: Image Knowledge Graph (เมนหลัก - ขึ้นเป็นรายการแรก) */}
            <button
              onClick={() => setViewMode('image')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                viewMode === 'image'
                  ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white shadow-md ring-2 ring-[#e6c12f]/50'
                  : 'text-[#6f5a45] hover:text-[#463629] hover:bg-white/60'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${viewMode === 'image' ? 'text-[#e6c12f]' : 'text-[#9c7d5c]'}`} />
              <span>แผนภาพกราฟความรู้หลัก (Image Graph)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                viewMode === 'image' ? 'bg-[#e6c12f] text-[#463629] font-bold' : 'bg-[#fffdf7] text-[#9c7d5c]'
              }`}>
                เมนหลัก
              </span>
            </button>

            {/* Tab 2: Neo4j Bloom Views */}
            <button
              onClick={() => setViewMode('bloom')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                viewMode === 'bloom'
                  ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white shadow-md ring-2 ring-[#e6c12f]/50'
                  : 'text-[#6f5a45] hover:text-[#463629] hover:bg-white/60'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${viewMode === 'bloom' ? 'text-[#e6c12f]' : 'text-[#9c7d5c]'}`} />
              <span>มุมมองบูมสำเร็จรูป ({bloomPresets.length} มุมมอง)</span>
            </button>

            {/* Tab 3: Live Interactive Cytoscape Explorer */}
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white shadow-md ring-2 ring-[#e6c12f]/50'
                  : 'text-[#6f5a45] hover:text-[#463629] hover:bg-white/60'
              }`}
            >
              <Network className={`w-4 h-4 ${viewMode === 'interactive' ? 'text-[#e6c12f]' : 'text-[#9c7d5c]'}`} />
              <span>กราฟปฏิสัมพันธ์สด (Live Network)</span>
            </button>

          </div>

        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: IMAGE KNOWLEDGE GRAPH (เมนหลัก - รายการแรกตามคำสั่ง)
         ========================================================================= */}
      {viewMode === 'image' && currentImage && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Slider Navigation & Admin Bar */}
          <div className="bg-[#fffdf7] rounded-2xl border border-[#d7c8b2] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Slide Selector Badges / Thumbnails */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-heading font-bold text-[#463629] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#9c7d5c]" />
                <span>สไลด์แผนภาพความรู้:</span>
              </span>
              
              {kgImages.length > 5 ? (
                <select
                  aria-label="เลือกแผนภาพกราฟความรู้"
                  value={activeSlideIndex}
                  onChange={(event) => handleSelectSlide(Number(event.target.value))}
                  className="min-w-0 w-full max-w-full rounded-xl border border-[#d7c8b2] bg-[#fffdf7] px-3 py-2 text-xs text-[#463629] sm:w-80"
                >
                  {kgImages.map((img, idx) => (
                    <option key={img.id} value={idx}>
                      {`${String(idx + 1).padStart(2, '0')} · ${img.title}`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex max-w-full flex-wrap items-center gap-1.5">
                  {kgImages.map((img, idx) => {
                    const isCur = idx === activeSlideIndex;
                    return (
                      <button
                        key={img.id}
                        onClick={() => handleSelectSlide(idx)}
                        className={`max-w-full px-3 py-1.5 rounded-xl text-xs font-heading transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCur
                            ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white font-bold shadow-md ring-2 ring-[#e6c12f]/60'
                            : 'bg-[#ece4d4]/60 text-[#6f5a45] hover:bg-[#ece4d4] hover:text-[#463629]'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isCur ? 'bg-[#e6c12f] animate-pulse' : 'bg-[#9c7d5c]/40'}`} />
                        <span className="max-w-[140px] truncate">{img.title}</span>
                        <span className="text-[10px] opacity-75 font-mono shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Single Column Vertical Layout: Full-Width Image Slider Viewer on Top */}
          <div className="space-y-8">
            
            {/* 1. Full-Width Interactive Image Slider with Zoom & Panning */}
            <div className="relative w-full bg-[#1c1410] rounded-2xl sm:rounded-3xl border-2 border-[#d7c8b2] overflow-hidden shadow-2xl flex flex-col group">
              
              {/* Viewer Action Bar */}
              <div className="p-3 sm:p-4 bg-black/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 text-white z-20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#e6c12f] text-[#463629] font-mono text-[11px] font-bold shrink-0">
                    ภาพที่ 0{activeSlideIndex + 1} / 0{kgImages.length}
                  </span>
                  <span className="text-xs sm:text-sm font-heading font-semibold text-[#e6c12f] truncate">
                    {currentImage.title}
                  </span>
                </div>

                {/* Slider and Zoom Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Auto Slide Toggle */}
                  {kgImages.length > 1 && kgImages.length <= 5 && (
                    <button
                      onClick={() => setIsAutoSlide(p => !p)}
                      className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                        isAutoSlide
                          ? 'bg-[#e6c12f] text-[#463629] border-[#e6c12f]'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                      }`}
                      title={isAutoSlide ? "หยุดเลื่อนสไลด์อัตโนมัติ" : "เล่นสไลด์อัตโนมัติ (เปลี่ยนทุก 6 วินาที)"}
                    >
                      {isAutoSlide ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="ขยายรูปภาพ (Zoom In)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="ย่อรูปภาพ (Zoom Out)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleFit}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="พอดีหน้าจอ (Reset Zoom)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e6c12f] text-[#463629] font-bold text-xs hover:bg-[#e8c742] transition-colors cursor-pointer shadow-md"
                    title="เปิดดูเต็มจอความละเอียดสูง (Fullscreen Lightbox)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>เต็มจอ</span>
                  </button>
                </div>
              </div>

              {/* Main Image Slider Area */}
              <div className="relative w-full h-[580px] sm:h-[720px] lg:h-[840px] xl:h-[900px] overflow-hidden flex items-center justify-center bg-radial-at-c from-[#241a14] via-[#16120e] to-[#0e0b08] cursor-grab active:cursor-grabbing">
                
                {/* Floating Left Slide Chevron */}
                {kgImages.length > 1 && (
                  <button
                    onClick={handlePrevSlide}
                    aria-label="สไลด์ก่อนหน้า"
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#e6c12f] transition-all hover:scale-108 active:scale-95 shadow-2xl cursor-pointer group/btn"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform text-[#e6c12f]" />
                  </button>
                )}

                {/* Floating Right Slide Chevron */}
                {kgImages.length > 1 && (
                  <button
                    onClick={handleNextSlide}
                    aria-label="สไลด์ถัดไป"
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#e6c12f] transition-all hover:scale-108 active:scale-95 shadow-2xl cursor-pointer group/btn"
                  >
                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform text-[#e6c12f]" />
                  </button>
                )}

                {/* Interactive Scaled Image */}
                <div 
                  className="transition-transform duration-300 ease-out select-none max-w-full max-h-full flex items-center justify-center p-4"
                  style={{ transform: `scale(${imageZoomLevel})` }}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    key={currentImage.id}
                    src={currentImage.imageUrl}
                    alt={currentImage.title}
                    className="max-h-[540px] sm:max-h-[680px] lg:max-h-[800px] xl:max-h-[860px] w-auto max-w-full object-contain rounded-xl shadow-2xl filter drop-shadow hover:brightness-105 transition-all animate-fade-in"
                  />
                </div>

                {/* Bottom Slide Indicator Pills */}
                {kgImages.length > 1 && (
                  <div className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 pointer-events-auto shadow-xl">
                      {kgImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectSlide(idx)}
                          aria-label={`ไปที่สไลด์ภาพที่ ${idx + 1}`}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            idx === activeSlideIndex
                              ? 'w-8 h-2 bg-gradient-to-r from-[#e6c12f] to-[#e8c742] shadow-sm'
                              : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Corner Watermark Tag */}
                <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-[#ece4d4] flex items-center gap-1.5 shadow-md z-10">
                  <Sparkles className="w-3.5 h-3.5 text-[#e6c12f]" />
                  <span>คลิกที่ภาพเพื่อเปิดดูขนาดใหญ่ความละเอียดสูง • เลื่อนซ้าย/ขวาเพื่อสลับสไลด์</span>
                </div>

                {/* Credit */}
                {currentImage.credit && (
                  <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/80 shadow-md z-10">
                    {currentImage.credit}
                  </div>
                )}
              </div>

            </div>

            {/* 2. Full-Width Editorial Content & Information (Underneath the image) */}
            <div className="w-full space-y-6">
              
              {/* Main Editorial Card */}
              <div className="bg-[#fffdf7] rounded-2xl sm:rounded-3xl border border-[#d7c8b2] p-6 sm:p-8 shadow-sm space-y-5">
                
                {/* Top Meta Badges & Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7c8b2]/60 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#e6c12f]/20 text-[#5c3d26] border border-[#e6c12f]/50 text-xs font-heading font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#b38742]" />
                      <span>แผนผังองค์ความรู้หลัก (Primary Knowledge Graph)</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#ece4d4]/70 text-[#6f5a45] text-xs font-heading">
                      คลังข้อมูล 1,574 พิพิธภัณฑ์ & 2,460 หัวเรื่อง
                    </span>
                  </div>

                  <span className="text-xs text-[#735640] font-mono">
                    อัปเดตล่าสุด: {new Date(currentImage.updatedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-[#382415] leading-snug">
                    {currentImage.title}
                  </h2>

                  {currentImage.subtitle && (
                    <p className="text-sm sm:text-base font-heading font-medium text-[#7a5230] leading-relaxed border-l-3 border-[#e6c12f] pl-3 py-1">
                      {currentImage.subtitle}
                    </p>
                  )}
                </div>

                {/* Description Paragraphs */}
                <div className="text-sm sm:text-base text-[#463629] leading-relaxed space-y-3 font-sans border-t border-[#d7c8b2]/50 pt-5">
                  <p className="whitespace-pre-line text-[#5c3d26] leading-relaxed">
                    {currentImage.description}
                  </p>
                </div>

                {/* Formatted Text Markdown/Sections */}
                {currentImage.formattedText && (
                  <div className="bg-[#ece4d4]/35 rounded-2xl p-5 sm:p-6 border border-[#d7c8b2]/80 text-xs sm:text-sm text-[#382415] space-y-3 shadow-2xs">
                    <div className="whitespace-pre-line font-sans leading-relaxed text-[#382415]">
                      {currentImage.formattedText}
                    </div>
                  </div>
                )}

                {/* Keyword Tags */}
                {currentImage.tags && currentImage.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#d7c8b2]/40">
                    <span className="text-xs font-heading font-semibold text-[#735640]">แท็กที่เกี่ยวข้อง:</span>
                    {currentImage.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#ece4d4]/60 text-[#463629] text-xs font-heading font-medium rounded-lg border border-[#d7c8b2]/60 hover:bg-[#ece4d4] transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Four Pillars Highlights Grid (Now gracefully spread across 4 columns) */}
              {currentImage.highlights && currentImage.highlights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e6c12f]" />
                    <h3 className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#382415]">
                      เสาหลักความเชื่อมโยงในแผนภาพ (Knowledge Architecture Pillars):
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentImage.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 bg-white rounded-2xl border border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c] hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-[#382415] font-heading">
                              {hl.title}
                            </h4>
                            {hl.tag && (
                              <span className="text-[10px] bg-[#ece4d4] px-2 py-0.5 rounded text-[#7a5230] font-mono font-semibold">
                                {hl.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#634b39] leading-relaxed">
                            {hl.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#d7c8b2]/60">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setViewMode('bloom')}
                    className="px-5 py-3 bg-gradient-to-r from-[#5c3d26] to-[#432818] hover:brightness-110 text-white text-xs sm:text-sm font-heading font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] border border-[#e6c12f]/40"
                  >
                    <Sparkles className="w-4 h-4 text-[#e6c12f]" />
                    <span>ดูมุมมองบูมสำเร็จรูป ({bloomPresets.length} มุมมอง Neo4j Bloom)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode('interactive')}
                    className="px-4 py-3 bg-white hover:bg-[#ece4d4]/50 text-[#382415] text-xs sm:text-sm font-heading font-semibold rounded-xl border border-[#d7c8b2] transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:border-[#9c7d5c]"
                  >
                    <Network className="w-4 h-4 text-[#7a5230]" />
                    <span>ทดลองลากขยับกราฟสด (Live Network)</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Fullscreen Lightbox Modal */}
          {lightboxOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in"
              onClick={() => setLightboxOpen(false)}
            >
              <div className="flex items-center justify-between text-white pb-3 border-b border-white/20">
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-[#e6c12f] font-editorial">
                    {currentImage.title}
                  </div>
                  <div className="text-xs text-white/70">
                    {currentImage.subtitle || 'แผนภาพกราฟความรู้สยามเล่าขาน (Echoes of Siam Knowledge Graph)'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageZoomLevel(z => Math.min(3, z + 0.3));
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="ขยาย"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageZoomLevel(z => Math.max(0.5, z - 0.3));
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="ย่อ"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                    title="ปิดหน้าต่างเต็มจอ"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div 
                className="flex-1 flex items-center justify-center overflow-auto p-4 cursor-grab"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.title}
                  style={{ transform: `scale(${imageZoomLevel})` }}
                  className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-200 select-none shadow-2xl rounded-lg"
                />
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: NEO4J BLOOM PERSPECTIVES (มุมมองบูมสำเร็จรูป คัดเลือกแล้ว)
         ========================================================================= */}
      {viewMode === 'bloom' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Preset Selector Bar */}
          <div className="bg-[#fffdf7] rounded-2xl border border-[#d7c8b2] p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d7c8b2]/50 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e6c12f]" />
                <span className="text-xs font-heading font-bold text-[#463629] uppercase tracking-wider">
                  เลือกมุมมองสำเร็จรูป (Neo4j Bloom Presets)
                </span>
                <span className="text-[10px] bg-[#ece4d4] px-2 py-0.5 rounded-full text-[#6f5a45] font-semibold">
                  {bloomPresets.length} มุมมองพร้อมใช้งาน
                </span>
              </div>

            </div>

            {/* Preset Chips */}
            <div className="flex flex-wrap items-center gap-2.5">
              {bloomPresets.map(preset => {
                const isSelected = preset.id === activePresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white shadow-md ring-2 ring-[#e6c12f]/60 font-semibold scale-[1.02]'
                        : 'bg-[#ece4d4]/50 hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2]/60'
                    }`}
                  >
                    <Network className={`w-3.5 h-3.5 ${isSelected ? 'text-[#e6c12f]' : 'text-[#9c7d5c]'}`} />
                    <span>{preset.name}</span>
                    {preset.badgeText && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#fffdf7] text-[#6f5a45] border border-[#d7c8b2]/40'
                      }`}>
                        {preset.badgeText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Perspective Info Bar */}
            {activePreset && (
              <div className="bg-[#ece4d4]/40 rounded-xl p-3 border border-[#d7c8b2]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 max-w-2xl">
                  <div className="font-semibold text-[#463629] flex items-center gap-2">
                    <span>{activePreset.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#9c7d5c]/10 text-[#9c7d5c] rounded-md font-sans">
                      Layout: {activePreset.layout}
                    </span>
                  </div>
                  <p className="text-[#6f5a45] text-[11px] leading-relaxed">
                    {activePreset.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {activePreset.neo4jUrl && (
                    <a
                      href={activePreset.neo4jUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#463629] hover:bg-[#2c221a] text-white rounded-lg transition-all shadow-xs text-xs font-heading font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#e6c12f]" />
                      <span>เปิดใน Neo4j Bloom</span>
                    </a>
                  )}

                  {activePreset.cypherQuery && (
                    <button
                      onClick={() => setShowCypherModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] rounded-lg transition-colors text-xs font-mono"
                    >
                      <Code className="w-3.5 h-3.5 text-[#9c7d5c]" />
                      <span>ดู Cypher Query</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Graph Canvas Rendered for this Bloom Preset */}
          <div className="relative overflow-hidden rounded-3xl border border-[#d6c6ad] bg-[#f7f3eb] shadow-[0_20px_60px_-28px_rgba(70,54,41,0.38)] ring-1 ring-white/80 h-[680px] flex flex-col">
            
            {/* Top Multi-Action Toolbar */}
            <div className="p-3 bg-gradient-to-r from-[#fffdf7] via-white to-[#f7efdf] backdrop-blur-md border-b border-[#e1d4c1] flex flex-wrap items-center justify-between gap-3 text-xs z-10">
              
              {/* Left: Perspective Info & Node Counts */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#463629] font-heading flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e6c12f]" />
                  <span>{activePreset?.name || 'Default'}</span>
                </span>
                <span className="text-[11px] text-[#6f5a45] bg-[#ece4d4]/60 px-2 py-0.5 rounded-md font-mono">
                  {graphData.nodes.length} โหนด • {graphData.edges.length} เส้น
                </span>
                {pinnedCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e6c12f]/20 text-[#5c3d26] border border-[#e6c12f]/60 text-[11px] font-mono font-bold animate-pulse">
                    <Pin className="w-3 h-3 fill-current" />
                    <span>ตรึงแล้ว {pinnedCount} โหนด</span>
                  </span>
                )}
              </div>

              {/* Center: Dynamic Node Scale Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[#6f5a45] font-heading hidden sm:inline">ขนาดข้อมูล:</span>
                <select
                  value={nodeLimit}
                  onChange={e => setNodeLimit(Number(e.target.value))}
                  className="px-2 py-1 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-semibold text-[#463629] cursor-pointer hover:border-[#9c7d5c] transition-colors"
                >
                  <option value={50}>50 โหนด (แสดงผลรวดเร็ว)</option>
                  <option value={100}>100 โหนด (มาตรฐาน)</option>
                  <option value={250}>250 โหนด (ภาพรวมกว้าง)</option>
                  <option value={500}>500 โหนด (เครือข่ายใหญ่)</option>
                  <option value={1000}>1,000 โหนด (มหาเครือข่าย)</option>
                  <option value={1574}>1,574 โหนด (ข้อมูลทั้งหมด 1,574 แห่ง • Full Universe)</option>
                </select>
              </div>

              {/* Right: Pinning & Viewport Controls */}
              <div className="flex flex-wrap items-center gap-1.5">
                
                {/* Pin on Drag Toggle */}
                <button
                  onClick={() => setPinOnDrag(p => !p)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-heading font-medium transition-all cursor-pointer ${
                    pinOnDrag 
                      ? 'bg-[#e6c12f] text-[#463629] border-[#e6c12f] font-bold shadow-xs' 
                      : 'bg-white hover:bg-[#ece4d4] text-[#6f5a45] border-[#d7c8b2]'
                  }`}
                  title={pinOnDrag ? "เปิดระบบตรึงตำแหน่ง: เมื่อลากโหนดแล้วจะค้างตำแหน่งไว้ ณ จุดนั้นทันที" : "ปิดระบบตรึงตำแหน่ง: โหนดจะเคลื่อนไหวตามแรงดึงดูดปกติ"}
                >
                  <Pin className={`w-3.5 h-3.5 ${pinOnDrag ? 'fill-current text-[#463629]' : 'text-[#9c7d5c]'}`} />
                  <span className="hidden md:inline">{pinOnDrag ? 'ตรึงเมื่อลาก: เปิด' : 'ตรึงเมื่อลาก: ปิด'}</span>
                </button>

                <button
                  onClick={handleLockAll}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] transition-colors cursor-pointer text-xs"
                  title="ตรึงทุกโหนดในหน้าจอให้อยู่กับที่"
                >
                  <Lock className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span className="hidden lg:inline">ตรึงทั้งหมด</span>
                </button>

                <button
                  onClick={handleUnlockAll}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] transition-colors cursor-pointer text-xs"
                  title="ปลดล็อกทุกโหนดให้ขยับอิสระได้"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span className="hidden lg:inline">ปลดล็อก</span>
                </button>

                <div className="h-4 w-px bg-[#d7c8b2] mx-0.5" />

                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ขยาย"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ย่อ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFit}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="จัดกึ่งกลาง"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="รีเซ็ตมุมมอง"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportJSON}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ดาวน์โหลด JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cytoscape Container */}
            <div
              ref={containerRef}
              className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
              style={{
                backgroundColor: '#f7f3eb',
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156,125,92,0.14) 1px, transparent 0), radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.82), rgba(247,243,235,0.96))',
                backgroundSize: '24px 24px, 100% 100%'
              }}
            />

            {/* Selected Node Details Drawer */}
            {selectedNode && (
              <div className="absolute top-16 right-4 z-20 w-84 max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#d7c8b2] p-4 shadow-2xl space-y-3 animate-in slide-in-from-right-2">
                <div className="flex items-start justify-between gap-2 border-b border-[#d7c8b2] pb-2.5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-mono font-bold ${
                        selectedNode.type === 'Museum' ? 'bg-[#9c7d5c] text-white' : 'bg-[#e6c12f] text-[#463629]'
                      }`}>
                        {selectedNode.type === 'Museum' ? 'พิพิธภัณฑ์' : 'หัวเรื่อง'}
                      </span>
                      {selectedNode.meta?.province && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#ece4d4] text-[#7a5230] rounded-md font-medium">
                          {selectedNode.meta.province}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#463629] font-editorial leading-snug">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 text-[#6f5a45] hover:text-[#463629] rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5 text-[#6f5a45]">
                  <div className="flex items-center justify-between">
                    <span>ระดับความเชื่อมโยง (Degree):</span>
                    <strong className="text-[#463629] font-mono">{selectedNode.degree} เส้น</strong>
                  </div>
                  {selectedNode.meta?.type && (
                    <div className="flex items-center justify-between">
                      <span>ประเภท:</span>
                      <strong className="text-[#463629]">{selectedNode.meta.type}</strong>
                    </div>
                  )}
                </div>

                {/* Node Pin/Freeze Action Button */}
                <button
                  onClick={handleToggleSelectedNodePin}
                  className="w-full py-1.5 px-3 bg-[#ece4d4]/70 hover:bg-[#ece4d4] text-[#463629] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#d7c8b2] transition-colors cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>สลับการตรึงตำแหน่งโหนดนี้ (Pin/Unpin)</span>
                </button>

                <div className="pt-2 border-t border-[#d7c8b2]/70 flex items-center gap-2">
                  {selectedNode.type === 'Museum' ? (
                    <button
                      onClick={() => onNavigate('museum-detail', { museumId: selectedNode.id })}
                      className="w-full py-2 bg-gradient-to-r from-[#9c7d5c] to-[#856748] hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>เปิดหน้ารายละเอียด</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('subjects', { initialSubject: selectedNode.label })}
                      className="w-full py-2 bg-gradient-to-r from-[#9c7d5c] to-[#856748] hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>สำรวจหัวเรื่องนี้</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Vibrant Color Legend & Interactive Helper Banner */}
            <div className="p-2.5 bg-[#ece4d4]/65 border-t border-[#d7c8b2] flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] text-[#6f5a45] px-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-[#463629] flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>สีโหนด:</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#78350f] border border-[#d97706]/40">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>โบราณคดี</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#581c87] border border-[#9333ea]/40">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span>ประณีตศิลป์ราชสำนัก</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#064e3b] border border-[#059669]/40">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>วิถีชีวิต & ผ้าทอ</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#7c2d12] border border-[#ea580c]/40">
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                  <span>ดินเผา & หัตถศิลป์</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#0c4a6e] border border-[#0369a1]/40">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  <span>ศาสนา & วัด</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#450a0a] border border-[#b91c1c]/40">
                  <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                  <span>พิพิธภัณฑ์แห่งชาติ</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#14532d] border border-[#15803d]/40">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <span>ชุมชน & ท้องถิ่น</span>
                </span>
              </div>

              <div className="text-[11px] text-[#735640] flex items-center gap-1.5 shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-[#9c7d5c]" />
                <span>คลิกลากเพื่อย้ายและตรึงตำแหน่งได้ทันที (ดับเบิลคลิกเพื่อปลดล็อก)</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: LIVE INTERACTIVE CYTOSCAPE EXPLORER
         ========================================================================= */}
      {viewMode === 'interactive' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Controls Bar: Filters & Search */}
          <div className="p-4 bg-white rounded-2xl border border-[#d7c8b2] shadow-sm flex flex-col gap-3 text-xs">
            
            {/* Filter Row 1: Checkboxes, Province, Type, & Node Limit */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#463629]">
                  <input
                    type="checkbox"
                    checked={showMuseums}
                    onChange={e => setShowMuseums(e.target.checked)}
                    className="w-4 h-4 accent-[#9c7d5c] cursor-pointer"
                  />
                  <span>แสดงพิพิธภัณฑ์</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#463629]">
                  <input
                    type="checkbox"
                    checked={showSubjects}
                    onChange={e => setShowSubjects(e.target.checked)}
                    className="w-4 h-4 accent-[#e6c12f] cursor-pointer"
                  />
                  <span>แสดงหัวเรื่อง</span>
                </label>

                <div className="h-4 w-px bg-[#d7c8b2]" />

                {/* Province Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6f5a45]">จังหวัด:</span>
                  <select
                    value={selectedProvince}
                    onChange={e => setSelectedProvince(e.target.value)}
                    className="p-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-medium text-[#463629] cursor-pointer"
                  >
                    <option value="all">ทุกจังหวัด (ทั่วประเทศ)</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Museum Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6f5a45]">ประเภท:</span>
                  <select
                    value={selectedMuseumType}
                    onChange={e => setSelectedMuseumType(e.target.value)}
                    className="p-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-medium text-[#463629] cursor-pointer"
                  >
                    <option value="all">ทุกประเภทพิพิธภัณฑ์</option>
                    {museumTypesList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick 1-Click Button to Load Full Universe of 1,574 Museums */}
              <button
                onClick={() => setNodeLimit(1574)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                  nodeLimit >= 1500
                    ? 'bg-gradient-to-r from-[#e6c12f] to-[#e8c742] text-[#463629] shadow-md ring-2 ring-[#e6c12f]/60'
                    : 'bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2]'
                }`}
                title="สร้างกราฟความรู้ครอบคลุมข้อมูลพิพิธภัณฑ์ทั้งหมด 1,574 แห่ง"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9c7d5c]" />
                <span>มหาจักรวาลข้อมูลทั้งหมด 1,574 แห่ง</span>
              </button>
            </div>

            {/* Filter Row 2: Node Limit, Layout, Search, and Pin Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#d7c8b2]/60">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#6f5a45]">จำนวนโหนด:</span>
                  <select
                    value={nodeLimit}
                    onChange={e => setNodeLimit(Number(e.target.value))}
                    className="p-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-semibold text-[#463629] cursor-pointer"
                  >
                    <option value={50}>50 โหนด (แสดงผลรวดเร็ว)</option>
                    <option value={100}>100 โหนด (มาตรฐาน)</option>
                    <option value={250}>250 โหนด (ภาพรวมกว้าง)</option>
                    <option value={500}>500 โหนด (เครือข่ายใหญ่)</option>
                    <option value={1000}>1,000 โหนด (มหาเครือข่าย)</option>
                    <option value={1574}>1,574 โหนด (ข้อมูลทั้งหมด 1,574 แห่ง)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#6f5a45]">รูปแบบการจัดวาง:</span>
                  <select
                    value={currentLayout}
                    onChange={e => setCurrentLayout(e.target.value)}
                    className="p-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-semibold text-[#463629] cursor-pointer"
                  >
                    <option value="cose">CoSE (ฟิสิกส์แรงดึงดูด)</option>
                    <option value="concentric">Concentric (วงกลมศูนย์กลาง)</option>
                    <option value="circle">Circle (วงกลมรอบ)</option>
                    <option value="breadthfirst">Breadthfirst (ลำดับชั้น)</option>
                  </select>
                </div>

                {/* Pin on Drag Toggle */}
                <button
                  onClick={() => setPinOnDrag(p => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-heading font-medium transition-colors cursor-pointer ${
                    pinOnDrag 
                      ? 'bg-[#e6c12f] text-[#463629] border-[#e6c12f] font-bold shadow-xs' 
                      : 'bg-[#fffdf7] hover:bg-[#ece4d4] text-[#6f5a45] border-[#d7c8b2]'
                  }`}
                  title="เมื่อลากโหนดแล้ว โหนดจะค้างตำแหน่งไว้ ณ จุดนั้นทันที"
                >
                  <Pin className={`w-3.5 h-3.5 ${pinOnDrag ? 'fill-current' : ''}`} />
                  <span>{pinOnDrag ? 'ตรึงเมื่อลาก: เปิด' : 'ตรึงเมื่อลาก: ปิด'}</span>
                </button>

                <button
                  onClick={handleLockAll}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] transition-colors cursor-pointer"
                  title="ตรึงทุกโหนดในหน้าจอ"
                >
                  <Lock className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>ตรึงทั้งหมด</span>
                </button>

                <button
                  onClick={handleUnlockAll}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] transition-colors cursor-pointer"
                  title="ปลดล็อกทุกโหนด"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>ปลดล็อก</span>
                </button>

                {pinnedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#e6c12f]/20 text-[#5c3d26] border border-[#e6c12f]/60 font-mono font-bold text-[11px]">
                    ตรึง {pinnedCount} โหนด
                  </span>
                )}
              </div>

              {/* Search within graph */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9c7d5c] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาโหนดในกราฟ..."
                  className="pl-8 pr-3 py-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c] w-48 sm:w-60"
                />
              </div>
            </div>

          </div>

          {/* Interactive Graph Container */}
          <div className="relative overflow-hidden rounded-3xl border border-[#d6c6ad] bg-[#f7f3eb] shadow-[0_20px_60px_-28px_rgba(70,54,41,0.38)] ring-1 ring-white/80 h-[680px] flex flex-col">
            
            {/* Viewport Action Bar */}
            <div className="p-3 bg-gradient-to-r from-[#fffdf7] via-white to-[#f7efdf] backdrop-blur-md border-b border-[#e1d4c1] flex items-center justify-between gap-3 text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#463629] font-heading">
                  กราฟสดเชิงโต้ตอบ (Live Interactive Network)
                </span>
                <span className="text-[11px] text-[#6f5a45] bg-[#ece4d4]/60 px-2 py-0.5 rounded-md font-mono">
                  {graphData.nodes.length} โหนด • {graphData.edges.length} เส้น
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ขยาย"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ย่อ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFit}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="จัดกึ่งกลาง"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="รีเซ็ตมุมมอง"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportJSON}
                  className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                  title="ดาวน์โหลด JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cytoscape Container */}
            <div
              ref={containerRef}
              className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
              style={{
                backgroundColor: '#f7f3eb',
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156,125,92,0.14) 1px, transparent 0), radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.82), rgba(247,243,235,0.96))',
                backgroundSize: '24px 24px, 100% 100%'
              }}
            />

            {/* Selected Node Details Drawer */}
            {selectedNode && (
              <div className="absolute top-16 right-4 z-20 w-84 max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#d7c8b2] p-4 shadow-2xl space-y-3 animate-in slide-in-from-right-2">
                <div className="flex items-start justify-between gap-2 border-b border-[#d7c8b2] pb-2.5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-mono font-bold ${
                        selectedNode.type === 'Museum' ? 'bg-[#9c7d5c] text-white' : 'bg-[#e6c12f] text-[#463629]'
                      }`}>
                        {selectedNode.type === 'Museum' ? 'พิพิธภัณฑ์' : 'หัวเรื่อง'}
                      </span>
                      {selectedNode.meta?.province && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#ece4d4] text-[#7a5230] rounded-md font-medium">
                          {selectedNode.meta.province}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#463629] font-editorial leading-snug">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 text-[#6f5a45] hover:text-[#463629] rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5 text-[#6f5a45]">
                  <div className="flex items-center justify-between">
                    <span>ระดับความเชื่อมโยง (Degree):</span>
                    <strong className="text-[#463629] font-mono">{selectedNode.degree} เส้น</strong>
                  </div>
                  {selectedNode.meta?.type && (
                    <div className="flex items-center justify-between">
                      <span>ประเภท:</span>
                      <strong className="text-[#463629]">{selectedNode.meta.type}</strong>
                    </div>
                  )}
                </div>

                {/* Node Pin/Freeze Action Button */}
                <button
                  onClick={handleToggleSelectedNodePin}
                  className="w-full py-1.5 px-3 bg-[#ece4d4]/70 hover:bg-[#ece4d4] text-[#463629] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#d7c8b2] transition-colors cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>สลับการตรึงตำแหน่งโหนดนี้ (Pin/Unpin)</span>
                </button>

                <div className="pt-2 border-t border-[#d7c8b2]/70 flex items-center gap-2">
                  {selectedNode.type === 'Museum' ? (
                    <button
                      onClick={() => onNavigate('museum-detail', { museumId: selectedNode.id })}
                      className="w-full py-2 bg-gradient-to-r from-[#9c7d5c] to-[#856748] hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>เปิดหน้ารายละเอียด</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('subjects', { initialSubject: selectedNode.label })}
                      className="w-full py-2 bg-gradient-to-r from-[#9c7d5c] to-[#856748] hover:brightness-105 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>สำรวจหัวเรื่องนี้</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Vibrant Color Legend & Helper */}
            <div className="p-2.5 bg-[#ece4d4]/65 border-t border-[#d7c8b2] flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] text-[#6f5a45] px-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-[#463629] flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>สีโหนด:</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#78350f] border border-[#d97706]/40">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>โบราณคดี</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#581c87] border border-[#9333ea]/40">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span>ประณีตศิลป์ราชสำนัก</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#064e3b] border border-[#059669]/40">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>วิถีชีวิต & ผ้าทอ</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#7c2d12] border border-[#ea580c]/40">
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                  <span>ดินเผา & หัตถศิลป์</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#0c4a6e] border border-[#0369a1]/40">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  <span>ศาสนา & วัด</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#450a0a] border border-[#b91c1c]/40">
                  <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                  <span>พิพิธภัณฑ์แห่งชาติ</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[#14532d] border border-[#15803d]/40">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <span>ชุมชน & ท้องถิ่น</span>
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>ลากโหนดเพื่อตรึงตำแหน่ง (ดับเบิลคลิกเพื่อปลดล็อก)</span>
                </span>
                <button
                  onClick={handleReset}
                  className="font-semibold text-[#9c7d5c] hover:underline cursor-pointer"
                >
                  รีเซ็ต
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Cypher Query Modal */}
      {showCypherModal && activePreset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#d7c8b2] max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d7c8b2] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#9c7d5c]" />
                <h3 className="text-base font-bold text-[#463629] font-editorial">
                  Cypher Query (Neo4j Integration)
                </h3>
              </div>
              <button
                onClick={() => setShowCypherModal(false)}
                className="p-1 text-[#6f5a45] hover:text-[#463629] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#6f5a45]">
              คำสั่งแบบสอบถามเชิงกราฟ (Cypher) สำหรับมุมมอง <strong>"{activePreset.name}"</strong>:
            </div>

            <div className="relative bg-[#241a14] rounded-xl p-4 text-[#e6c12f] font-mono text-xs overflow-x-auto border border-[#463629]">
              <code>{activePreset.cypherQuery || 'MATCH (m:Museum)-[r]->(n) RETURN m, r, n LIMIT 60'}</code>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopyCypher(activePreset.cypherQuery || '')}
                className="px-4 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCypher ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCypher ? 'คัดลอกสำเร็จ!' : 'คัดลอกคำสั่ง Cypher'}</span>
              </button>
              <button
                onClick={() => setShowCypherModal(false)}
                className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-xs text-[#6f5a45] hover:bg-[#ece4d4]"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
