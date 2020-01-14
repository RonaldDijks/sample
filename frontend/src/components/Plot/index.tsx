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

export interface PlotProps {
  files: PredictResult[];
  width: number;
  height: number;
}

const getComponents = (labels: string[]): LabelDataPoint[] => {
  const offset = (Math.PI * 2) / labels.length;
  const radius = 0.9;
  const center: Vector2 = { x: 0, y: 0 };
  const label_coordinates: LabelDataPoint[] = [];

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const angle = i * offset;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    label_coordinates.push({
      coordinate: { x, y },
      name: label
    });
  }

  return label_coordinates;
};

interface Drawable {
  name: string;
  position: Vector2;
  radius: number;
}

const componentsToDrawable = (center: Vector2, label: LabelDataPoint) => {
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
  label_components: LabelDataPoint[],
  predict: PredictResult
) => {
  const predictClassesArray = Object.entries(predict.classes);

  const location: Vector2 = { x: 0, y: 0 };

  for (let i = 0; i < label_components.length; i++) {
    const label = label_components[i];
    const [_, sameness] = predictClassesArray.find(
      ([l, _]) => label.name === l
    )!;
    location.x += label.coordinate.x * sameness;
    location.y += label.coordinate.y * sameness;
  }

  return {
    name: predict.file_path,
    coordinate: location
  };
};

export const draw_point = (ctx: CanvasRenderingContext2D, color: string) => (
  point: Drawable
) => {
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

const getMousePosition = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const isIntersect = (drawable: Drawable, mouse: Vector2) => {
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
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    (async () => {
      const canvas_center = { x: width / 2, y: height / 2 };
      const labels = await getLabels();
      const components = getComponents(labels);

      const label_drawables = components.map(l =>
        componentsToDrawable(canvas_center, l)
      );

      console.log(files);

      const prediction_drawables = files
        .map(prediction => predictionsToComponents(components, prediction))
        .map(label => componentsToDrawable(canvas_center, label));

      label_drawables.forEach(draw_point(ctx, "#FF0000"));
      prediction_drawables.forEach(draw_point(ctx, "#00FF00"));

      canvas.addEventListener("mousemove", event => {
        const mousePosition = getMousePosition(canvas, event);
        const hit = prediction_drawables
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
