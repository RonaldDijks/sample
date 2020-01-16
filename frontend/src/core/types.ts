export interface PredictResult {
  filePath: string;
  classes: {
    [label: string]: number;
  };
}
