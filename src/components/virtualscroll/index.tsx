import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface VirtualScrollProps {
  children: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  itemHeight: number;
  reverse?: boolean;
  scrollPos?: number;
}

/**
 * 使子组件列表支持虚拟滚动
 */
const VirtualScroll: React.FC<VirtualScrollProps> = (props) => {
  const { children, className, style, itemHeight, reverse, scrollPos } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState([0, 0]);

  useEffect(() => {
    const updateVisibleRange = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        let start = Math.floor(scrollTop / itemHeight);
        let end =
          start + Math.ceil(containerRef.current.clientHeight / itemHeight);
        const div = end - start;
        if (reverse) {
          start = children.length - end;
          end = start + div;
        }
        setVisibleRange([start, end]);
      }
    };

    updateVisibleRange();
    if (containerRef.current) {
      if (reverse) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
      containerRef.current.addEventListener("scroll", updateVisibleRange);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", updateVisibleRange);
      }
    };
  }, [children.length, itemHeight, reverse]);

  useEffect(() => {
    if (containerRef.current && scrollPos !== undefined) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight * scrollPos - containerRef.current.clientHeight + itemHeight * 2;
    }
  }, [itemHeight, scrollPos])

  if (!children) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        overflow: "auto",
      }}
      className={styles["virtual-scroll-container"]}
    >
      <div
        className={className}
        style={{
          height: children.length * itemHeight,
          position: "relative",
        }}
      >
        {children
          .slice(visibleRange[0], visibleRange[1]).reverse()
          .map((child, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: reverse
                  ? (children.length - visibleRange[1] + index) * itemHeight
                  : (visibleRange[0] + index) * itemHeight,
                width: "100%",
              }}
            >
              {child}
            </div>
          ))}
      </div>
    </div>
  );
};

export default VirtualScroll;
