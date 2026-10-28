import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  Menu, 
  X, 
  Landmark, 
  ChevronDown, 
  BarChart3, 
  Home as HomeIcon,
  Sparkles,
  HelpCircle,
  Tag,
  Network,
  BookOpen,
  Crown,
  Users,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  ArrowRight,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { museumStore } from '../../services/museumStore';
import type { HeaderConfig, NavMenuItem, NavDropdownItem } from '../../types/museum';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
  onOpenSearch: () => void;
  onOpenHelp?: () => void;
}

// Icon mapper for dynamic navbar icons
const getNavIcon = (iconName?: string, className = "w-4 h-4") => {
  switch (iconName) {
    case 'Home':
      return <HomeIcon className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ImageIcon':
      return <ImageIcon className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Phone':
      return <Phone className={className} />;
    default:
      return null;
  }
};

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch, onOpenHelp }) => {
  const { isAdmin } = useAuth();
  
  // 1. Reactive Header Configuration from store
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => museumStore.getHeaderConfig());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLElement>(null);

  // Sync header configuration in real-time when admin makes changes
  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      setHeaderConfig(museumStore.getHeaderConfig());
    });
    return () => unsub();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sorted, active menu items
  const menuItems = headerConfig.menuItems
    .filter(m => m.active)
    .sort((a, b) => a.order - b.order);

  // Handle Menu Item Click
  const handleMenuItemClick = (item: NavMenuItem) => {
    if (item.targetAction === 'search') {
      onOpenSearch();
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
      return;
    }

    if (item.targetAction === 'help') {
      if (onOpenHelp) onOpenHelp();
      else onNavigate('help');
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
      return;
    }

    if (item.targetAction === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
      return;
    }

    if (item.targetAction === 'navigate' && item.targetTab) {
      onNavigate(item.targetTab, item.targetMeta);
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
    }
  };

  // Handle Sub-Item Click inside Dropdown
  const handleDropdownSubItemClick = (sub: NavDropdownItem) => {
    if (sub.externalUrl) {
      window.open(sub.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (sub.targetTab) {
      onNavigate(sub.targetTab, sub.targetMeta);
    }
    setOpenDropdownId(null);
    setMobileMenuOpen(false);
  };

  // Check if a menu item is active
  const isItemActive = (item: NavMenuItem) => {
    if (item.targetTab === currentTab) return true;
    if (item.hasDropdown && item.dropdownItems) {
      return item.dropdownItems.some(sub => sub.active && sub.targetTab === currentTab);
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9]/95 backdrop-blur-md border-b border-[#cbb499]/70 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 sm:gap-6">
          
          {/* Zone 1: Brand Logo & Title (Configurable via Admin) */}
          <button 
            onClick={() => {
              onNavigate('home');
              setOpenDropdownId(null);
            }}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-none transition-transform active:scale-98 cursor-pointer"
            aria-label={`${headerConfig.brandTitle || 'Echoes of Siam'} หน้าแรก`}
          >
            <div className="relative">
              <img 
                src={headerConfig.brandEmblemUrl || "/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png"} 
                alt={headerConfig.brandTitle || "Echoes of Siam"} 
                className="w-10 h-10 object-contain rounded-full shadow-xs group-hover:scale-105 transition-transform shrink-0 ring-1 ring-[#e6c12f]/50" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#e6c12f] rounded-full border-2 border-[#fffdf9]" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#382415] block font-editorial group-hover:text-[#5c3d26] transition-colors leading-tight">
                {headerConfig.brandTitle || 'Echoes of Siam'}
              </span>
              <span className="text-[11px] text-[#735640] block font-heading truncate max-w-[210px] sm:max-w-xs">
                {headerConfig.brandSubtitle || 'สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์'}
              </span>
            </div>
          </button>

          {/* Zone 2: Dynamic Nav Menu Items with Configurable Dropdowns (Desktop) */}
          <nav 
            ref={navContainerRef}
            className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-[#634b39]"
          >
            {menuItems.map(item => {
              const active = isItemActive(item);
              const hasDropdown = item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0;
              const isDropdownOpen = openDropdownId === item.id;
              const activeSubItems = (item.dropdownItems || [])
                .filter(sub => sub.active)
                .sort((a, b) => a.order - b.order);

              if (hasDropdown) {
                return (
                  <div 
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdownId(item.id)}
                    onMouseLeave={() => setOpenDropdownId(null)}
                  >
                    <button
                      onClick={() => {
                        if (isDropdownOpen) {
                          setOpenDropdownId(null);
                        } else {
                          setOpenDropdownId(item.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 py-1.5 transition-colors relative hover:text-[#382415] cursor-pointer group ${
                        active
                          ? 'text-[#382415] font-semibold border-b-2 border-[#5c3d26]'
                          : 'text-[#634b39]'
                      }`}
                    >
                      <span>{item.label}</span>
                      
                      {/* Badge if configured */}
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#e6c12f] text-[#463629] font-mono font-bold">
                          {item.badge}
                        </span>
                      )}

                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#7a5230] ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Glassmorphic Dropdown Panel */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-[#fffdf9]/98 rounded-2xl border border-[#d6c3ad] shadow-xl p-2 space-y-1 backdrop-blur-md">
                          
                          {/* Main item header direct jump if targetTab set */}
                          {item.targetTab && (
                            <button
                              onClick={() => handleMenuItemClick(item)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left bg-[#ece4d4]/40 hover:bg-[#ece4d4] text-[#463629] text-xs font-heading font-semibold transition-colors cursor-pointer border border-[#d7c8b2]/40 mb-1"
                            >
                              <span>เข้าสู่ {item.label} ทั้งหมด</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#9c7d5c]" />
                            </button>
                          )}

                          {/* Sub-items */}
                          {activeSubItems.map(sub => {
                            const isSubActive = sub.targetTab === currentTab;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleDropdownSubItemClick(sub)}
                                className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSubActive
                                    ? 'bg-[#ece4d4] text-[#463629] font-semibold'
                                    : 'text-[#6f5a45] hover:bg-[#ece4d4]/50 hover:text-[#463629]'
                                }`}
                              >
                                {sub.iconName && (
                                  <div className="w-7 h-7 rounded-lg bg-[#9c7d5c]/10 text-[#9c7d5c] flex items-center justify-center shrink-0 mt-0.5">
                                    {getNavIcon(sub.iconName, "w-4 h-4")}
                                  </div>
                                )}
                                <div className="space-y-0.5 min-w-0">
                                  <div className="text-xs font-semibold text-[#382415] flex items-center gap-1.5">
                                    <span className="truncate">{sub.label}</span>
                                    {sub.badge && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#e6c12f] text-[#463629] font-mono font-bold">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.subLabel && (
                                    <div className="text-[10px] text-[#6f5a45]/80 line-clamp-1 leading-snug">
                                      {sub.subLabel}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Standard direct link without dropdown
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className={`whitespace-nowrap shrink-0 py-1.5 transition-colors relative hover:text-[#382415] cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'text-[#382415] font-semibold border-b-2 border-[#5c3d26]'
                      : 'text-[#634b39]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#e6c12f] text-[#463629] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Help Center, Admin Shortcut, and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#5c3d26] bg-[#f4ebd9]/80 hover:bg-[#ebdcc7] rounded-xl transition-colors border border-[#d6c3ad] cursor-pointer shadow-2xs"
              title="ค้นหาพิพิธภัณฑ์หรือหัวเรื่อง (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#7a5230]" />
              <span className="hidden sm:inline font-heading font-medium">
                {headerConfig.searchButtonLabel || 'ค้นหา'}
              </span>
              <kbd className="hidden sm:inline-block text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#d6c3ad] text-[#7a5230] font-sans font-mono">
                {headerConfig.searchShortcut || '⌘K'}
              </kbd>
            </button>

            {/* Help Button */}
            <button
              onClick={() => {
                if (onOpenHelp) onOpenHelp();
                else onNavigate('help');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-medium text-[#4a301d] bg-[#f4ebd9]/80 hover:bg-[#ebdcc7] hover:text-[#382415] rounded-xl transition-all border border-[#d6c3ad] hover:border-[#8c6239] cursor-pointer shadow-2xs group"
              title="คู่มือและศูนย์ช่วยเหลือผู้ใช้งาน"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#7a5230] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-heading font-medium">
                {headerConfig.helpButtonLabel || 'ช่วยเหลือ'}
              </span>
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#382415] rounded-xl hover:bg-[#ede2d2]/50 cursor-pointer"
              aria-label="เปิดเมนูนำทาง"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d6c3ad] bg-[#fffdf9]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          
          <div className="space-y-1">
            {menuItems
              .filter(m => m.showOnMobile)
              .map(item => {
                const active = isItemActive(item);
                const hasDropdown = item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0;
                const activeSubItems = (item.dropdownItems || []).filter(sub => sub.active);

                if (hasDropdown) {
                  return (
                    <div key={item.id} className="space-y-1 pb-1">
                      <button
                        onClick={() => handleMenuItemClick(item)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-xl font-heading font-semibold ${
                          active
                            ? 'bg-[#ece4d4] text-[#463629]'
                            : 'text-[#5c3d26] hover:bg-[#ece4d4]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getNavIcon(item.iconName, "w-4 h-4 text-[#9c7d5c]")}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#e6c12f] text-[#463629] font-mono font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>

                      {/* Nested sub items */}
                      <div className="pl-4 space-y-1 border-l-2 border-[#d7c8b2]/60 ml-3">
                        {activeSubItems.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => handleDropdownSubItemClick(sub)}
                            className={`flex items-center justify-between w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                              sub.targetTab === currentTab
                                ? 'bg-[#ece4d4] text-[#463629] font-semibold'
                                : 'text-[#6f5a45] hover:bg-[#ece4d4]/40'
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#e6c12f] text-[#463629] font-mono font-bold">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-xl font-heading font-medium ${
                      active
                        ? 'bg-[#ece4d4] text-[#463629] font-bold'
                        : 'text-[#6f5a45] hover:bg-[#ece4d4]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getNavIcon(item.iconName, "w-4 h-4 text-[#9c7d5c]")}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#e6c12f] text-[#463629] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Quick Help Link in Mobile Drawer */}
          <div className="pt-2 border-t border-[#d7c8b2]/70">
            <button
              onClick={() => {
                if (onOpenHelp) onOpenHelp();
                else onNavigate('help');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs font-heading font-semibold text-[#463629] bg-[#ece4d4]/70 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#9c7d5c]" />
              <span>{headerConfig.helpButtonLabel || 'ช่วยเหลือ'} และคู่มือการใช้งาน</span>
            </button>
          </div>

        </div>
      )}

    </header>
  );
};
