import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  scale?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 0.9,
    delay = 0,
    ease = 'power3.out',
    start = 'top 88%',
    scale,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { y, x, opacity, ...(scale !== undefined ? { scale } : {}) });

    const tween = gsap.to(el, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
    };
  }, [y, x, opacity, duration, delay, ease, start, scale]);

  return ref;
}

export function useStaggerReveal<T extends HTMLElement>(
  selector: string,
  options: ScrollRevealOptions = {}
) {
  const containerRef = useRef<T>(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 0.9,
    delay = 0,
    stagger = 0.12,
    ease = 'power3.out',
    start = 'top 88%',
    scale,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(selector);
    if (!children.length) return;

    gsap.set(children, { y, x, opacity, ...(scale !== undefined ? { scale } : {}) });

    const tween = gsap.to(children, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
    };
  }, [selector, y, x, opacity, duration, delay, stagger, ease, start, scale]);

  return containerRef;
}
