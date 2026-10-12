"use client";

import { useEffect, useState } from "react";
import { type JSX } from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type TextShimmerWaveProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: Transition;
  baseColor?: string;
  gradientColor?: string;
};

function TextShimmerWave({
  children,
  as: Component = "p",
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  baseColor: customBaseColor,
  gradientColor: customGradientColor,
}: TextShimmerWaveProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements,
  );

  // Track dark mode based on <html> class
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Colors based on theme or props
  const baseColor = customBaseColor ?? (isDark ? "#71717a" : "#111111");
  const gradientColor = customGradientColor ?? (isDark ? "#ffffff" : "#0055ff");

  return (
    <MotionComponent
      className={cn("relative inline-block [perspective:500px]", className)}
      style={{ color: baseColor, fontFamily: "var(--font-outfit), sans-serif" }}
    >
      {children.split("").map((char, i) => {
        const delay = (i * duration * (1 / spread)) / children.length;

        return (
          <motion.span
            key={`${char}-${i}-${isDark}`} // remounts span when theme changes
            className="inline-block whitespace-pre [transform-style:preserve-3d] font-black"
            style={{ WebkitTextStroke: "1px #111111", paintOrder: "stroke fill", fontFamily: "var(--font-outfit), sans-serif" }}
            initial={{
              translateZ: 0,
              scale: 1,
              rotateY: 0,
              color: baseColor,
            }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: [baseColor, gradientColor, baseColor],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatDelay: (children.length * 0.05) / spread,
              delay,
              ease: "easeInOut",
              ...transition,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}

export { TextShimmerWave };

export default function TextShimmerMotion({
  text = "Best HR Solution in Kerala",
  className,
  baseColor = "#111111",
  gradientColor = "#0055ff",
  duration = 1.5,
  spread = 1,
  zDistance = 1,
  scaleDistance = 1.1,
  rotateYDistance = 20,
}: {
  text?: string;
  className?: string;
  baseColor?: string;
  gradientColor?: string;
  duration?: number;
  spread?: number;
  zDistance?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
}) {
  return (
    <TextShimmerWave
      className={className}
      duration={duration}
      spread={spread}
      zDistance={zDistance}
      scaleDistance={scaleDistance}
      rotateYDistance={rotateYDistance}
      baseColor={baseColor}
      gradientColor={gradientColor}
    >
      {text}
    </TextShimmerWave>
  );
}
