import { spawn } from "child_process";
import split from "split2";

export const getLabels = () =>
  new Promise<string[]>((resolve, reject) => {
    const process = spawn("python", ["..\\app\\backend\\main.py", "labels"]);

    process.stdout.pipe(split(JSON.parse)).on("data", data => {
      resolve(data);
    });
  });


interface PredictResult {
    file_name: string,
    classes: {
        [label: string]: number
    }
}


// const result = spawn("python", [
//     "..\\app\\backend\\main.py",
//     "predict",
//     "..\\app\\backend\\snare.wav"
//   ]);

export const predict = (filepath: string = "..\\app\\backend\\snare.wav") => 
  new Promise<PredictResult>((resolve, reject) => {
    const process = spawn("python", [
        "..\\app\\backend\\main.py",
        "predict",
        filepath
      ]);
    
      process.stdout.pipe(split(JSON.parse)).on('data', data => {
          resolve(data)
      })
  })