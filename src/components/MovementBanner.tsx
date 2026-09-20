import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  Gem,
  Truck,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Copy,
  Crosshair,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { IMAGES, PRODUCTS } from '../data/products';
import { Product, ProductTag } from '../types';
import {
  OFFICIAL_DESKTOP_BANNER_TAGS,
  OFFICIAL_MOBILE_BANNER_TAGS,
} from '../data/bannerTags';

interface MovementBannerProps {
  onExploreClick: () => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateProducts?: () => void;
}

export type { ProductTag };

export const DEFAULT_PRODUCT_TAGS: ProductTag[] = OFFICIAL_MOBILE_BANNER_TAGS;
export const DEFAULT_DESKTOP_PRODUCT_TAGS: ProductTag[] = OFFICIAL_DESKTOP_BANNER_TAGS;

export const getTagCoordinates = (tag: ProductTag): { x: number; y: number } => {
  const y = parseFloat(tag.top) || 50;
  let x = 50;
  if (tag.left !== undefined) {
    x = parseFloat(tag.left);
  } else if (tag.right !== undefined) {
    x = 100 - parseFloat(tag.right);
  }
  return {
    x: Math.max(2, Math.min(98, Math.round(x))),
    y: Math.max(2, Math.min(98, Math.round(y))),
  };
};

export const MovementBanner: React.FC<MovementBannerProps> = ({
  onExploreClick,
  onSelectProduct,
  onNavigateProducts,
}) => {
  const [tags, setTags] = useState<ProductTag[]>(() => {
    try {
      const saved = localStorage.getItem('oryven_mobile_tags_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_PRODUCT_TAGS;
  });

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>('oryven-visor');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const mobileBannerRef = useRef<HTMLDivElement>(null);

  // Desktop tags state & calibration
  const [desktopTags, setDesktopTags] = useState<ProductTag[]>(() => {
    try {
      const saved = localStorage.getItem('oryven_desktop_tags_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_DESKTOP_PRODUCT_TAGS;
  });

  const [isDesktopCalibrating, setIsDesktopCalibrating] = useState(false);
  const [selectedDesktopTagId, setSelectedDesktopTagId] = useState<string>('oryven-visor');
  const [draggingDesktopTagId, setDraggingDesktopTagId] = useState<string | null>(null);
  const [desktopCopiedNotification, setDesktopCopiedNotification] = useState(false);
  const desktopBannerRef = useRef<HTMLDivElement>(null);

  const activeTag = tags.find((t) => t.id === selectedTagId) || tags[0];
  const activeCoords = activeTag ? getTagCoordinates(activeTag) : { x: 50, y: 50 };

  const activeDesktopTag = desktopTags.find((t) => t.id === selectedDesktopTagId) || desktopTags[0];

  const handlePointerDownDesktopTag = (e: React.PointerEvent, tagId: string) => {
    if (!isDesktopCalibrating) return;
    e.stopPropagation();
    setSelectedDesktopTagId(tagId);
    setDraggingDesktopTagId(tagId);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleDesktopPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktopCalibrating || !draggingDesktopTagId || !desktopBannerRef.current) return;
    const rect = desktopBannerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const topPercent = Math.max(3, Math.min(97, Math.round((clickY / rect.height) * 100)));
    const leftPercent = Math.max(3, Math.min(97, Math.round((clickX / rect.width) * 100)));

    updateSelectedDesktopTag({
      x: leftPercent,
      y: topPercent,
    });
  };

  const handleDesktopPointerUp = () => {
    if (draggingDesktopTagId) {
      setDraggingDesktopTagId(null);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: ProductTag) => {
    e.stopPropagation();
    if (isCalibrating) {
      setSelectedTagId(tag.id);
      return;
    }
    const product = PRODUCTS.find((p) => p.id === tag.id || p.slug === tag.slug);
    if (product && onSelectProduct) {
      onSelectProduct(product);
    } else {
      onExploreClick();
    }
  };

  const handleDesktopTagClick = (e: React.MouseEvent, tag: ProductTag) => {
    e.stopPropagation();
    if (isDesktopCalibrating) {
      setSelectedDesktopTagId(tag.id);
      return;
    }
    const product = PRODUCTS.find((p) => p.id === tag.id || p.slug === tag.slug);
    if (product && onSelectProduct) {
      onSelectProduct(product);
    } else {
      onExploreClick();
    }
  };

  const updateSelectedTag = (updates: { x?: number; y?: number; align?: 'left' | 'right' }) => {
    setTags((prevTags) => {
      const next = prevTags.map((t) => {
        if (t.id !== selectedTagId) return t;
        const current = getTagCoordinates(t);
        const nextX = updates.x !== undefined ? Math.max(2, Math.min(98, updates.x)) : current.x;
        const nextY = updates.y !== undefined ? Math.max(2, Math.min(98, updates.y)) : current.y;
        const nextAlign = updates.align !== undefined ? updates.align : t.align;
        return {
          ...t,
          top: `${Math.round(nextY)}%`,
          left: `${Math.round(nextX)}%`,
          right: undefined,
          align: nextAlign,
        };
      });
      try {
        localStorage.setItem('oryven_mobile_tags_v2', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updateSelectedDesktopTag = (updates: { x?: number; y?: number; align?: 'left' | 'right' }) => {
    setDesktopTags((prevTags) => {
      const next = prevTags.map((t) => {
        if (t.id !== selectedDesktopTagId) return t;
        const current = getTagCoordinates(t);
        const nextX = updates.x !== undefined ? Math.max(2, Math.min(98, updates.x)) : current.x;
        const nextY = updates.y !== undefined ? Math.max(2, Math.min(98, updates.y)) : current.y;
        const nextAlign = updates.align !== undefined ? updates.align : t.align;
        return {
          ...t,
          top: `${Math.round(nextY)}%`,
          left: `${Math.round(nextX)}%`,
          right: undefined,
          align: nextAlign,
        };
      });
      try {
        localStorage.setItem('oryven_desktop_tags_v3', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const nudgeSelectedTag = (deltaX: number, deltaY: number) => {
    if (!activeTag) return;
    const current = getTagCoordinates(activeTag);
    updateSelectedTag({
      x: current.x + deltaX,
      y: current.y + deltaY,
    });
  };

  const nudgeSelectedDesktopTag = (deltaX: number, deltaY: number) => {
    if (!activeDesktopTag) return;
    const current = getTagCoordinates(activeDesktopTag);
    updateSelectedDesktopTag({
      x: current.x + deltaX,
      y: current.y + deltaY,
    });
  };

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCalibrating) {
      if (!mobileBannerRef.current) return;
      const rect = mobileBannerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const topPercent = Math.max(4, Math.min(96, Math.round((clickY / rect.height) * 100)));
      const leftPercent = Math.max(4, Math.min(96, Math.round((clickX / rect.width) * 100)));

      updateSelectedTag({
        x: leftPercent,
        y: topPercent,
      });
    } else {
      if (onNavigateProducts) {
        onNavigateProducts();
      } else {
        onExploreClick();
      }
    }
  };

  const handleDesktopBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDesktopCalibrating) {
      if (!desktopBannerRef.current) return;
      const rect = desktopBannerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const topPercent = Math.max(4, Math.min(96, Math.round((clickY / rect.height) * 100)));
      const leftPercent = Math.max(4, Math.min(96, Math.round((clickX / rect.width) * 100)));

      updateSelectedDesktopTag({
        x: leftPercent,
        y: topPercent,
      });
    } else {
      if (onNavigateProducts) {
        onNavigateProducts();
      } else {
        onExploreClick();
      }
    }
  };

  const handleResetTags = () => {
    setTags(DEFAULT_PRODUCT_TAGS);
    try {
      localStorage.removeItem('oryven_mobile_tags_v2');
      localStorage.removeItem('oryven_mobile_tags');
    } catch {
      // ignore
    }
  };

  const handleResetDesktopTags = () => {
    setDesktopTags(DEFAULT_DESKTOP_PRODUCT_TAGS);
    try {
      localStorage.removeItem('oryven_desktop_tags_v3');
      localStorage.removeItem('oryven_desktop_tags_v2');
    } catch {
      // ignore
    }
  };

  const handleCopyConfig = () => {
    const json = JSON.stringify(tags, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  const handleCopyDesktopConfig = () => {
    const json = JSON.stringify(desktopTags, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setDesktopCopiedNotification(true);
      setTimeout(() => setDesktopCopiedNotification(false), 2500);
    });
  };

  return (
    <section className="w-full bg-[#FAF6F1] border-b border-[#F0EAE1] overflow-hidden">
      {/* ============================================================ */}
      {/* MOBILE MOVEMENT BANNER: Square 1:1 format                    */}
      {/* Displayed ONLY on mobile devices (hidden on sm screens & up) */}
      {/* ============================================================ */}
      <div
        id="mobile-movement-banner"
        ref={mobileBannerRef}
        onClick={handleBannerClick}
        className={`block sm:hidden relative w-full aspect-square overflow-hidden select-none cursor-pointer group ${
          isCalibrating ? 'cursor-crosshair ring-2 ring-[#7A283B] ring-inset' : ''
        }`}
      >
        <img
          src={IMAGES.mobileMovementBanner}
          alt="Oryven Conçus Pour Bouger"
          className="absolute inset-0 w-full h-full object-cover object-center block pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Small trigger button in top right of photo */}
        <div className="absolute top-2.5 right-2.5 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCalibrating(!isCalibrating);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg transition-all active:scale-95 ${
              isCalibrating
                ? 'bg-[#7A283B] text-white border border-[#7A283B]'
                : 'bg-white/95 backdrop-blur-xs text-neutral-800 border border-[#EDE5DB] hover:bg-white'
            }`}
          >
            {isCalibrating ? (
              <>
                <Check size={12} />
                <span>Terminer</span>
              </>
            ) : (
              <>
                <SlidersHorizontal size={11} className="text-[#7A283B]" />
                <span>Ajuster pings</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Shoppable Product Tags on the image */}
        {tags.map((tag) => {
          const coords = getTagCoordinates(tag);
          const isSelectedInCalib = isCalibrating && selectedTagId === tag.id;
          const isTextLeft = tag.align === 'left';

          return (
            <button
              key={tag.id}
              type="button"
              onClick={(e) => handleTagClick(e, tag)}
              aria-label={`Voir le produit ${tag.label} (${tag.price} MAD)`}
              className={`absolute z-20 flex items-center gap-1.5 cursor-pointer touch-manipulation transition-all duration-200 group active:scale-95 ${
                isTextLeft
                  ? 'flex-row -translate-y-1/2 -translate-x-[calc(100%-10px)]'
                  : 'flex-row -translate-y-1/2 -translate-x-[10px]'
              } ${isSelectedInCalib ? 'scale-110 z-30' : ''}`}
              style={{
                top: `${coords.y}%`,
                left: `${coords.x}%`,
              }}
            >
              {isTextLeft ? (
                <>
                  {/* Pill on the LEFT */}
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-md border text-[10px] font-bold whitespace-nowrap transition-colors ${
                      isSelectedInCalib
                        ? 'bg-amber-400 text-neutral-950 border-white shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-white/95 backdrop-blur-sm border-[#EDE5DB] text-neutral-900 group-hover:bg-white group-hover:border-[#7A283B]/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span className="text-neutral-300 font-normal">•</span>
                    <span className={isSelectedInCalib ? 'text-neutral-950' : 'text-[#7A283B]'}>
                      {tag.price} MAD
                    </span>
                    {!isCalibrating && (
                      <ArrowRight
                        size={10}
                        className="text-neutral-400 group-hover:text-[#7A283B] group-hover:translate-x-0.5 transition-all"
                      />
                    )}
                  </span>

                  {/* Hotspot Pulsing Pin on the RIGHT */}
                  <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 duration-1000 ${
                        isSelectedInCalib ? 'bg-amber-400' : 'bg-[#7A283B]'
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-4 w-4 rounded-full bg-white border-[2.5px] shadow-sm items-center justify-center ${
                        isSelectedInCalib ? 'border-amber-500' : 'border-[#7A283B]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelectedInCalib ? 'bg-amber-500' : 'bg-[#7A283B]'
                        }`}
                      />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  {/* Hotspot Pulsing Pin on the LEFT */}
                  <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 duration-1000 ${
                        isSelectedInCalib ? 'bg-amber-400' : 'bg-[#7A283B]'
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-4 w-4 rounded-full bg-white border-[2.5px] shadow-sm items-center justify-center ${
                        isSelectedInCalib ? 'border-amber-500' : 'border-[#7A283B]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelectedInCalib ? 'bg-amber-500' : 'bg-[#7A283B]'
                        }`}
                      />
                    </span>
                  </span>

                  {/* Pill on the RIGHT */}
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-md border text-[10px] font-bold whitespace-nowrap transition-colors ${
                      isSelectedInCalib
                        ? 'bg-amber-400 text-neutral-950 border-white shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-white/95 backdrop-blur-sm border-[#EDE5DB] text-neutral-900 group-hover:bg-white group-hover:border-[#7A283B]/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span className="text-neutral-300 font-normal">•</span>
                    <span className={isSelectedInCalib ? 'text-neutral-950' : 'text-[#7A283B]'}>
                      {tag.price} MAD
                    </span>
                    {!isCalibrating && (
                      <ArrowRight
                        size={10}
                        className="text-neutral-400 group-hover:text-[#7A283B] group-hover:translate-x-0.5 transition-all"
                      />
                    )}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* CALIBRATION PANEL: Placed BELOW the image so NOTHING is hidden */}
      {/* ============================================================ */}
      {isCalibrating && (
        <div className="block sm:hidden bg-neutral-900 text-white p-3.5 border-t border-neutral-800 space-y-3 shadow-xl animate-fadeIn">
          {/* Top toolbar */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Crosshair size={14} className="text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Ajustement des Pings
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyConfig}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded transition-colors text-amber-300"
                title="Copier la configuration"
              >
                <Copy size={11} />
                <span>{copiedNotification ? 'Copié !' : 'Copier JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetTags}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded transition-colors text-neutral-400"
                title="Réinitialiser les coordonnées"
              >
                <RotateCcw size={11} />
                <span>Défaut</span>
              </button>
            </div>
          </div>

          {/* 1. Article selector */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              1. Choisissez l'article à positionner :
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTagId === tag.id;
                const coords = getTagCoordinates(tag);
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => setSelectedTagId(tag.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 ring-2 ring-white shadow-md'
                        : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700/80 border border-neutral-700/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span
                      className={`text-[9px] font-mono ${
                        isSelected ? 'text-neutral-900 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {coords.x}%, {coords.y}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Text side (left vs right) & 3. Micro-adjuster D-pad */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 pt-1">
            {/* Alignment selector */}
            <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700/60 space-y-1.5">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                2. Position du texte :
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSelectedTag({ align: 'left' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-[11px] font-bold transition-all ${
                    activeTag?.align === 'left'
                      ? 'bg-amber-400 text-neutral-950 shadow-md ring-1 ring-white'
                      : 'bg-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <ArrowLeft size={12} />
                  <span>À gauche</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedTag({ align: 'right' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-[11px] font-bold transition-all ${
                    activeTag?.align === 'right'
                      ? 'bg-amber-400 text-neutral-950 shadow-md ring-1 ring-white'
                      : 'bg-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span>À droite</span>
                  <ArrowRight size={12} />
                </button>
              </div>
              <p className="text-[9px] text-neutral-400 text-center">
                {activeTag?.align === 'left'
                  ? '← Texte affiché à gauche du ping'
                  : 'Texte affiché à droite du ping →'}
              </p>
            </div>

            {/* Micro-adjust D-pad */}
            <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>3. Micro-ajustement :</span>
                <span className="font-mono text-amber-300 text-[10px]">
                  X: {activeCoords.x}% • Y: {activeCoords.y}%
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 py-0.5">
                <button
                  type="button"
                  onClick={() => nudgeSelectedTag(-1, 0)}
                  className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform"
                  title="Gauche (-1%)"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeSelectedTag(0, -1)}
                    className="p-1.5 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform"
                    title="Haut (-1%)"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeSelectedTag(0, 1)}
                    className="p-1.5 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform"
                    title="Bas (+1%)"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => nudgeSelectedTag(1, 0)}
                  className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform"
                  title="Droite (+1%)"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom instructions & confirmation */}
          <div className="flex items-center justify-between pt-1.5 border-t border-neutral-800">
            <p className="text-[10px] text-neutral-400">
              💡 Touchez directement la photo pour placer{' '}
              <span className="text-amber-300 font-bold">{activeTag?.label}</span>.
            </p>
            <button
              type="button"
              onClick={() => setIsCalibrating(false)}
              className="px-4 py-1.5 bg-[#7A283B] hover:bg-[#681F30] text-white text-[11px] font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DESKTOP MOVEMENT BANNER: Full 1918x820 panoramic photo       */}
      {/* Displayed ONLY on desktop / tablet (hidden on mobile)        */}
      {/* Pure visual: No text overlay or CTA, interactive pings,      */}
      {/* and whole banner image clickable to view product page        */}
      {/* ============================================================ */}
      <div
        id="desktop-movement-banner"
        ref={desktopBannerRef}
        onClick={handleDesktopBannerClick}
        onPointerMove={handleDesktopPointerMove}
        onPointerUp={handleDesktopPointerUp}
        onPointerLeave={handleDesktopPointerUp}
        className={`hidden sm:block relative w-full aspect-[1918/820] overflow-hidden select-none group ${
          isDesktopCalibrating ? 'cursor-crosshair ring-2 ring-[#7A283B] ring-inset' : 'cursor-pointer'
        }`}
      >
        <img
          src={IMAGES.wideMovementBanner}
          alt="Oryven Conçus Pour Bouger"
          className="absolute inset-0 w-full h-full object-cover object-center block"
          referrerPolicy="no-referrer"
        />

        {/* Small trigger button in top right of photo */}
        <div className="absolute top-3.5 right-3.5 z-30 opacity-80 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDesktopCalibrating(!isDesktopCalibrating);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${
              isDesktopCalibrating
                ? 'bg-[#7A283B] text-white border border-[#7A283B]'
                : 'bg-white/95 backdrop-blur-xs text-neutral-800 border border-[#EDE5DB] hover:bg-white'
            }`}
          >
            {isDesktopCalibrating ? (
              <>
                <Check size={12} />
                <span>Terminer</span>
              </>
            ) : (
              <>
                <SlidersHorizontal size={11} className="text-[#7A283B]" />
                <span>Ajuster pings</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Shoppable Product Tags on the desktop image */}
        {desktopTags.map((tag) => {
          const coords = getTagCoordinates(tag);
          const isSelectedInCalib = isDesktopCalibrating && selectedDesktopTagId === tag.id;
          const isTextLeft = tag.align === 'left';
          const isBeingDragged = isDesktopCalibrating && draggingDesktopTagId === tag.id;

          return (
            <button
              key={tag.id}
              type="button"
              onClick={(e) => handleDesktopTagClick(e, tag)}
              onPointerDown={(e) => handlePointerDownDesktopTag(e, tag.id)}
              aria-label={`Voir le produit ${tag.label} (${tag.price} MAD)`}
              className={`absolute z-20 flex items-center gap-1.5 touch-manipulation transition-all duration-150 group/tag ${
                isDesktopCalibrating
                  ? 'cursor-grab active:cursor-grabbing'
                  : 'cursor-pointer active:scale-95'
              } ${
                isTextLeft
                  ? 'flex-row -translate-y-1/2 -translate-x-[calc(100%-10px)]'
                  : 'flex-row -translate-y-1/2 -translate-x-[10px]'
              } ${isSelectedInCalib ? 'scale-110 z-30' : 'hover:scale-105'} ${
                isBeingDragged ? 'scale-125 z-40 opacity-90' : ''
              }`}
              style={{
                top: `${coords.y}%`,
                left: `${coords.x}%`,
              }}
            >
              {isTextLeft ? (
                <>
                  {/* Pill on the LEFT */}
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-md border text-[10px] lg:text-[11px] font-bold whitespace-nowrap transition-colors ${
                      isSelectedInCalib
                        ? 'bg-amber-400 text-neutral-950 border-white shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-white/95 backdrop-blur-sm border-[#EDE5DB] text-neutral-900 group-hover/tag:bg-white group-hover/tag:border-[#7A283B]/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span className="text-neutral-300 font-normal">•</span>
                    <span className={isSelectedInCalib ? 'text-neutral-950' : 'text-[#7A283B]'}>
                      {tag.price} MAD
                    </span>
                    {!isDesktopCalibrating && (
                      <ArrowRight
                        size={10}
                        className="text-neutral-400 group-hover/tag:text-[#7A283B] group-hover/tag:translate-x-0.5 transition-all"
                      />
                    )}
                  </span>

                  {/* Hotspot Pulsing Pin on the RIGHT */}
                  <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 duration-1000 ${
                        isSelectedInCalib ? 'bg-amber-400' : 'bg-[#7A283B]'
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-4 w-4 rounded-full bg-white border-[2.5px] shadow-sm items-center justify-center ${
                        isSelectedInCalib ? 'border-amber-500 ring-2 ring-amber-400/80 scale-110' : 'border-[#7A283B]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelectedInCalib ? 'bg-amber-500' : 'bg-[#7A283B]'
                        }`}
                      />
                    </span>
                    {isSelectedInCalib && (
                      <span className="absolute -inset-1.5 border border-dashed border-amber-400 rounded-full animate-spin-slow pointer-events-none" />
                    )}
                  </span>
                </>
              ) : (
                <>
                  {/* Hotspot Pulsing Pin on the LEFT */}
                  <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 duration-1000 ${
                        isSelectedInCalib ? 'bg-amber-400' : 'bg-[#7A283B]'
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-4 w-4 rounded-full bg-white border-[2.5px] shadow-sm items-center justify-center ${
                        isSelectedInCalib ? 'border-amber-500 ring-2 ring-amber-400/80 scale-110' : 'border-[#7A283B]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelectedInCalib ? 'bg-amber-500' : 'bg-[#7A283B]'
                        }`}
                      />
                    </span>
                    {isSelectedInCalib && (
                      <span className="absolute -inset-1.5 border border-dashed border-amber-400 rounded-full animate-spin-slow pointer-events-none" />
                    )}
                  </span>

                  {/* Pill on the RIGHT */}
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-md border text-[10px] lg:text-[11px] font-bold whitespace-nowrap transition-colors ${
                      isSelectedInCalib
                        ? 'bg-amber-400 text-neutral-950 border-white shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-white/95 backdrop-blur-sm border-[#EDE5DB] text-neutral-900 group-hover/tag:bg-white group-hover/tag:border-[#7A283B]/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span className="text-neutral-300 font-normal">•</span>
                    <span className={isSelectedInCalib ? 'text-neutral-950' : 'text-[#7A283B]'}>
                      {tag.price} MAD
                    </span>
                    {!isDesktopCalibrating && (
                      <ArrowRight
                        size={10}
                        className="text-neutral-400 group-hover/tag:text-[#7A283B] group-hover/tag:translate-x-0.5 transition-all"
                      />
                    )}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Calibration Panel */}
      {isDesktopCalibrating && (
        <div className="hidden sm:block bg-neutral-900 text-white p-3.5 border-t border-neutral-800 space-y-3 shadow-xl max-w-4xl mx-auto my-3 rounded-xl">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Crosshair size={14} className="text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Ajustement des Pings (Version Ordinateur)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyDesktopConfig}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded transition-colors text-amber-300 cursor-pointer"
                title="Copier la configuration"
              >
                <Copy size={11} />
                <span>{desktopCopiedNotification ? 'Copié !' : 'Copier JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetDesktopTags}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-[10px] font-black rounded transition-colors cursor-pointer shadow-sm"
                title="Restaurer les positions idéales officielles"
              >
                <Sparkles size={11} />
                <span>Positions Idéales (1 clic)</span>
              </button>
            </div>
          </div>

          {/* Easy Method Guide Box */}
          <div className="bg-neutral-800/90 border border-amber-400/30 rounded-lg p-2.5 flex items-start gap-2.5 text-[11px] text-neutral-300">
            <span className="text-base leading-none">🎯</span>
            <div>
              <p className="font-bold text-white mb-0.5">
                Comment insérer les pings exactement sur le produit :
              </p>
              <p className="text-neutral-300 text-[10px] leading-relaxed">
                <strong className="text-amber-300">1. Glissez-déposez à la souris :</strong> Maintenez le clic sur le point rouge et glissez-le directement sur l'article (visière sur la tête, sac sur le banc, bandeau sur les mains, chaussettes aux chevilles).<br />
                <strong className="text-amber-300">2. Cible exacte :</strong> C'est le <span className="underline font-semibold text-white">centre du cercle rouge</span> qui doit toucher le produit. L'étiquette blanche (nom + prix) s'affiche à côté (gauche ou droite) pour ne pas cacher l'article.<br />
                <strong className="text-amber-300">3. En 1 clic :</strong> Cliquez sur <span className="text-amber-300 font-bold">Positions Idéales</span> pour aligner automatiquement les 4 produits au pixel près.
              </p>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              1. Choisissez l'article à positionner sur l'image :
            </div>
            <div className="grid grid-cols-4 gap-2">
              {desktopTags.map((tag) => {
                const isSelected = selectedDesktopTagId === tag.id;
                const coords = getTagCoordinates(tag);
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => setSelectedDesktopTagId(tag.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 ring-2 ring-white shadow-md'
                        : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700/80 border border-neutral-700/50'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-neutral-900 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {coords.x}%, {coords.y}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700/60 space-y-1.5">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                2. Position du texte par rapport au point :
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSelectedDesktopTag({ align: 'left' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeDesktopTag?.align === 'left'
                      ? 'bg-amber-400 text-neutral-950 shadow-md ring-1 ring-white'
                      : 'bg-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <ArrowLeft size={12} />
                  <span>À gauche</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedDesktopTag({ align: 'right' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeDesktopTag?.align === 'right'
                      ? 'bg-amber-400 text-neutral-950 shadow-md ring-1 ring-white'
                      : 'bg-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span>À droite</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700/60 space-y-1.5">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                3. Ajustement fin au millimètre :
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => nudgeSelectedDesktopTag(-1, 0)}
                  className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform cursor-pointer"
                  title="Gauche (-1%)"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeSelectedDesktopTag(0, -1)}
                    className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform cursor-pointer"
                    title="Haut (-1%)"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeSelectedDesktopTag(0, 1)}
                    className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform cursor-pointer"
                    title="Bas (+1%)"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => nudgeSelectedDesktopTag(1, 0)}
                  className="p-2 bg-neutral-700/90 hover:bg-neutral-600 rounded text-neutral-200 active:scale-90 transition-transform cursor-pointer"
                  title="Droite (+1%)"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-neutral-800">
            <p className="text-[10px] text-neutral-400">
              💡 Cliquez directement sur l'image pour placer{' '}
              <span className="text-amber-300 font-bold">{activeDesktopTag?.label}</span>.
            </p>
            <button
              type="button"
              onClick={() => setIsDesktopCalibrating(false)}
              className="px-4 py-1.5 bg-[#7A283B] hover:bg-[#681F30] text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* 3 Pillars / Value Props */}
      <div className="border-t border-[#EDE5DB] bg-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EDE5DB]">
            {/* Pillar 1 */}
            <div className="py-6 md:py-0 md:px-8 first:pl-0 text-center flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5F0] border border-[#EDE5DB] flex items-center justify-center text-neutral-800">
                <Sparkles size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900">
                Confort au quotidien
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed">
                Des matières douces et durables pour vous accompagner toute la journée.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="py-6 md:py-0 md:px-8 text-center flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5F0] border border-[#EDE5DB] flex items-center justify-center text-neutral-800">
                <Gem size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900">
                Style qui vous suit
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed">
                Des essentiels minimalistes et élégants pour un look toujours juste.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="py-6 md:py-0 md:px-8 last:pr-0 text-center flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5F0] border border-[#EDE5DB] flex items-center justify-center text-neutral-800">
                <Truck size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900">
                Livraison partout au Maroc
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed">
                Vos accessoires préférés, où que vous soyez dans tout le Maroc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
