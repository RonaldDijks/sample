export interface PredictResult {
  file_name: string;
  classes: {
    [label: string]: number;
  };
}
