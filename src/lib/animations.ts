
import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  options = {
    threshold: 0.1,
    triggerOnce: true,
    animationClass: "animate-fade-in",
  }
) => {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const { threshold, triggerOnce, animationClass } = options;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove(animationClass);
          }
        });
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return ref;
};

export const staggerChildren = (
  parentSelector: string,
  childSelector: string,
  baseDelay = 0.1
) => {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;

  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, index) => {
    const element = child as HTMLElement;
    element.style.animationDelay = `${baseDelay * index}s`;
  });
};
