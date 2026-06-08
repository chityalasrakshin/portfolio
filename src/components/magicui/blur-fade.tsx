"use client";

import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

// Update the type definition to match Framer Motion's MarginType
type InViewMargin =
  | string
  | number
  | {
      top?: number | string;
      bottom?: number | string;
      left?: number | string;
      right?: number | string;
    }
  | undefined;

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  // Updated yOffset to be only number or string, which is compatible with Framer Motion
  yOffset?: number | string;
  inView?: boolean;
  inViewMargin?: InViewMargin;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "0px",
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef(null);

  // The useInView hook accepts a string as margin
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as any, // Type assertion to prevent TypeScript error
  });

  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: {
      y: typeof yOffset === "number" ? -yOffset : 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
