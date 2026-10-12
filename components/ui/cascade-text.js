"use client";

import React, { useMemo, useState } from "react";

const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "a",
  href,
  target,
  className = "",
  style,
  fontSize = "inherit",
  staggerDelay = 25,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "inherit",
  direction = "up",
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  // Directly split character array to prevent server/client hydration mismatch
  const chars = useMemo(() => {
    return [...text];
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const inlineStyles = {
    display: "inline-block",
    position: "relative",
    textDecoration: "none",
    overflow: "hidden",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 0.35s ease",
    lineHeight: 1.15,
    ...style,
  };

  // Only apply fontSize inline if it is not "inherit"
  if (fontSize && fontSize !== "inherit") {
    inlineStyles.fontSize = fontSize;
  }

  // Only apply color inline if it is not "inherit"
  const activeColor = hovered ? hoverColor : color;
  if (activeColor && activeColor !== "inherit") {
    inlineStyles.color = activeColor;
  }

  const rootProps = {
    className: className.trim(),
    style: inlineStyles,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    "aria-label": text,
  };

  if (Component === "a" || href) {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  return (
    <Component {...rootProps}>
      <span
        style={{ 
          display: "inline-flex", 
          position: "relative", 
          overflow: "hidden", 
          height: "1em" 
        }}
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              willChange: "transform",
              textShadow: `0 ${sign}em currentColor`,
              transition: `transform ${duration}ms ${easing}`,
              transitionDelay: `${i * staggerDelay}ms`,
              transform: hovered
                ? `translateY(${-sign}em)`
                : "translateY(0)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Component>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
