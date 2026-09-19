import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = TESTIMONIALS.length;
  const currentReview = TESTIMONIALS[currentIndex];

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play switch every 7 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="avis-clients"
      className="py-12 sm:py-16 bg-white border-b border-[#F0EAE1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-5 border-b border-neutral-100 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-neutral-900 uppercase">
              Elles en parlent mieux que nous
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Les retours authentiques de notre communauté à travers le Maroc
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-2xl sm:text-3xl font-black text-neutral-900 font-heading">
              4.9/5
            </span>
            <div className="space-y-0.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-current" />
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                Basé sur 423 avis clients
              </p>
            </div>
          </div>
        </div>

        {/* 1-Line Testimonials Carousel Container with Switch Arrows */}
        <div
          className="relative bg-[#FAF7F2] border border-neutral-200/90 rounded-2xl p-4 sm:p-8 lg:p-10 shadow-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Switch Arrow */}
            <button
              id="btn-switch-review-prev"
              onClick={handlePrev}
              aria-label="Témoignage précédent"
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-white hover:bg-[#7A283B] hover:border-[#7A283B] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#7A283B]/30 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Testimonial in 1 Row (Smooth Animated Content) */}
            <div className="flex-1 min-w-0 overflow-hidden py-2 sm:py-4">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentReview.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 40 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto"
                >
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-center space-x-3">
                    <div className="flex text-amber-400">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star key={i} size={17} className="fill-current" />
                      ))}
                    </div>
                    <span className="text-neutral-300 text-sm font-light">|</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A283B] bg-[#7A283B]/10 px-2.5 py-0.5 rounded-full">
                      <Quote size={11} className="rotate-180" />
                      {currentReview.productName}
                    </span>
                  </div>

                  {/* Comment Text on 1 Main Statement Row */}
                  <p className="text-base sm:text-xl md:text-2xl font-medium text-neutral-800 leading-relaxed sm:leading-snug italic px-2 sm:px-6">
                    “{currentReview.comment}”
                  </p>

                  {/* Author, City & Verified Purchase Metadata */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 text-xs sm:text-sm text-neutral-600">
                    <span className="font-bold text-neutral-900 tracking-wide uppercase">
                      {currentReview.author}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="font-medium text-neutral-700">
                      {currentReview.city}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle size={12} className="text-emerald-600" />
                      Achat vérifié
                    </span>
                    <span className="text-neutral-400 hidden sm:inline">•</span>
                    <span className="text-[11px] text-neutral-400 hidden sm:inline">
                      {currentReview.date}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Switch Arrow */}
            <button
              id="btn-switch-review-next"
              onClick={handleNext}
              aria-label="Témoignage suivant"
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-white hover:bg-[#7A283B] hover:border-[#7A283B] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#7A283B]/30 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bottom Controls: Dots Indicators (Centered) */}
          <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center justify-center text-xs text-neutral-500">
            {/* Centered Pagination Dots */}
            <div className="flex items-center justify-center space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-[#7A283B]'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
