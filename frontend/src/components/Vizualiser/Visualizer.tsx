import React, { useRef, useEffect } from "react";

interface VizualiserProps {
  data?: number[];
}

export const Vizualiser: React.FC<VizualiserProps> = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
  });

  return <canvas ref={ref} />;
};
