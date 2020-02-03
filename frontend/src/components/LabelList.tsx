/* eslint-disable react/prop-types */
import React from "react";
import { Label } from "src/core/types";

interface LabelListEntryProps {
  label: Label;
}

const LabelListEntry: React.FC<LabelListEntryProps> = ({
  label: { name, color }
}) => {
  return (
    <div
      style={{
        margin: "15px",
        paddingTop: "5px",
        paddingBottom: "5px",
        color: "black",
        background: color,
        border: `2px solid ${color}`
      }}
    >
      {name}
    </div>
  );
};

export interface LabelListProps {
  labels: Label[];
}

export const LabelList: React.FC<LabelListProps> = ({ labels }) => {
  return (
    <div>
      {labels.map(label => (
        <LabelListEntry key={label.name} label={label} />
      ))}
    </div>
  );
};
