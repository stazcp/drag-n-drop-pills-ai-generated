import React, { useRef } from "react";
import { useDrop } from "@react-aria/dnd";

interface CombinedPoolProps {
  poolId: string;
  children: React.ReactNode;
  onDragOut: (id: string) => void;
  onDrop: (items: any[], poolId: string) => void;
}

export function CombinedPool({
  poolId,
  children,
  onDragOut,
  onDrop,
}: CombinedPoolProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const items = await Promise.all(
        e.items.map(async (item) => {
          const data = await item.getText("text/plain");
          const { id, label } = JSON.parse(data);
          return { id, label };
        })
      );
      onDrop(items, poolId);
    },
  });

  return (
    <div
      {...dropProps}
      ref={ref}
      style={{ border: "2px solid green", padding: "16px", marginTop: "8px" }}
    >
      <p>Combined Pool</p>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          onDragOut: onDragOut,
        })
      )}
    </div>
  );
}
