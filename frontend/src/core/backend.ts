import { spawn } from "child_process";
import split from "split2";
import * as path from "path";

import { PredictResult } from "./types";

const backend_folder = path.join("..", "app", "backend");
const backend_root = path.join(backend_folder, "main.py");

export const getLabels = () =>
  new Promise<string[]>((resolve, reject) => {
    const process = spawn("python", [backend_root, "labels"]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
  });

export const predict = (
  filepath: string = path.join(backend_folder, "kick.wav")
) =>
  new Promise<PredictResult>((resolve, reject) => {
    const process = spawn("python", [backend_root, "predict", filepath]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
  });

export const predict_folder = (folder: string = backend_folder) =>
  new Promise<PredictResult[]>((resolve, reject) => {
    const process = spawn("python", [backend_root, "predict_folder", folder]);
    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
  });
