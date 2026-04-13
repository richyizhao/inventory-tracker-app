import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type ChartSurfaceProps = {
  heightClass: string;
  renderChart: (size: { width: number; height: number }) => ReactNode;
};

export function ChartSurface({
  heightClass,
  renderChart,
}: ChartSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      setSize({
        width: Math.max(0, element.clientWidth),
        height: Math.max(0, element.clientHeight),
      });
    };

    measure();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;
      setSize({
        width: Math.max(0, Math.floor(width)) || element.clientWidth,
        height: Math.max(0, Math.floor(height)) || element.clientHeight,
      });
    });

    observer.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className={`${heightClass} min-w-0`} ref={containerRef}>
      {size.width > 0 && size.height > 0 ? renderChart(size) : null}
    </div>
  );
}
