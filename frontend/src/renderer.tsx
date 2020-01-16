import electron from "electron";
import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Plot } from "./components/Plot";
import { PredictResult } from "./core/types";

const App: React.FC = () => {
  const [files, setFiles] = useState<PredictResult[]>([]);

  const addFolder = async (): Promise<void> => {
    const result = await electron.ipcRenderer.invoke("open-folder");
    setFiles(files => [...files, ...result]);
  };

  return (
    <div>
      <Plot files={files} width={600} height={600} />
      <button onClick={addFolder}>Load Folder</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
