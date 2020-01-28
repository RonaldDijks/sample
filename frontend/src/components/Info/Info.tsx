/* eslint-disable react/prop-types */
import React from "react";
import { Sample } from "src/core/types";
import * as path from "path";

export interface InfoProps {
  selected?: Sample;
}

export const Info: React.FC<InfoProps> = props => {
  if (!props.selected) return null;
  const basename = path.basename(props.selected.filePath);
  const label = props.selected.label;
  return (
    <table>
      <tr>
        <td>filename</td>
        <td>{basename}</td>
      </tr>
      <tr>
        <td>label</td>
        <td style={{ background: label.color }}>{label.name}</td>
      </tr>
    </table>
  );
};

Info.displayName = "Info";
