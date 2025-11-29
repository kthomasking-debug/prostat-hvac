import React, { useMemo } from 'react';
import { shouldDisableAnimations } from '../../utils/legacyDetection';
import { motion as framerMotion } from 'framer-motion';

// Check if we should disable animations (legacy browser)
const isLegacy = shouldDisableAnimations();

// Fallback div component for legacy browsers (no animations)
const FallbackDiv = ({ children, style, className, ...props }) => (
  <div style={style} className={className} {...props}>
    {children}
  </div>
);

// Use motion on modern browsers, fallback on legacy
const motion = isLegacy ? FallbackDiv : framerMotion.div;

export function Sunny() {
  const MotionDiv = motion || FallbackDiv;
  return (
    <MotionDiv
      className="ai-weather-layer"
      {...(motion ? {
        initial: { opacity: 0 },
        animate: { opacity: 0.5 }
      } : {})}
      style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,200,0.35), rgba(255,255,255,0))' }}
    />
  );
}

export function Night() {
  const isLegacy = shouldDisableAnimations();
  const MotionDiv = motion || FallbackDiv;
  const stars = useMemo(() => {
    const count = window.innerWidth < 640 ? 25 : 40;
    return Array.from({ length: count }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      d: 2 + Math.random() * 3,
      delay: Math.random() * 4
    }));
  }, []);
  return (
    <div className="ai-weather-layer">
      {stars.map((s, i) => (
        <MotionDiv
          key={i}
          className="ai-star"
          {...(motion && !isLegacy ? {
            initial: { opacity: 0 },
            animate: { opacity: [0, 1, 0] },
            transition: { duration: s.d, repeat: Infinity, delay: s.delay }
          } : {
            style: { opacity: 0.8 } // Static fallback for legacy
          })}
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
        />
      ))}
    </div>
  );
}

export function Snowy() {
  const isLegacy = shouldDisableAnimations();
  const MotionDiv = motion || FallbackDiv;
  const flakes = useMemo(() => {
    const count = window.innerWidth < 640 ? 18 : 30;
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      dur: 6 + Math.random() * 4,
      delay: Math.random() * 5
    }));
  }, []);
  return (
    <div className="ai-weather-layer">
      {flakes.map((f, i) => (
        <MotionDiv
          key={i}
          className="ai-snow"
          {...(motion && !isLegacy ? {
            initial: { y: -20, opacity: 0 },
            animate: { y: '110%', opacity: 0.9 },
            transition: { duration: f.dur, repeat: Infinity, delay: f.delay }
          } : {
            style: { opacity: 0.5 } // Static fallback for legacy
          })}
          style={{ left: `${f.left}%` }}
        />
      ))}
    </div>
  );
}

export function Rainy() {
  const isLegacy = shouldDisableAnimations();
  const MotionDiv = motion || FallbackDiv;
  const drops = useMemo(() => {
    const count = window.innerWidth < 640 ? 30 : 50;
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      dur: 1.8 + Math.random(),
      delay: Math.random() * 1.5
    }));
  }, []);
  return (
    <div className="ai-weather-layer">
      {drops.map((d, i) => (
        <MotionDiv
          key={i}
          className="ai-rain"
          {...(motion && !isLegacy ? {
            initial: { y: -40, opacity: 0 },
            animate: { y: '110%', opacity: 0.8 },
            transition: { duration: d.dur, repeat: Infinity, delay: d.delay }
          } : {
            style: { opacity: 0.6 } // Static fallback for legacy
          })}
          style={{ left: `${d.left}%`, width: 2, height: 14 }}
        />
      ))}
    </div>
  );
}
