import type { ReactNode } from "react";

interface ToolGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function ToolGrid({ children, columns = 3 }: ToolGridProps) {
  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {children}
    </div>
  );
}