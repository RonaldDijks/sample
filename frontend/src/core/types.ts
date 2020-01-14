export interface PredictResult {
  file_path: string;
  classes: {
    [label: string]: number;
  };
}
