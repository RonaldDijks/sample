/* eslint-disable react/prop-types */
import React from "react";
import { Vector2 } from "src/core/types";

interface NodeProps {
  position: Vector2;
  id: string;
  size: number;
  color: string;
  onHover: (id?: string) => void;
}

export const Node: React.FC<NodeProps> = ({
  id,
  position,
  size,
  color,
  onHover
}) => {
  const onMouseEnter = (): void => onHover(id);
  const onMouseLeave = (): void => onHover(undefined);

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size}px`,
        border: "2px black solid",
        background: color
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  );
};

Node.displayName = "Node";
