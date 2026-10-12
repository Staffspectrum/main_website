"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
}

export interface MagicContentProps {
  paragraphs: string[];
  className?: string;
  paragraphClassName?: string;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const color = useTransform(
    progress,
    range,
    ["#9ca3af", "#000000"]
  );

  return (
    <motion.span style={{ color }} className="inline select-text">
      {children}{" "}
    </motion.span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, className }) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.88", "start 0.40"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={className || ""}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export const MagicContent: React.FC<MagicContentProps> = ({
  paragraphs,
  className,
  paragraphClassName,
}) => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.88", "end 0.50"],
  });

  const totalWords = paragraphs.reduce(
    (acc, p) => acc + p.split(" ").length,
    0
  );

  let wordCounter = 0;

  return (
    <div ref={container} className={className || ""}>
      {paragraphs.map((text, pIndex) => {
        const words = text.split(" ");

        return (
          <p key={pIndex} className={paragraphClassName || ""}>
            {words.map((word, wIndex) => {
              const globalIndex = wordCounter++;
              const start = globalIndex / totalWords;
              const end = start + 1 / totalWords;

              return (
                <Word
                  key={wIndex}
                  progress={scrollYProgress}
                  range={[start, end]}
                >
                  {word}
                </Word>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

export default MagicText;
