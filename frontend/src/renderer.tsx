import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import electron from "electron";

import { Plot } from "./components/Plot";
import { PredictResult } from "./core/types";
import { predict } from "./core/backend";

const App = () => {
  const [files, setFiles] = useState<PredictResult[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const prediction = await predict();
      setFiles(files => [...files, prediction]);
    };
    initialize();
  });

  const addFolder = async () => {
    const result = await electron.ipcRenderer.invoke("open-folder");
    setFiles(files => [...files, result]);
  };

  return (
    <div>
      <Plot files={files} />
      <button onClick={addFolder}>Load Folder</button>
    </div>
  );
};
// result
ReactDOM.render(<App />, document.getElementById("root"));
