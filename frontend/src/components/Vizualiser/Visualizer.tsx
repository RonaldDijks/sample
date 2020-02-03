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
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    if (data) {
      const dx = width / data.length;
      for (let i = 0; i < data.length; i++) {
        const sample = data[i];
        ctx.lineTo(i * dx, height * ((sample + 1) / 2));
      }
    }
    ctx.stroke();
    ctx.closePath();
  }, [name]);

  return (
    <div>
      <canvas width={width} height={height} ref={ref} />
    </div>
  );
};
