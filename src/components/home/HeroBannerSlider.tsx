import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Network, 
  Landmark, 
  ChevronDown, 
  Layers, 
  Pause, 
  Play, 
  Video, 
  Image as ImageIcon,
  Volume2,
  VolumeX,
  HelpCircle
} from 'lucide-react';
import type { BannerSlide } from '../../types/museum';
import { LivingMemoryUniverseCanvas } from './LivingMemoryUniverseCanvas';

interface HeroBannerSliderProps {
  slides: BannerSlide[];
  onNavigate: (tab: string, meta?: any) => void;
  onScrollDown?: () => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({ 
  slides, 
  onNavigate, 
  onScrollDown 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [videoDisabled, setVideoDisabled] = useState<Record<string, boolean>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides.filter(s => s.active);

  // Auto-play interval (7.5 seconds)
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, 7500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length, isPaused]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const isEmblemSlide = currentSlide.id === 'banner_emblem' || currentSlide.imageUrl?.includes('echoes_of_siam_banner');
  const isVideoBanner = (currentSlide.mediaType === 'video' || currentSlide.isGenerativeLivingMemory || !!currentSlide.videoUrl) && !videoDisabled[currentSlide.id];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  };

  const handleScrollClick = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      const target = document.getElementById('archive-announcement-section') || document.getElementById('main-explore-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: 600, behavior: 'smooth' });
      }
    }
  };

  const toggleVideoMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoDisabled(prev => ({
      ...prev,
      [currentSlide.id]: !prev[currentSlide.id]
    }));
  };

  return (
    <div 
      className="relative w-full h-[78vh] sm:h-[86vh] lg:h-[92vh] min-h-[600px] max-h-[890px] overflow-hidden bg-[#0c0d12] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="หน้าปกเว็บไซต์ แบนเนอร์สไลด์และวิดีโอ Echoes of Siam"
    >
      {/* Background Slides with smooth fade */}
      {activeSlides.map((slide, idx) => {
        const isCurrent = idx === currentIndex;
        const hasError = imageErrors[slide.id];
        const isThisVideo = (slide.mediaType === 'video' || slide.isGenerativeLivingMemory || !!slide.videoUrl) && !videoDisabled[slide.id];

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            {isThisVideo ? (
              /* Video Banner: The Jason Brain Living Memory Universe Canvas or HTML5 video */
              slide.videoUrl && !slide.isGenerativeLivingMemory ? (
                <video
                  src={slide.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <LivingMemoryUniverseCanvas 
                  isPaused={!isVideoPlaying} 
                  onTogglePause={() => setIsVideoPlaying(prev => !prev)}
                />
              )
            ) : !hasError && slide.imageUrl ? (
              /* Still Cover Image with gentle slow pan */
              <img
                src={slide.imageUrl}
                alt={slide.title}
                onError={() => setImageErrors(prev => ({ ...prev, [slide.id]: true }))}
                className={`w-full h-full object-cover object-center filter brightness-[0.88] transition-transform duration-10000 ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#121421] via-[#241a14] to-[#463629] flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-[#e6c12f]/10 blur-3xl" />
              </div>
            )}

            {/* Scrim Overlays */}
            {isThisVideo ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            ) : isEmblemSlide ? (
              <>
                <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/25 to-black/65 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 pointer-events-none" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent sm:w-2/3 pointer-events-none" />
              </>
            )}
          </div>
        );
      })}

      {/* Decorative Golden Ambient Accent at Top and Bottom */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#fffdf7] via-[#fffdf7]/50 to-transparent pointer-events-none z-10" />

      {/* Slide Content Layer */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-16 sm:pb-22 pointer-events-none">
        
        {/* If this is the Emblem Slide (the user's magnificent artwork) */}
        {isEmblemSlide && !isVideoBanner ? (
          <div className="w-full flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto animate-fade-in pointer-events-auto">
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#e6c12f]/40 shadow-lg text-white">
              <Sparkles className="w-4 h-4 text-[#e6c12f]" />
              <span className="text-xs font-heading font-medium tracking-wide">
                {currentSlide.tag || 'Echoes of Siam — สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์'}
              </span>
            </div>

            {/* Subtitle description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#ece4d4] font-heading font-normal leading-relaxed drop-shadow-md max-w-2xl">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              {currentSlide.ctaText && (
                <button
                  onClick={() => onNavigate(currentSlide.ctaLink || 'museums')}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#e6c12f] to-[#e8c742] hover:brightness-110 text-[#463629] text-xs sm:text-sm font-heading font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Landmark className="w-4 h-4 text-[#463629]" />
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentSlide.secondaryCtaText && (
                <button
                  onClick={() => onNavigate(currentSlide.secondaryCtaLink || 'graph')}
                  className="px-5 py-3.5 bg-black/50 hover:bg-black/70 text-white text-xs sm:text-sm font-heading font-medium rounded-xl transition-all backdrop-blur-md border border-white/30 hover:border-[#e6c12f]/60 cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Network className="w-4 h-4 text-[#e6c12f]" />
                  <span>{currentSlide.secondaryCtaText}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Editorial Content Layout for Video Banner, Welcome, Graph, Showcase */
          <div className="max-w-3xl space-y-4 text-left animate-fade-in pointer-events-auto">
            {/* Tag & Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e6c12f] text-[#463629] text-xs font-heading font-bold rounded-lg shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#463629]" />
                <span>{currentSlide.tag || 'Echoes of Siam'}</span>
              </span>

              {currentSlide.badgeText && (
                <span className="px-3 py-1.5 bg-black/50 text-[#fffdf7] text-xs font-heading font-medium rounded-lg backdrop-blur-md border border-white/20">
                  {currentSlide.badgeText}
                </span>
              )}

              {/* Video toggle badge if slide has video capability */}
              {(currentSlide.mediaType === 'video' || currentSlide.isGenerativeLivingMemory || currentSlide.videoUrl) && (
                <button
                  onClick={toggleVideoMode}
                  className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-xs text-white border border-[#e6c12f]/50 flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md"
                  title="สลับโหมดวิดีโอ/ภาพนิ่ง"
                >
                  {isVideoBanner ? (
                    <>
                      <ImageIcon className="w-3 h-3 text-[#e6c12f]" />
                      <span>สลับเป็นภาพนิ่ง</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3 h-3 text-[#e6c12f]" />
                      <span>เล่นวิดีโอเคลื่อนไหว</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Headline with Noto Serif Thai */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold text-white leading-[1.18] tracking-tight drop-shadow-lg text-balance">
              {currentSlide.title}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#ece4d4] leading-relaxed max-w-2xl font-sans drop-shadow-md">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons: Omitted on video banner as requested, or shown only if slide has CTA */}
            {!isVideoBanner && (currentSlide.ctaText || currentSlide.secondaryCtaText) ? (
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                {currentSlide.ctaText && (
                  <button
                    onClick={() => onNavigate(currentSlide.ctaLink || 'graph')}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#e6c12f] to-[#e8c742] hover:brightness-110 text-[#463629] text-xs sm:text-sm font-heading font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {currentSlide.secondaryCtaText && (
                  <button
                    onClick={() => onNavigate(currentSlide.secondaryCtaLink || 'help')}
                    className="px-5 py-3.5 bg-black/50 hover:bg-black/70 text-white text-xs sm:text-sm font-heading font-medium rounded-xl transition-all backdrop-blur-md border border-white/30 hover:border-[#e6c12f]/60 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#e6c12f]" />
                    <span>{currentSlide.secondaryCtaText}</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

      </div>

      {/* Floating Arrow Controls (Left & Right) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="สไลด์ก่อนหน้า"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#e6c12f]/60 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            aria-label="สไลด์ถัดไป"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#e6c12f]/60 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Top Right Counter & Pause/Play Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute top-6 right-6 sm:right-10 z-30 flex items-center gap-2 bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/15 text-white text-xs font-heading font-medium">
          <button
            onClick={() => setIsPaused(p => !p)}
            title={isPaused ? 'เล่นสไลด์อัตโนมัติ' : 'หยุดสไลด์ชั่วคราว'}
            className="p-1 hover:text-[#e6c12f] transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <span className="text-[#e6c12f] font-bold">0{currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/70">0{activeSlides.length}</span>
        </div>
      )}

      {/* Bottom Right Indicator Pills */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-30 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/15">
          {activeSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`ไปที่สไลด์ ${idx + 1}: ${slide.title}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex 
                  ? 'w-8 h-2.5 bg-gradient-to-r from-[#e6c12f] to-[#e8c742] shadow-xs' 
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Down Hint Button */}
      <button
        onClick={handleScrollClick}
        aria-label="เลื่อนลงเพื่อดูประกาศและคลังข้อมูล"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-[#463629] hover:text-[#9c7d5c] transition-colors cursor-pointer group"
      >
        <span className="text-[11px] font-heading font-semibold tracking-wider uppercase opacity-85 group-hover:opacity-100">
          เลื่อนลงเพื่อสำรวจ
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#9c7d5c]" />
      </button>

    </div>
  );
};
