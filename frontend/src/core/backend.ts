import { spawn } from "child_process";
import split from "split2";

export const getLabels = () =>
  new Promise<string[]>((resolve, reject) => {
    const p = spawn("python", ["..\\app\\backend\\main.py", "labels"]);

    p.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
  });
