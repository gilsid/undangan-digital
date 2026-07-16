"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  duration?: number;
  margin?: string;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  stagger?: boolean;
  staggerDelay?: number;
  spring?: boolean;
}

function getVariants(
  dir: NonNullable<Props["direction"]>,
  y: number,
  d: number,
  sp: boolean
): Variants {
  const hidden: Record<string, number | undefined> = { opacity: 0 };
  if (dir === "up") hidden.y = y;
  if (dir === "down") hidden.y = -y;
  if (dir === "left") hidden.x = -y;
  if (dir === "right") hidden.x = y;
  if (dir === "scale") { hidden.scale = 0.92; hidden.y = y / 2; }

  const visible: Record<string, number | string | object | undefined> = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: sp ? undefined : d,
      delay: sp ? undefined : 0,
      ease: sp ? undefined : "easeOut",
      ...(sp ? { type: "spring" as const, stiffness: 100, damping: 20 } : {}),
    },
  };

  return {
    hidden,
    visible,
  };
}

export default function Section({
  children, className = "", delay = 0, style,
  duration = 0.6, margin = "-60px",
  direction = "up", stagger = false, staggerDelay = 0.1, spring = false,
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) direction = "none";

  const variants = getVariants(direction, 24, duration, spring);
  if (direction === "none") {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={variants}
    >
      {stagger ? (
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: staggerDelay, delayChildren: delay },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin }}
          variants={{
            hidden: {},
            visible: {
              transition: { delay },
            },
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}