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
  margin: number;
  onHover: (id?: string) => void;
}

const scale = (
  domainStart: number,
  domainStop: number,
  rangeStart: number,
  rangeStop: number,
  value: number
): number => {
  return (
    rangeStart +
    (rangeStop - rangeStart) *
      ((value - domainStart) / (domainStop - domainStart))
  );
};

export const Plot: React.FC<PlotProps> = ({
  width,
  height,
  margin,
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

  const min = {
    x: scaled
      .map(x => x.position.frequency)
      .reduce((s, x) => (s < x ? s : x), Number.POSITIVE_INFINITY),
    y: scaled
      .map(x => x.position.length)
      .reduce((s, x) => (s < x ? s : x), Number.POSITIVE_INFINITY)
  };

  const max = {
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
            x: scale(
              min.x,
              max.x,
              0 + margin,
              width - nodeSize - margin,
              sample.position.frequency
            ),
            y: scale(
              min.y,
              max.y,
              0 + margin,
              height - nodeSize - margin,
              sample.position.length
            )
          }}
          onHover={onHover}
        />
      ))}
    </div>
  );
};
