/* eslint-disable react/prop-types */
import React from "react";
import { Sample } from "src/core/types";
import * as path from "path";

export interface InfoProps {
  selected?: Sample & { duration: number };
}

export const Info: React.FC<InfoProps> = props => {
  if (!props.selected) return null;
  const basename = path.basename(props.selected.filePath);
  const label = props.selected.label;
  return (
    <div style={{ color: "white" }}>
      <table>
        <tr>
          <td>Filename:</td>
          <td>{basename}</td>
        </tr>
        <tr>
          <td>Label:</td>
          <td style={{ background: label.color, color: "black" }}>
            {label.name}
          </td>
        </tr>
        <tr>
          <td>Length:</td>
          <td>{props.selected.duration.toFixed(2)} seconds</td>
        </tr>
      </table>
    </div>
  );
};

Info.displayName = "Info";
