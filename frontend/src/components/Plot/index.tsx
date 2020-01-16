/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import { PredictResult } from "../../core/types";
import { getLabels } from "../../core/backend";

interface Vector2 {
  x: number;
  y: number;
}

interface LabelDataPoint {
  coordinate: Vector2;
  name: string;
}

interface Drawable {
  name: string;
  position: Vector2;
  radius: number;
}

export interface PlotProps {
  files: PredictResult[];
  width: number;
  height: number;
}

const getComponents = (labels: string[]): LabelDataPoint[] => {
  const offset = (Math.PI * 2) / labels.length;
  const radius = 0.9;
  const center: Vector2 = { x: 0, y: 0 };
  const labelCoordinates: LabelDataPoint[] = [];

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const angle = i * offset;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    labelCoordinates.push({
      coordinate: { x, y },
      name: label
    });
  }

  return labelCoordinates;
};

const componentsToDrawable = (
  center: Vector2,
  label: LabelDataPoint
): Drawable => {
  const dimensions = { x: 10, y: 10 };

  const x = center.x + label.coordinate.x * center.x - dimensions.x / 2;
  const y = center.y + label.coordinate.y * center.y - dimensions.y / 2;

  return {
    name: label.name,
    position: { x, y },
    radius: 10
  };
};

const predictionsToComponents = (
  labelComponents: LabelDataPoint[],
  predict: PredictResult
): LabelDataPoint => {
  const predictClassesArray = Object.entries(predict.classes);

  const location: Vector2 = { x: 0, y: 0 };

  for (let i = 0; i < labelComponents.length; i++) {
    const label = labelComponents[i];
    const result = predictClassesArray.find(([l]) => label.name === l);
    if (!result) {
      throw new Error(`Could not find a sameness for ${label}.`);
    }
    const sameness = result[1];
    location.x += label.coordinate.x * sameness;
    location.y += label.coordinate.y * sameness;
  }

  return {
    name: predict.filePath,
    coordinate: location
  };
};

export const drawPoint = (ctx: CanvasRenderingContext2D, color: string) => (
  point: Drawable
): void => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(
    point.position.x,
    point.position.y,
    point.radius,
    point.radius,
    0,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();
};

const getMousePosition = (
  canvas: HTMLCanvasElement,
  event: MouseEvent
): Vector2 => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const isIntersect = (drawable: Drawable, mouse: Vector2): boolean => {
  return (
    Math.sqrt(
      (mouse.x - drawable.position.x) ** 2 +
        (mouse.y - drawable.position.y) ** 2
    ) < drawable.radius
  );
};

export const Plot: React.FC<PlotProps> = ({ files, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Could not get context.");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas.");
    }
    (async (): Promise<void> => {
      const canvasCenter = { x: width / 2, y: height / 2 };
      const labels = await getLabels();
      const components = getComponents(labels);

      const labelDrawables = components.map(l =>
        componentsToDrawable(canvasCenter, l)
      );

      console.log(files);

      const predictionDrawables = files
        .map(prediction => predictionsToComponents(components, prediction))
        .map(label => componentsToDrawable(canvasCenter, label));

      labelDrawables.forEach(drawPoint(ctx, "#FF0000"));
      predictionDrawables.forEach(drawPoint(ctx, "#00FF00"));

      canvas.addEventListener("mousemove", event => {
        const mousePosition = getMousePosition(canvas, event);
        const hit = predictionDrawables
          .filter(drawable => isIntersect(drawable, mousePosition))
          .pop();
        if (hit) {
          console.log(`Found hit: ${hit.name}`);
        }
      });
    })();
  }, [files]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
