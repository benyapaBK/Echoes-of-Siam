import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  ExternalLink,
  Minimize2,
  Globe,
  Move,
  Save,
  Check,
  Search,
  CheckCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  MessageSquare,
  ChevronRight,
  EyeOff
} from 'lucide-react';
import { getMascotSizePixels, museumStore } from '../../services/museumStore';
import { useAuth } from '../../context/AuthContext';
import type { Museum, MascotConfig, MascotFaq, MascotStateName, MascotPosition } from '../../types/museum';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  pose?: string;
  cards?: {
    type: 'museum' | 'graph' | 'subject' | 'google';
    title: string;
    subtitle?: string;
    targetTab?: string;
    targetMeta?: any;
    externalUrl?: string;
  }[];
  timestamp: string;
}

interface NongMiuMiuChatbotProps {
  onNavigate: (tab: string, meta?: any) => void;
}

// 14 Mascot States mapped to official 21 chibi images
const DEFAULT_STATE_IMAGES: Record<MascotStateName, string> = {
  idle: '/assets/mascot/IMG_8169.PNG',        // Holding flag smiling
  greeting: '/assets/mascot/IMG_8172.PNG',    // Open arms smiling with sparkles
  chat: '/assets/mascot/IMG_8170.PNG',        // Cheerful explainer
  typing: '/assets/mascot/IMG_8179.PNG',      // Journaling / typing note
  thinking: '/assets/mascot/IMG_8176.PNG',    // Thinking posture
  listening: '/assets/mascot/IMG_8171.PNG',   // Cheerful standing listening
  presenting: '/assets/mascot/IMG_8173.PNG',  // Pointing / presenting
  happy: '/assets/mascot/IMG_8175.PNG',       // Clapping joyfully
  surprised: '/assets/mascot/IMG_8187.PNG',   // Starry amazed eyes
  confused: '/assets/mascot/IMG_8186.PNG',    // Holding magnifying glass wondering
  success: '/assets/mascot/IMG_8181.PNG',     // Holding heritage key
  error: '/assets/mascot/IMG_8188.PNG',       // Waving hand
  sleeping: '/assets/mascot/IMG_8189.PNG',    // Sitting drinking tea
  goodbye: '/assets/mascot/IMG_8188.PNG'      // Waving goodbye
};

export const NongMiuMiuChatbot: React.FC<NongMiuMiuChatbotProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMascotVisible, setIsMascotVisible] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<MascotConfig>(() => museumStore.getMascotConfig());
  const [currentState, setCurrentState] = useState<MascotStateName>('greeting');
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Admin Free Drag Mode state
  const [isDragModeActive, setIsDragModeActive] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<{ x?: number; y?: number; bottom: number; right: number }>({
    bottom: config.position?.bottom ?? 28,
    right: config.position?.right ?? 28
  });
  const [showPositionSavedToast, setShowPositionSavedToast] = useState<boolean>(false);
  const lastRightClickTimeRef = useRef<number>(0);

  // Sound effects toggle
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: config.greeting || 'สวัสดีครับ! ผมคือ MIUMIU ยินดีพาสำรวจคลังพิพิธภัณฑ์ 1,574 แห่งและกราฟความรู้สยามเล่าขานครับ มีข้อสงสัยเรื่องมรดกหรือหัวเรื่องไหน ถามผมได้เลยนะครับ!',
      pose: config.stateImages?.greeting || DEFAULT_STATE_IMAGES.greeting,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Subscribe to config changes from Admin
  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      const updated = museumStore.getMascotConfig();
      setConfig(updated);
      if (updated.position && !isDragModeActive) {
        setDragPosition({
          bottom: updated.position.bottom ?? 28,
          right: updated.position.right ?? 28,
          x: updated.position.x,
          y: updated.position.y
        });
      }
    });
    return () => unsub();
  }, [isDragModeActive]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Hide speech bubble after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Play subtle feedback chime
  const playChime = () => {
    if (soundMuted || !config.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext may be restricted by browser policy
    }
  };

  // Double Right-Click Event Listener to activate Admin Free Dragging Mode
  // Requirement: "ลากมาสคอตไปยังตำแหน่งที่ต้องการอย่างอิสระทั่วทั้งหน้าจอโดยที่ต้องดับเบิลคลิกขวาที่เมาส์สองครั้งเพื่อเปิดโหมดเคลื่อนย้ายมาสคอตอย่างอิสระ"
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isAdmin) return; // Only Admin can activate free drag mode

    e.preventDefault();
    const now = Date.now();
    const diff = now - lastRightClickTimeRef.current;
    lastRightClickTimeRef.current = now;

    if (diff < 450) {
      // Double right-click detected!
      setIsDragModeActive(prev => !prev);
      playChime();
    }
  };

  // Drag mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragModeActive || !isAdmin) return;
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startRight = dragPosition.right;
    const startBottom = dragPosition.bottom;

    const onMouseMove = (moveEvt: MouseEvent) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      // Calculate new bottom and right bounds
      const newRight = Math.max(10, Math.min(window.innerWidth - 120, startRight - deltaX));
      const newBottom = Math.max(10, Math.min(window.innerHeight - 150, startBottom - deltaY));

      setDragPosition({
        bottom: newBottom,
        right: newRight
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Save current position as global website position
  const handleSaveGlobalPosition = () => {
    museumStore.updateMascotPosition(dragPosition);
    setIsDragModeActive(false);
    setShowPositionSavedToast(true);
    playChime();
    setTimeout(() => setShowPositionSavedToast(false), 3500);
  };

  // Reset to default position
  const handleResetPosition = () => {
    const defaultPos = { bottom: 28, right: 28, isCustomDrag: false };
    setDragPosition(defaultPos);
    museumStore.updateMascotPosition(defaultPos);
    setIsDragModeActive(false);
    setShowPositionSavedToast(true);
    setTimeout(() => setShowPositionSavedToast(false), 3000);
  };

  if (!config.enabled) return null;

  // Resolve current pose image based on state
  const getPoseForState = (state: MascotStateName): string => {
    return (config.stateImages && config.stateImages[state]) || DEFAULT_STATE_IMAGES[state] || config.currentPose || DEFAULT_STATE_IMAGES.idle;
  };

  // Smart Heritage Q&A Response Generator
  const generateResponse = (userQuery: string): ChatMessage => {
    const q = userQuery.trim().toLowerCase();
    const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // 1. Check custom admin FAQs first
    if (config.customFaqs && config.customFaqs.length > 0) {
      for (const faq of config.customFaqs) {
        if (q.includes(faq.question.toLowerCase()) || faq.question.toLowerCase().includes(q)) {
          setCurrentState('presenting');
          return {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: faq.answer,
            pose: getPoseForState('presenting'),
            cards: faq.targetTab ? [{
              type: 'graph',
              title: faq.question,
              targetTab: faq.targetTab,
              targetMeta: faq.targetMeta
            }] : undefined,
            timestamp: timeStr
          };
        }
      }
    }

    // 2. Knowledge Graph questions
    if (q.includes('กราฟ') || q.includes('graph') || q.includes('bloom') || q.includes('ความรู้') || q.includes('living memory')) {
      setCurrentState('presenting');
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'กราฟความรู้สยาม (Echoes of Siam Knowledge Graph) คือแผนผังโครงข่ายความสัมพันธ์ระหว่าง 1,574 พิพิธภัณฑ์ และ 2,460 หัวเรื่องทางวัฒนธรรมครับ!\n\nในหน้านี้ คุณสามารถดู "แผนภาพกราฟความรู้หลัก (Image Knowledge Graph)" ซึ่งเป็นมหาจักรวาลความทรงจำ หรือเปิดดู "มุมมองบูมสำเร็จรูป Neo4j Bloom" เช่น โบราณคดีบ้านเชียง หรืองานช่างสิบหมู่ได้ทันทีครับ',
        pose: getPoseForState('presenting'),
        cards: [
          {
            type: 'graph',
            title: 'เปิดสำรวจกราฟความรู้สยาม',
            subtitle: 'ดูแผนภาพความรู้หลัก & มุมมอง Neo4j Bloom',
            targetTab: 'graph'
          }
        ],
        timestamp: timeStr
      };
    }

    // 3. Search museums by Province
    const provinces = ['กรุงเทพ', 'เชียงใหม่', 'เชียงราย', 'ภูเก็ต', 'ขอนแก่น', 'อยุธยา', 'อุดรธานี', 'นครราชสีมา', 'สุโขทัย', 'น่าน', 'สงขลา', 'ลำปาง', 'ลำพูน', 'แพร่', 'พะเยา', 'แม่ฮ่องสอน', 'อุบลราชธานี', 'บุรีรัมย์', 'สุรินทร์', 'ร้อยเอ็ด', 'สกลนคร', 'นครพนม', 'หนองคาย', 'กาญจนบุรี', 'สุพรรณบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'นครศรีธรรมราช', 'สุราษฎร์ธานี', 'กระบี่'];
    for (const prov of provinces) {
      if (q.includes(prov.toLowerCase())) {
        const found = museumStore.getMuseums().filter((m: Museum) => m.province?.toLowerCase().includes(prov.toLowerCase())).slice(0, 3);
        if (found.length > 0) {
          setCurrentState('happy');
          return {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: `น้องมิวมิวค้นพบพิพิธภัณฑ์ใน ${prov} จากคลังข้อมูล 1,574 แห่ง ขอยกตัวอย่างที่น่าสนใจดังนี้ครับ:`,
            pose: getPoseForState('happy'),
            cards: found.map((m: Museum) => ({
              type: 'museum',
              title: m.title,
              subtitle: `${m.province} • ประเภท: ${m.type || 'พิพิธภัณฑ์'}`,
              targetTab: 'museum-detail',
              targetMeta: { museumId: m.id }
            })),
            timestamp: timeStr
          };
        }
      }
    }

    // 4. Search topics: โบราณคดี, ผ้าทอ, บ้านเชียง, ดินเผา, งานช่าง, วัด
    if (q.includes('บ้านเชียง') || q.includes('โบราณคดี') || q.includes('ดินเผา')) {
      const matchMuseums = museumStore.getMuseums().filter((m: Museum) => 
        (m.title + (m.subjectRaw || '')).includes('บ้านเชียง') || (m.title + (m.subjectRaw || '')).includes('โบราณคดี')
      ).slice(0, 3);

      setCurrentState('presenting');
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'เรื่องโบราณคดีและวัฒนธรรมบ้านเชียง มีความสำคัญมากครับ! แหล่งโบราณคดีบ้านเชียงมีอายุย้อนหลังกว่า 3,000 ปี โดดเด่นด้วยเครื่องปั้นดินเผาลายเขียนสีแดงอันวิจิตร น้องมิวมิวขอแนะนำพิพิธภัณฑ์ที่เกี่ยวข้องดังนี้ครับ:',
        pose: getPoseForState('presenting'),
        cards: matchMuseums.map((m: Museum) => ({
          type: 'museum',
          title: m.title,
          subtitle: `${m.province} • ${m.type || 'โบราณคดี'}`,
          targetTab: 'museum-detail',
          targetMeta: { museumId: m.id }
        })),
        timestamp: timeStr
      };
    }

    if (q.includes('ผ้า') || q.includes('ทอ') || q.includes('ไหม')) {
      const matchMuseums = museumStore.getMuseums().filter((m: Museum) => 
        (m.title + (m.subjectRaw || '')).includes('ผ้า') || (m.title + (m.subjectRaw || '')).includes('ทอ')
      ).slice(0, 3);

      setCurrentState('presenting');
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'มรดกผ้าทอพื้นถิ่นและผ้าไหมไทย สะท้อนวิถีชีวิตและภูมิปัญญาของ 391 ชุมชนชาติพันธุ์ทั่วประเทศครับ นี่คือพิพิธภัณฑ์ผ้าทอที่น่าสนใจ:',
        pose: getPoseForState('presenting'),
        cards: matchMuseums.map((m: Museum) => ({
          type: 'museum',
          title: m.title,
          subtitle: `${m.province} • ${m.type || 'ภูมิปัญญาผ้าทอ'}`,
          targetTab: 'museum-detail',
          targetMeta: { museumId: m.id }
        })),
        timestamp: timeStr
      };
    }

    // 5. Recommendations query
    if (q.includes('แนะนำ') || q.includes('เที่ยว') || q.includes('เด่น') || q.includes('ไม่ควรพลาด')) {
      const featured = museumStore.getMuseums().slice(0, 3);
      setCurrentState('happy');
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'น้องมิวมิวขอแนะนำ 3 แหล่งเรียนรู้มรดกทางวัฒนธรรมชั้นนำที่รวบรวมโบราณวัตถุและภูมิปัญญาชาติอันทรงคุณค่าครับ:',
        pose: getPoseForState('happy'),
        cards: featured.map((m: Museum) => ({
          type: 'museum',
          title: m.title,
          subtitle: `${m.province} • ${m.type || 'พิพิธภัณฑ์สำคัญ'}`,
          targetTab: 'museum-detail',
          targetMeta: { museumId: m.id }
        })),
        timestamp: timeStr
      };
    }

    // 6. General Keyword Search across 1,574 museums
    const generalFound = museumStore.getMuseums().filter((m: Museum) => 
      m.title.toLowerCase().includes(q) || (m.subjectRaw && m.subjectRaw.toLowerCase().includes(q))
    ).slice(0, 3);

    if (generalFound.length > 0) {
      setCurrentState('chat');
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `น้องมิวมิวค้นพบพิพิธภัณฑ์ที่เกี่ยวข้องกับ "${userQuery}" ในระบบ 1,574 แห่ง ดังนี้ครับ:`,
        pose: getPoseForState('chat'),
        cards: generalFound.map((m: Museum) => ({
          type: 'museum',
          title: m.title,
          subtitle: `${m.province} • ${m.type || 'พิพิธภัณฑ์'}`,
          targetTab: 'museum-detail',
          targetMeta: { museumId: m.id }
        })),
        timestamp: timeStr
      };
    }

    // 7. CRITICAL FALLBACK REQUIREMENT:
    // If not found in database: Save to user inquiries for Admin review AND link to Google Search!
    // "และหากข้อมูลไหนไม่มีในระบบโดยที่น้องมิวมิวไม่สามารถตอบได้จะต้องเพิ่มตัวเลือกให้สามารถลิงค์กับการไปหาในกูเกิลได้ และต้องบันทึกคำถามนั้นๆของผู้ใช้งานเข้าสู่ระบบและเพิ่มไว้ใน้เมนูข้อความจากผู้ใช้งานในระบบแอดมิน"
    museumStore.addUserInquiry(userQuery);
    setCurrentState('confused');

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(userQuery + ' พิพิธภัณฑ์ ภูมิปัญญาไทย')}`;

    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `น้องมิวมิวยังไม่พบข้อมูลที่ตรงกับ "${userQuery}" ในคลัง 1,574 พิพิธภัณฑ์และหัวเรื่องของสยามครับ แต่น้องมิวมิวได้บันทึกคำถามนี้เข้าสู่ระบบเรียบร้อยแล้ว เพื่อให้ผู้ดูแลระบบตรวจสอบและนำมาเพิ่มเป็นองค์ความรู้ต่อไปครับ!\n\nในระหว่างนี้ คุณสามารถค้นหาข้อมูลเพิ่มเติมบน Google ได้ที่ปุ่มด้านล่างนี้เลยครับ:`,
      pose: getPoseForState('confused'),
      cards: [
        {
          type: 'google',
          title: `ค้นหาเพิ่มเติมบน Google: "${userQuery}"`,
          subtitle: 'เปิดค้นหาแหล่งข้อมูลภายนอกและบทความวิจัยที่เกี่ยวข้อง',
          externalUrl: googleSearchUrl
        },
        {
          type: 'museum',
          title: 'สำรวจสารบัญ 1,574 พิพิธภัณฑ์ทั้งหมด',
          subtitle: 'ค้นหาด้วยตัวกรอง 77 จังหวัด',
          targetTab: 'museums'
        }
      ],
      timestamp: timeStr
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setCurrentState('thinking');
    playChime();

    // Simulate smart thinking delay
    setTimeout(() => {
      const botResponse = generateResponse(text);
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      playChime();
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'bot',
        text: config.greeting || 'สวัสดีครับ! มีเรื่องราวพิพิธภัณฑ์ไหนที่น้องมิวมิวสามารถช่วยค้นหาได้บ้างครับ?',
        pose: getPoseForState('greeting'),
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCurrentState('greeting');
  };

  const handleShowMascot = () => {
    setIsMascotVisible(true);
    setIsSidePanelOpen(false);
    setShowSpeechBubble(false);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMascotVisible(false);
    setIsSidePanelOpen(false);
    setShowSpeechBubble(false);
    setCurrentState('chat');
    playChime();
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsSidePanelOpen(open => !open)}
          aria-label={isSidePanelOpen ? 'ปิดแถบมาสคอต' : 'เปิดเมนูมาสคอต'}
          aria-expanded={isSidePanelOpen}
          title={isSidePanelOpen ? 'ปิดแถบมาสคอต' : 'เลือกเปิดมาสคอตหรือแชทบอท'}
          className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-[#e6c12f]/70 bg-[#463629] px-2 py-3 text-[#fff9c4] shadow-xl transition-colors hover:bg-[#5c3d26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c12f]"
        >
          {isSidePanelOpen ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="[writing-mode:vertical-rl] text-[10px] font-bold tracking-wide">
            {isSidePanelOpen ? 'ปิดเมนู' : 'น้องมิวมิว'}
          </span>
        </button>
      )}

      {isSidePanelOpen && !isOpen && (
        <div className="fixed right-12 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 rounded-2xl border border-[#d7c8b2] bg-[#fffdf7] p-2.5 shadow-2xl animate-in slide-in-from-right-2">
          <button
            type="button"
            onClick={isMascotVisible ? () => {
              setIsMascotVisible(false);
              setIsSidePanelOpen(false);
            } : handleShowMascot}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#463629] transition-colors hover:bg-[#ece4d4]"
          >
            {isMascotVisible
              ? <EyeOff className="h-4 w-4 text-[#9c7d5c]" />
              : <Sparkles className="h-4 w-4 text-[#9c7d5c]" />}
            {isMascotVisible ? 'ซ่อนมาสคอต' : 'เรียกมาสคอต'}
          </button>
          <button
            type="button"
            onClick={handleOpenChat}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#463629] px-3 py-2 text-left text-xs font-semibold text-[#fff9c4] transition-colors hover:bg-[#5c3d26]"
          >
            <MessageSquare className="h-4 w-4 text-[#e6c12f]" />
            เปิดแชทบอท
          </button>
        </div>
      )}

      {/* Toast Notification for Position Saved */}
      {showPositionSavedToast && (
        <div className="fixed top-20 right-6 z-50 p-3.5 bg-emerald-900 text-white border border-emerald-500 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">บันทึกตำแหน่งกลางของน้องมิวมิวสำเร็จ!</div>
            <div className="text-[11px] text-emerald-200">ผู้เข้าชมทุกคนจะเห็นตำแหน่งใหม่นี้ตรงกัน</div>
          </div>
        </div>
      )}

      {/* Floating Mascot Widget Container */}
      <div 
        style={{
          position: 'fixed',
          bottom: `${dragPosition.bottom}px`,
          right: `${dragPosition.right}px`,
          zIndex: 45
        }}
        className="flex flex-col items-end select-none"
      >
        
        {/* Admin Drag Mode Controller HUD */}
        {isDragModeActive && isAdmin && (
          <div className="mb-2 p-2.5 bg-[#463629]/95 backdrop-blur-md rounded-2xl border-2 border-[#e6c12f] shadow-2xl text-white text-xs space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-1.5">
              <span className="font-bold text-[#e6c12f] flex items-center gap-1.5 text-[11px]">
                <Move className="w-3.5 h-3.5 text-[#e6c12f] animate-pulse" />
                <span>โหมดจัดตำแหน่ง (คลิกค้างแล้วลาก)</span>
              </span>
              <button 
                onClick={() => setIsDragModeActive(false)}
                className="text-white/70 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="text-[10px] text-[#ece4d4] font-mono">
              Bottom: {Math.round(dragPosition.bottom)}px | Right: {Math.round(dragPosition.right)}px
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveGlobalPosition}
                className="flex-1 px-2.5 py-1.5 bg-[#e6c12f] text-[#463629] font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 hover:bg-[#e8c742] transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3 h-3" />
                <span>บันทึกตำแหน่งกลาง</span>
              </button>
              <button
                onClick={handleResetPosition}
                className="px-2 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] transition-colors cursor-pointer"
                title="รีเซ็ตสู่มุมขวาล่างเริ่มต้น"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Speech Bubble Greeting Teaser (Shows automatically when chat is closed) */}
        {!isOpen && isMascotVisible && showSpeechBubble && config.speechBubbleEnabled && !isDragModeActive && (
          <div className="relative mb-3 max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-[#e6c12f] shadow-xl text-xs text-[#463629] animate-bounce-subtle cursor-pointer group">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
              }}
              className="absolute -top-2 -left-2 w-5 h-5 bg-[#463629] text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
              title="ปิดข้อความทักทาย"
            >
              <X className="w-3 h-3" />
            </button>
            <div onClick={handleOpenChat}>
              <div className="font-bold font-editorial text-[#9c7d5c] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#e6c12f]" />
                <span>{config.name || 'MIUMIU'}</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-[11px] text-[#6f5a45]">
                {config.greeting || 'สวัสดีครับ! ผมคือ MIUMIU พาสำรวจพิพิธภัณฑ์และกราฟความรู้ได้นะ คลิกคุยกับผมได้เลย!'}
              </p>
            </div>
            {/* Speech bubble arrow pointer */}
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-r-2 border-b-2 border-[#e6c12f] rotate-45 transform" />
          </div>
        )}

        {/* Mascot Avatar Button (Enlarged and highly interactive) */}
        {!isOpen && isMascotVisible && (
          <div
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            className={`relative group select-none transition-transform duration-300 ${
              isDragModeActive ? 'cursor-move ring-4 ring-[#e6c12f] rounded-3xl p-1 animate-pulse' : 'cursor-pointer hover:scale-108 active:scale-95'
            }`}
            title={isAdmin ? 'คลิกซ้ายเพื่อเปิดแชท / ดับเบิลคลิกขวาเพื่อเปิดโหมดลากย้ายตำแหน่ง' : 'คลิกเพื่อพูดคุยกับน้องมิวมิว'}
          >
            {/* Glowing Golden Cyber Halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#e6c12f] via-[#f59e0b] to-[#e8c742] opacity-40 blur-2xl group-hover:opacity-85 transition-opacity animate-pulse" />

            {/* Chibi Avatar Image Container with Enlarged View */}
            <div 
              onClick={() => {
                if (!isDragModeActive) {
                  handleOpenChat();
                }
              }}
              style={{
                width: `${getMascotSizePixels(config.size)}px`,
                height: `${getMascotSizePixels(config.size)}px`
              }}
              className="relative drop-shadow-2xl"
            >
              <img
                src={getPoseForState(currentState)}
                alt="น้องมิวมิว (MIUMIU Mascot)"
                className="w-full h-full object-contain filter drop-shadow hover:brightness-105 transition-transform animate-float"
              />
              
              {/* Online pulse indicator */}
              <span 
                className="absolute bottom-2 right-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md ring-2 ring-emerald-300 animate-pulse" 
                title="ออนไลน์ พร้อมพาสำรวจ 1,574 พิพิธภัณฑ์" 
              />
            </div>

            {/* Character Nameplate Badge */}
            <div 
              onClick={() => {
                if (!isDragModeActive) {
                  handleOpenChat();
                }
              }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#463629] text-[#e6c12f] text-[11px] font-heading font-bold shadow-lg border-2 border-[#e6c12f]/60 whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#e6c12f]" />
              <span>{config.name || 'MIUMIU'}</span>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-w-[450px] h-[610px] max-h-[88vh] bg-[#fffdf7] rounded-3xl border-2 border-[#d7c8b2] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header Bar */}
          <div className="p-3.5 bg-gradient-to-r from-[#463629] via-[#6f5a45] to-[#463629] text-white flex items-center justify-between shadow-md">
            
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-[#fffdf7]/20 p-0.5 border-2 border-[#e6c12f]/60 shrink-0">
                <img
                  src={getPoseForState(currentState)}
                  alt="Avatar"
                  className="w-full h-full object-contain drop-shadow"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#463629]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-editorial text-sm font-bold text-[#e6c12f]">
                    {config.name || 'MIUMIU'}
                  </h3>
                  <span className="text-[10px] bg-[#e6c12f] text-[#463629] font-bold px-1.5 py-0.2 rounded font-sans">
                    Heritage AI
                  </span>
                </div>
                <p className="text-[10px] text-[#ece4d4] font-heading">
                  {config.subtitle || 'ผู้ช่วยสืบค้น 1,574 พิพิธภัณฑ์ & กราฟความรู้'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundMuted(prev => !prev)}
                className="p-1.5 text-[#ece4d4] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title={soundMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
              >
                {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 text-[#ece4d4] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="ล้างประวัติการสนทนา"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentState('idle');
                }}
                className="p-1.5 text-[#ece4d4] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="ย่อหน้าต่าง"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Chat Messages Body Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-radial-at-t from-[#fffdf7] via-[#fffdf7] to-[#ece4d4]/30">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <img
                      src={msg.pose || getPoseForState('idle')}
                      alt="Nong Miu Miu"
                      className="w-9 h-9 rounded-full object-contain shrink-0 mt-0.5 bg-[#ece4d4] p-0.5 border border-[#d7c8b2] shadow-2xs"
                    />
                  )}

                  <div className="space-y-2 max-w-[84%]">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isBot
                          ? 'bg-white text-[#463629] border border-[#d7c8b2] rounded-tl-xs'
                          : 'bg-[#9c7d5c] text-white rounded-tr-xs font-medium'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Interactive Clickable Cards (Museum links, Graph links, Google Search link) */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {msg.cards.map((card, cIdx) => {
                          if (card.type === 'google' && card.externalUrl) {
                            return (
                              <a
                                key={cIdx}
                                href={card.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-left p-2.5 bg-amber-50/80 hover:bg-amber-100/90 border-2 border-amber-300 rounded-xl transition-all shadow-xs group cursor-pointer flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-900">
                                    <Globe className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="text-xs font-bold font-heading text-amber-950 group-hover:text-amber-800 truncate">
                                      {card.title}
                                    </div>
                                    <div className="text-[10px] text-amber-800/80 truncate">
                                      {card.subtitle}
                                    </div>
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform shrink-0" />
                              </a>
                            );
                          }

                          return (
                            <button
                              key={cIdx}
                              onClick={() => {
                                if (card.targetTab) {
                                  onNavigate(card.targetTab, card.targetMeta);
                                  setIsOpen(false);
                                }
                              }}
                              className="w-full text-left p-2.5 bg-white hover:bg-[#fffdf7] border border-[#d7c8b2] hover:border-[#9c7d5c] rounded-xl transition-all shadow-2xs group cursor-pointer flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="text-xs font-bold font-heading text-[#463629] group-hover:text-[#9c7d5c] truncate">
                                  {card.title}
                                </div>
                                {card.subtitle && (
                                  <div className="text-[10px] text-[#6f5a45] truncate">
                                    {card.subtitle}
                                  </div>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-[#9c7d5c] group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className={`text-[9px] text-[#6f5a45]/60 px-1 ${isBot ? 'text-left' : 'text-right'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <img
                  src={getPoseForState('typing')}
                  alt=""
                  className="w-8 h-8 rounded-full object-contain p-0.5 bg-[#ece4d4] border border-[#d7c8b2]"
                />
                <div className="px-3.5 py-2 bg-white rounded-2xl rounded-tl-xs border border-[#d7c8b2] text-[11px] text-[#6f5a45] flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9c7d5c] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9c7d5c] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9c7d5c] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[10px]">น้องมิวมิวกำลังค้นหาข้อมูล...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          {config.suggestedPrompts && config.suggestedPrompts.length > 0 && (
            <div className="px-3 py-2 bg-[#ece4d4]/40 border-t border-[#d7c8b2] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {config.suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1 bg-white hover:bg-[#fffdf7] text-[#463629] text-[10px] font-heading font-medium rounded-full border border-[#d7c8b2] hover:border-[#9c7d5c] transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#d7c8b2] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์คำถามถึงน้องมิวมิว เช่น โบราณคดี, ผ้าทอ..."
              className="flex-1 px-3.5 py-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs text-[#463629] placeholder-[#6f5a45]/60 focus:outline-none focus:ring-2 focus:ring-[#9c7d5c]/40 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#9c7d5c] hover:bg-[#856748] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              title="ส่งคำถาม"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
