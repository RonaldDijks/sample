/* eslint-disable react/prop-types */
import React from "react";
import { Sample, Label } from "../../core/types";
import { Node } from "./Node";

export interface PlotProps {
  files: Sample[];
  labels: Label[];
  width: number;
  height: number;
  nodeSize: number;
  onHover: (id?: string) => void;
}

export const Plot: React.FC<PlotProps> = ({
  width,
  height,
  files,
  onHover,
  nodeSize
}) => {
  const scaled = files.map(file => ({
    ...file,
    position: {
      frequency: Math.log10(file.position.frequency),
      length: Math.log10(file.position.length * 1000)
    }
  }));

  const maxPos = {
    x: scaled
      .map(x => x.position.frequency)
      .reduce((s, x) => (s > x ? s : x), Number.NEGATIVE_INFINITY),
    y: scaled
      .map(x => x.position.length)
      .reduce((s, x) => (s > x ? s : x), Number.NEGATIVE_INFINITY)
  };

  return (
    <div
      style={{
        width,
        height,
        border: `1px solid black`
      }}
    >
      {scaled.map(sample => (
        <Node
          id={sample.filePath}
          key={sample.filePath}
          size={nodeSize}
          color={sample.label.color}
          position={{
            x: (sample.position.frequency / maxPos.x) * (width - nodeSize),
            y: (sample.position.length / maxPos.y) * (height - nodeSize)
          }}
          onHover={onHover}
        />
      ))}
    </div>
  );
};
