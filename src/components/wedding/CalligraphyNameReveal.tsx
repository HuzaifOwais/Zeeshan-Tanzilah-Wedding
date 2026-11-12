import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion, motion } from "framer-motion";

interface CalligraphyNameRevealProps {
  active: boolean;
  onComplete?: () => void;
}

// Cubic bezier path following natural cursive script strokes of "Zeeshan Alam" (top position)
const GROOM_PATH =
  "M 130.0,125.0 C 148.0,125.0 152.0,125.0 170.0,125.0 C 165.0,125.0 165.0,160.0 160.0,160.0 C 175.0,160.0 175.0,160.0 190.0,160.0 C 195.0,160.0 195.0,152.0 200.0,152.0 C 205.0,152.0 205.0,162.0 210.0,162.0 C 215.0,162.0 215.0,152.0 220.0,152.0 C 225.0,152.0 225.0,162.0 230.0,162.0 C 235.0,162.0 235.0,152.0 240.0,152.0 C 245.0,152.0 245.0,162.0 250.0,162.0 C 258.0,162.0 258.0,118.0 265.0,118.0 C 270.0,118.0 270.0,162.0 275.0,162.0 C 283.0,162.0 283.0,152.0 290.0,152.0 C 295.0,152.0 295.0,162.0 300.0,162.0 C 308.0,162.0 308.0,152.0 315.0,152.0 C 320.0,152.0 320.0,162.0 325.0,162.0 C 333.0,162.0 333.0,138.0 340.0,138.0 C 348.0,138.0 348.0,118.0 355.0,118.0 C 360.0,118.0 360.0,162.0 365.0,162.0 C 373.0,162.0 373.0,145.0 380.0,145.0 C 388.0,145.0 388.0,118.0 395.0,118.0 C 400.0,118.0 400.0,162.0 405.0,162.0 C 413.0,162.0 413.0,152.0 420.0,152.0 C 425.0,152.0 425.0,162.0 430.0,162.0 C 435.0,162.0 435.0,152.0 440.0,152.0 C 448.0,152.0 448.0,162.0 455.0,162.0 C 463.0,162.0 463.0,152.0 470.0,152.0 C 478.0,152.0 480.0,158.0 488.0,158.0";

// Cubic bezier path following decorative ampersand "&"
const AMP_PATH =
  "M 265.0,245.0 C 272.5,245.0 272.5,218.0 280.0,218.0 C 287.5,218.0 287.5,212.0 295.0,212.0 C 300.0,212.0 300.0,228.0 305.0,228.0 C 297.5,228.0 297.5,245.0 290.0,245.0 C 297.5,245.0 297.5,256.0 305.0,256.0 C 318.0,256.0 318.0,238.0 332.0,238.0";

// Cubic bezier path following natural cursive script strokes of "Tanzilah Fatema" (bottom position)
const BRIDE_PATH =
  "M 95.0,295.0 C 105.0,285.0 115.0,280.0 125.0,280.0 C 128.0,280.0 127.0,325.0 130.0,325.0 C 138.0,325.0 140.0,312.0 148.0,312.0 C 153.0,312.0 152.0,324.0 158.0,324.0 C 165.0,324.0 166.0,308.0 173.0,308.0 C 180.0,308.0 180.0,324.0 188.0,324.0 C 195.0,324.0 196.0,312.0 203.0,312.0 C 208.0,312.0 208.0,346.0 212.0,346.0 C 215.0,346.0 215.0,312.0 218.0,312.0 C 225.0,312.0 226.0,312.0 233.0,312.0 C 240.0,312.0 240.0,282.0 248.0,282.0 C 253.0,282.0 252.0,324.0 258.0,324.0 C 265.0,324.0 266.0,312.0 273.0,312.0 C 278.0,312.0 278.0,324.0 283.0,324.0 C 290.0,324.0 290.0,282.0 298.0,282.0 C 303.0,282.0 302.0,324.0 308.0,324.0 C 318.0,324.0 320.0,308.0 330.0,308.0 C 338.0,308.0 338.0,282.0 345.0,282.0 C 350.0,282.0 350.0,324.0 355.0,324.0 C 368.0,324.0 368.0,312.0 380.0,312.0 C 385.0,312.0 385.0,324.0 390.0,324.0 C 398.0,324.0 398.0,292.0 405.0,292.0 C 410.0,292.0 410.0,324.0 415.0,324.0 C 422.0,324.0 422.0,312.0 430.0,312.0 C 440.0,308.0 440.0,308.0 450.0,308.0 C 458.0,308.0 458.0,324.0 465.0,324.0 C 470.0,324.0 470.0,308.0 475.0,308.0 C 482.0,308.0 482.0,312.0 490.0,312.0 C 495.0,312.0 495.0,324.0 500.0,324.0 C 508.0,324.0 508.0,282.0 515.0,282.0 C 522.0,282.0 522.0,324.0 530.0,324.0 C 538.0,324.0 540.0,312.0 548.0,312.0";

const GROOM_LEN = 800;
const AMP_LEN = 260;
const BRIDE_LEN = 850;

export function CalligraphyNameReveal({ active, onComplete }: CalligraphyNameRevealProps) {
  const reducedMotion = useReducedMotion();

  // Step-by-step sequential animation state:
  // 1. "Zeeshan Alam" appears on top -> stops and remains constant
  // 2. "&" appears -> stops and remains constant
  // 3. "Tanzilah Fatema" appears below -> stops and remains constant
  // 4. All names stay permanently constant on screen (do not vanish)
  const [groomStarted, setGroomStarted] = useState(false);
  const [groomDone, setGroomDone] = useState(false);
  const [groomShimmer, setGroomShimmer] = useState(false);

  const [ampStarted, setAmpStarted] = useState(false);
  const [ampDone, setAmpDone] = useState(false);

  const [brideStarted, setBrideStarted] = useState(false);
  const [brideDone, setBrideDone] = useState(false);
  const [brideShimmer, setBrideShimmer] = useState(false);

  const [allDone, setAllDone] = useState(false);

  const hasExecutedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active || hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    if (reducedMotion) {
      setGroomStarted(true);
      setGroomDone(true);
      setAmpStarted(true);
      setAmpDone(true);
      setBrideStarted(true);
      setBrideDone(true);
      setAllDone(true);
      onCompleteRef.current?.();
      return;
    }

    // Step 1: Zeeshan Alam appears smoothly on top
    const t0 = setTimeout(() => {
      setGroomStarted(true);
    }, 60);

    // Groom writing completes at 1.9s -> stops and remains constant
    const t1 = setTimeout(() => {
      setGroomDone(true);
      setGroomShimmer(true);
    }, 1900);

    // Step 2: Ampersand "&" appears after groom stops
    const t2 = setTimeout(() => {
      setAmpStarted(true);
    }, 2350);

    // Ampersand writing completes at 3.05s -> stops and remains constant
    const t3 = setTimeout(() => {
      setAmpDone(true);
    }, 3050);

    // Step 3: Tanzilah Fatema appears after ampersand stops
    const t4 = setTimeout(() => {
      setBrideStarted(true);
    }, 3500);

    // Bride writing completes at 5.35s -> stops and remains constant
    const t5 = setTimeout(() => {
      setBrideDone(true);
      setBrideShimmer(true);
      setAllDone(true);
      onCompleteRef.current?.();
    }, 5350);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [active, reducedMotion]);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center pointer-events-none select-none px-3 sm:px-6"
      aria-label="Calligraphic wedding invitation lettering"
    >
      <svg
        viewBox="0 0 600 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-w-[440px] sm:max-w-[480px] md:max-w-[520px] max-h-[75dvh] sm:max-h-[80svh] overflow-visible"
      >
        <defs>
          <style>{`
            @keyframes subtleTwinkle {
              0%, 100% { opacity: 0.25; transform: scale(0.7); }
              50% { opacity: 1; transform: scale(1.15); }
            }
          `}</style>

          {/* Luxurious Champagne Gold Foil Gradient */}
          <linearGradient id="champagneGoldGrad" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="16%" stopColor="#fcedb8" />
            <stop offset="40%" stopColor="#caa048" />
            <stop offset="65%" stopColor="#fae8b8" />
            <stop offset="85%" stopColor="#b38733" />
            <stop offset="100%" stopColor="#8d6823" />
          </linearGradient>

          {/* Accent Gold Gradient for ampersand and ornaments */}
          <linearGradient id="accentGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#caa048" />
            <stop offset="50%" stopColor="#fff2cf" />
            <stop offset="100%" stopColor="#caa048" />
          </linearGradient>

          {/* Golden Shimmer Sweep Gradient */}
          <linearGradient id="shimmerSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Royal Glow & Drop Shadow Filter for legibility over bright sunlit rotunda */}
          <filter id="royalGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#1a1106" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#e6b800" floodOpacity="0.45" />
          </filter>

          {/* Subtle Ambient Glow for completed composition */}
          <filter id="ambientGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#1a1106" floodOpacity="0.65" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#d4af37" floodOpacity="0.5" />
          </filter>

          {/* Bride Writing Reveal Mask (Hardware accelerated CSS stroke transition) */}
          <mask id="brideRevealMask" maskUnits="userSpaceOnUse">
            <path
              d={BRIDE_PATH}
              fill="none"
              stroke="white"
              strokeWidth="74"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: BRIDE_LEN,
                strokeDashoffset: brideStarted ? 0 : BRIDE_LEN,
                transition: brideStarted ? "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            />
          </mask>

          {/* Ampersand Reveal Mask (Hardware accelerated CSS stroke transition) */}
          <mask id="ampRevealMask" maskUnits="userSpaceOnUse">
            <path
              d={AMP_PATH}
              fill="none"
              stroke="white"
              strokeWidth="64"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: AMP_LEN,
                strokeDashoffset: ampStarted ? 0 : AMP_LEN,
                transition: ampStarted ? "stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            />
          </mask>

          {/* Groom Writing Reveal Mask (Hardware accelerated CSS stroke transition) */}
          <mask id="groomRevealMask" maskUnits="userSpaceOnUse">
            <path
              d={GROOM_PATH}
              fill="none"
              stroke="white"
              strokeWidth="74"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: GROOM_LEN,
                strokeDashoffset: groomStarted ? 0 : GROOM_LEN,
                transition: groomStarted ? "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            />
          </mask>
        </defs>

        {/* Soft Contrast Backing Aura: blends smoothly into rotunda while protecting text legibility */}
        <ellipse
          cx="300"
          cy="245"
          rx="250"
          ry="190"
          fill="#160e05"
          opacity="0.32"
          filter="blur(26px)"
        />

        {/* 1. GROOM'S NAME: "Zeeshan Alam" (Appears first, then stops and stays constant) */}
        <g filter={allDone ? "url(#ambientGlowFilter)" : "url(#royalGlowFilter)"}>
          <text
            x="300"
            y="166"
            textAnchor="middle"
            fontFamily="'Great Vibes', cursive"
            fontSize="56"
            fill="url(#champagneGoldGrad)"
            mask={groomDone ? undefined : (groomStarted ? "url(#groomRevealMask)" : undefined)}
            style={{
              opacity: groomStarted || groomDone ? 1 : 0,
              transition: "opacity 0.2s ease-in",
            }}
          >
            Zeeshan Alam
          </text>
        </g>

        {/* Groom Completion Shimmer Wave */}
        {groomShimmer && !reducedMotion && (
          <motion.rect
            x="130"
            y="110"
            width="80"
            height="80"
            fill="url(#shimmerSweepGrad)"
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 480, opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        )}

        {/* 2. DECORATIVE AMPERSAND: "&" (Appears second, then stops and stays constant) */}
        <g
          filter={allDone ? "url(#ambientGlowFilter)" : "url(#royalGlowFilter)"}
          style={{
            opacity: ampStarted || ampDone ? 1 : 0,
            transition: "opacity 0.3s ease-in",
          }}
        >
          {/* Flanking luxury divider lines */}
          <line
            x1="190"
            y1="232"
            x2="260"
            y2="232"
            stroke="#caa048"
            strokeWidth="0.9"
            style={{
              strokeDasharray: 70,
              strokeDashoffset: ampStarted || ampDone ? 0 : 70,
              transition: "stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          <text
            x="300"
            y="244"
            textAnchor="middle"
            fontFamily="'Great Vibes', cursive"
            fontSize="44"
            fill="url(#accentGoldGrad)"
            mask={ampDone ? undefined : (ampStarted ? "url(#ampRevealMask)" : undefined)}
          >
            &amp;
          </text>
          <line
            x1="340"
            y1="232"
            x2="410"
            y2="232"
            stroke="#caa048"
            strokeWidth="0.9"
            style={{
              strokeDasharray: 70,
              strokeDashoffset: ampStarted || ampDone ? 0 : 70,
              transition: "stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </g>

        {/* 3. BRIDE'S NAME: "Tanzilah Fatema" (Appears third, then stops and stays constant) */}
        <g filter={allDone ? "url(#ambientGlowFilter)" : "url(#royalGlowFilter)"}>
          <text
            x="300"
            y="326"
            textAnchor="middle"
            fontFamily="'Great Vibes', cursive"
            fontSize="56"
            fill="url(#champagneGoldGrad)"
            mask={brideDone ? undefined : (brideStarted ? "url(#brideRevealMask)" : undefined)}
            style={{
              opacity: brideStarted || brideDone ? 1 : 0,
              transition: "opacity 0.2s ease-in",
            }}
          >
            Tanzilah Fatema
          </text>
        </g>

        {/* Bride Completion Shimmer Wave */}
        {brideShimmer && !reducedMotion && (
          <motion.rect
            x="95"
            y="270"
            width="80"
            height="80"
            fill="url(#shimmerSweepGrad)"
            initial={{ x: 90, opacity: 0 }}
            animate={{ x: 510, opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        )}

        {/* Bottom Flourish Accent Line: gracefully reveals after names finish and stays constant */}
        <g
          filter="url(#royalGlowFilter)"
          style={{
            opacity: allDone ? 0.9 : 0,
            transform: allDone ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <path d="M 220,378 Q 300,396 380,378" fill="none" stroke="#caa048" strokeWidth="1.1" opacity="0.8" />
          <circle cx="300" cy="387" r="2.8" fill="#fffdf0" />
          <circle cx="282" cy="386" r="1.5" fill="#fae8b8" />
          <circle cx="318" cy="386" r="1.5" fill="#fae8b8" />
        </g>

        {/* Subtle Luxury Diamond Sparkles that twinkle gracefully via pure CSS */}
        {allDone && !reducedMotion && (
          <g>
            {/* Sparkle near Tanzilah dot */}
            <g transform="translate(235, 128)" style={{ animation: "subtleTwinkle 3s infinite ease-in-out" }}>
              <path d="M 0,-5 L 1.2,-1.2 L 5,0 L 1.2,1.2 L 0,5 L -1.2,1.2 L -5,0 L -1.2,-1.2 Z" fill="#fffdf0" />
            </g>
            {/* Sparkle near & */}
            <g transform="translate(305, 218)" style={{ animation: "subtleTwinkle 2.6s infinite 0.8s ease-in-out" }}>
              <path d="M 0,-4 L 1,-1 L 4,0 L 1,1 L 0,4 L -1,1 L -4,0 L -1,-1 Z" fill="#fae8b8" />
            </g>
            {/* Sparkle near Zeeshan Alam */}
            <g transform="translate(438, 308)" style={{ animation: "subtleTwinkle 3.2s infinite 1.4s ease-in-out" }}>
              <path d="M 0,-5 L 1.2,-1.2 L 5,0 L 1.2,1.2 L 0,5 L -1.2,1.2 L -5,0 L -1.2,-1.2 Z" fill="#fffdf0" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
