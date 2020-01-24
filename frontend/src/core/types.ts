export interface PredictResult {
  file_path: string;
  classes: {
    [label: string]: number;
  };
  position: {
    frequency: number;
    length: number;
  };
}

export interface Vector2 {
  x: number;
  y: number;
}
