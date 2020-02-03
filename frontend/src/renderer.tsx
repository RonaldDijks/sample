import electron from "electron";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { Plot } from "./components/Plot/Plot";
import { Label, Sample, PredictResult } from "./core/types";
import { getLabels } from "./core/backend";
import palette from "./core/palette";
import { Info } from "./components/Info";
import { useWindowDimensions } from "./core/hooks/useWindowDimensions";

type LabelState = { type: "loading" } | { type: "loaded"; labels: Label[] };

const audioContext = new AudioContext();

const App: React.FC = () => {
  const [files, setFiles] = useState<Sample[]>([]);
  const [labels, setLabels] = useState<LabelState>({ type: "loading" });
  const [hover, setHover] = useState<Sample | undefined>(undefined);
  const { width, height } = useWindowDimensions();
  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode>();

  useEffect(() => {
    getLabels()
      .then(labels => {
        return labels.map(
          (name, i): Label => {
            return {
              name,
              color: palette[i]
            };
          }
        );
      })
      .then(labels => setLabels({ type: "loaded", labels }));
  }, []);

  const addFolder = async (): Promise<void> => {
    const result: PredictResult[] = await electron.ipcRenderer.invoke(
      "open-folder"
    );
    const samples: Sample[] = result.map(x => {
      if (labels.type === "loading") throw new Error("Labels not yet loaded.");
      const labelClass = Object.entries(x.classes).reduce((s, x) =>
        s[1] > x[1] ? s : x
      )[0];
      const label = labels.labels.find(label => label.name == labelClass);
      if (!label) throw new Error(`Cannot find label: ${labelClass}`);
      return {
        filePath: x.file_path,
        label,
        position: x.position
      };
    });
    setFiles(files => [...files, ...samples]);
  };

  const onHover = (id?: string): void => {
    if (id) {
      const sample = files.find(f => f.filePath === id);

      window
        .fetch(id)
        .then(res => res.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(buffer => {
          if (currentSource) {
            currentSource.stop();
          }

          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start();
          setCurrentSource(source);
        });

      setHover(() => sample);
    } else {
      setHover(() => undefined);
    }
  };

  if (labels.type === "loading") {
    return <div>Loading</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap"
      }}
    >
      <div style={{ flex: 1, width: "200px" }}>
        <button onClick={addFolder}>Load Folder</button>
      </div>
      <div style={{ flex: 1 }}>
        <Plot
          files={files}
          labels={labels.labels}
          nodeSize={20}
          width={width - 2 - 200}
          height={height - 200 - 2}
          margin={50}
          onHover={onHover}
          x={200}
        />
        <Info selected={hover} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
