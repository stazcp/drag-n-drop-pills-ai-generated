import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "@react-aria/dnd";

export function Pill({ id, label, onCombine, onDragOut }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  const { dragProps } = useDrag({
    getItems() {
      return [{ "text/plain": JSON.stringify({ id, label }) }];
    },
    onDragEnd(e) {
      if (onDragOut) {
        onDragOut(id);
      }
    },
  });

  const { dropProps } = useDrop({
    ref,
    onDropEnter() {
      setIsHovered(true);
    },
    onDropExit() {
      setIsHovered(false);
    },
    onDrop(e) {
      setIsHovered(false);

      const droppedItem = e.items[0];
      droppedItem.getText("text/plain").then((data) => {
        const droppedItemData = JSON.parse(data);
        if (droppedItemData.id && droppedItemData.id !== id) {
          onCombine(id, droppedItemData.id);
        }
      });
    },
  });

  return (
    <div
      {...dragProps}
      {...dropProps}
      ref={ref}
      style={{
        padding: "8px",
        border: isHovered ? "2px solid green" : "1px solid #ccc",
        borderRadius: "4px",
        margin: "4px",
        display: "inline-block",
        cursor: "grab",
      }}
    >
      {label}
    </div>
  );
}
