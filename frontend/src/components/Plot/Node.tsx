/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import React from "react";
import { Vector2 } from "src/core/types";

interface NodeProps {
  position: Vector2;
  id: string;
  onHover: (id?: string) => void;
}

export const Node: React.FC<NodeProps> = ({ id, position, onHover }) => {
  const size = 20;

  const onMouseEnter = (_: any) => onHover(id);
  const onMouseLeave = (_: any) => onHover(undefined);

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
