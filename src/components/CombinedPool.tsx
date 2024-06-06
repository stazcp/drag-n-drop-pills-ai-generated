import React, { useRef } from "react";
import { useDrop } from "@react-aria/dnd";

interface CombinedPoolProps {
  poolId: string;
  children: React.ReactNode;
  onDragOut: (id: string) => void;
  onDrop: (items: any[], poolId: string) => void;
  setDropHandled: (handled: boolean) => void;
}

export function CombinedPool({
  poolId,
  children,
  onDragOut,
  onDrop,
  setDropHandled,
}: CombinedPoolProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { dropProps } = useDrop({
    ref,
    async onDrop(e) {
      setDropHandled(true);
      const items = await Promise.all(
        e.items.map(async (item) => {
          const data = await item.getText("text/plain");
          const { id, label } = JSON.parse(data);
          return { id, label };
        }),
      );
      onDrop(items, poolId);
    },
    onDropEnter() {
      setDropHandled(true);
    },
    onDropExit() {
      setDropHandled(false);
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
          onDragOut,
        }),
      )}
    </div>
  );
}
