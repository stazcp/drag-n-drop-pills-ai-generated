// src/components/DropZone.js
import React, { useRef } from "react";
import { useDrop } from "@react-aria/dnd";

export function DropZone({ onDrop, children }) {
  const ref = useRef();

  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const items = await Promise.all(
        e.items.map(async (item) => {
          const data = await item.getText("text/plain");
          const { id, label } = JSON.parse(data);
          return { id, label };
        }),
      );
      onDrop(items);
    },
  });

  return (
    <div
      {...dropProps}
      ref={ref}
      style={{
        padding: "16px",
        margin: "8px",
        backgroundColor: isDropTarget ? "goldenrod" : "grey",
        border: "2px dashed #bbb",
      }}
    >
      {children}
    </div>
  );
}
