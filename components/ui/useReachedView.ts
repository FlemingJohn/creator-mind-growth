"use client";

import { useEffect, useRef, useState } from "react";

interface ReachedViewOptions {
  once?: boolean;
  showWhenPart: number;
}

export function useReachedView<Holder extends HTMLElement>(options: ReachedViewOptions) {
  const holderRef = useRef<Holder>(null);
  const [reached, setReached] = useState(false);

  useEffect(
    function watchHolder() {
      const holder = holderRef.current;
      if (!holder) {
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        setReached(true);
        return;
      }

      const watcher = new IntersectionObserver(
        function onCross(entries) {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setReached(true);
            if (options.once) {
              watcher.disconnect();
            }
          } else if (!options.once) {
            setReached(false);
          }
        },
        { threshold: options.showWhenPart }
      );

      watcher.observe(holder);

      return function stopWatching() {
        watcher.disconnect();
      };
    },
    [options.once, options.showWhenPart]
  );

  return { holderRef, reached };
}
