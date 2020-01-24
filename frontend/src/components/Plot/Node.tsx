/* eslint-disable react/prop-types */
import React from "react";
import { Vector2 } from "src/core/types";

interface NodeProps {
  position: Vector2;
  id: string;
  size: number;
  onHover: (id?: string) => void;
}

export const Node: React.FC<NodeProps> = ({ id, position, size, onHover }) => {
  const onMouseEnter = (): void => onHover(id);
  const onMouseLeave = (): void => onHover(undefined);

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.y,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 2}px`,
        background: "red"
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  );
};
