"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A helper to map common Tailwind classes to inline styles for non-Tailwind environments
const getInlineStylesFromTailwind = (className) => {
  if (!className) return {};
  const styles = {};

  if (className.includes("text-xs")) styles.fontSize = "0.75rem";
  else if (className.includes("text-sm")) styles.fontSize = "0.875rem";
  else if (className.includes("text-lg")) styles.fontSize = "1.125rem";
  else if (className.includes("text-xl")) styles.fontSize = "1.25rem";
  else if (className.includes("text-6xl")) styles.fontSize = "3.75rem";
  
  if (className.includes("font-semibold")) styles.fontWeight = 600;
  else if (className.includes("font-bold")) styles.fontWeight = 700;
  else if (className.includes("font-medium")) styles.fontWeight = 500;

  if (className.includes("uppercase")) styles.textTransform = "uppercase";
  
  const trackingMatch = className.match(/tracking-\[([^\]]+)\]/);
  if (trackingMatch) {
    styles.letterSpacing = trackingMatch[1];
  } else if (className.includes("tracking-widest")) {
    styles.letterSpacing = "0.1em";
  }

  const colorMatch = className.match(/text-\[([^\]]+)\]/);
  if (colorMatch) {
    styles.color = colorMatch[1];
  }

  return styles;
};

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
  style
}) {
  const text1Ref = React.useRef(null);
  const text2Ref = React.useRef(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    const setMorph = (fraction) => {
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        if (containerRef.current) {
          containerRef.current.style.filter = "url(#threshold-goo)";
        }
        doMorph();
      } else {
        if (containerRef.current) {
          containerRef.current.style.filter = "none";
        }
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [texts, morphTime, cooldownTime]);

  const inlineTextStyles = React.useMemo(() => {
    return getInlineStylesFromTailwind(textClassName);
  }, [textClassName]);

  return (
    <div className={cn("relative", className)} style={style}>
      <svg className="absolute h-0 w-0 hidden" aria-hidden="true" focusable="false" style={{ display: "none" }}>
        <defs>
          <filter id="threshold-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className="flex items-center justify-center"
        style={{ filter: "url(#threshold-goo)", display: "flex", alignItems: "center", justifyContent: "flex-start", position: "relative", minHeight: "100%", height: "100%" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block select-none text-center text-6xl md:text-[60pt]",
            "text-foreground",
            textClassName
          )}
          style={{ position: "absolute", display: "inline-block", userSelect: "none", textAlign: "left", left: 0, whiteSpace: "nowrap", ...inlineTextStyles }}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inline-block select-none text-center text-6xl md:text-[60pt]",
            "text-foreground",
            textClassName
          )}
          style={{ position: "absolute", display: "inline-block", userSelect: "none", textAlign: "left", left: 0, whiteSpace: "nowrap", ...inlineTextStyles }}
        />
      </div>
    </div>
  );
}
