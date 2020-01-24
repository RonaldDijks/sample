import electron from "electron";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { Plot } from "./components/Plot";
import { PredictResult } from "./core/types";
import { getLabels } from "./core/backend";
import palette from "./core/palette";

const App: React.FC = () => {
  const [files, setFiles] = useState<PredictResult[]>([]);
  const [hover, setHover] = useState<string | undefined>(undefined);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    getLabels().then(setLabels);
  }, []);

  const onHover = (id?: string): void => {
    setHover(() => id);
  };

  const addFolder = async (): Promise<void> => {
    const result = await electron.ipcRenderer.invoke("open-folder");
    setFiles(files => [...files, ...result]);
  };

  const getLabelColor = (label: string): string => {
    return palette[labels.indexOf(label)];
  };

  return (
    <div>
      <Plot
        files={files}
        labels={labels}
        nodeSize={20}
        width={600}
        height={600}
        onHover={onHover}
        getLabelColor={getLabelColor}
      />
      <button onClick={addFolder}>Load Folder</button>
      {hover}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
