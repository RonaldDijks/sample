/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";

interface VizualiserProps {
  width: number;
  height: number;
  name: string;
  data?: Float32Array;
}

export const Vizualiser: React.FC<VizualiserProps> = ({
  width,
  height,
  name,
  data
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
  }, [name]);

  return (
    <div style={{ border: "2px solid pink" }}>
      <canvas width={width} height={height} ref={ref} />
    </div>
  );
};
