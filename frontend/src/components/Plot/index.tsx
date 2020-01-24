/* eslint-disable react/prop-types */
import React from "react";
import { PredictResult } from "../../core/types";
import { Node } from "./Node";

export interface PlotProps {
  files: PredictResult[];
  labels: string[];
  width: number;
  height: number;
  nodeSize: number;
  getLabelColor: (label: string) => string;
  onHover: (id?: string) => void;
}

const getClass = (file: PredictResult): string =>
  Object.entries(file.classes).reduce((s, x) => (s[1] > x[1] ? s : x))[0];

export const Plot: React.FC<PlotProps> = ({
  width,
  height,
  files,
  onHover,
  getLabelColor
}) => {
  const scaled = files.map(file => ({
    ...file,
    position: {
      frequency: Math.log10(file.position.frequency),
      length: Math.log10(file.position.length * 1000)
    }
  }));

  console.log(scaled);

  const maxPos = {
    x: scaled
      .map(x => x.position.frequency)
      .reduce((s, x) => (s > x ? s : x), Number.NEGATIVE_INFINITY),
    y: scaled
      .map(x => x.position.length)
      .reduce((s, x) => (s > x ? s : x), Number.NEGATIVE_INFINITY)
  };
  return (
    <div style={{ width, height, border: "1px solid black" }}>
      {scaled.map(file => (
        <Node
          id={file.file_path}
          key={file.file_path}
          size={20}
          color={getLabelColor(getClass(file))}
          position={{
            x: (file.position.frequency / maxPos.x) * width,
            y: (file.position.length / maxPos.y) * height
          }}
          onHover={onHover}
        />
      ))}
    </div>
  );
};
