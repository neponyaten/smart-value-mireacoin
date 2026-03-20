"use client";

import { useEffect, useRef, useState } from "react";

export function useLazyMount(rootMargin = "180px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || mounted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return { ref, mounted };
}
