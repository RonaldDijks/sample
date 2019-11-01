import { spawn } from "child_process";
import split from "split2";

const result = spawn("bash", ["./bla.sh"]);

result.stdout.pipe(split(JSON.parse)).on("data", data => {
  console.log(data);
});
