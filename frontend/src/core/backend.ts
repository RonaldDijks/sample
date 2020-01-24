import { spawn } from "child_process";
import * as path from "path";
import split from "split2";

import { PredictResult } from "./types";

const backendFolder = path.join("..", "app", "backend");
const backendRoot = path.join(backendFolder, "main.py");

export const getLabels = (): Promise<string[]> =>
  new Promise<string[]>(resolve => {
    const process = spawn("python", [backendRoot, "labels"]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
    process.stderr.on("data", console.error);
  });

export const predict = (
  filepath: string = path.join(backendFolder, "kick.wav")
): Promise<PredictResult> =>
  new Promise<PredictResult>(resolve => {
    const process = spawn("python", [backendRoot, "predict", filepath]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
    process.stderr.on("data", console.error);
  });

export const predictFolder = (
  folder: string = backendFolder
): Promise<PredictResult[]> =>
  new Promise<PredictResult[]>(resolve => {
    const process = spawn("python", [backendRoot, "predict_folder", folder]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
    process.stderr.on("data", console.error);
  });
