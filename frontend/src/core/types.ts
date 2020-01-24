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

export interface Label {
  name: string;
  color: string;
}

export interface Sample {
  filePath: string;
  label: Label;
  position: {
    frequency: number;
    length: number;
  };
}

export interface Vector2 {
  x: number;
  y: number;
}
