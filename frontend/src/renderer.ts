import Plotly from "plotly.js";

const myPlot = document.getElementById("myPlot");
const hoverButton = document.getElementById("hoverbutton");
const d3 = Plotly.d3;
const N = 16;
const x = d3.range(N);
const y1 = d3.range(N).map(d3.random.normal());
const y2 = d3.range(N).map(d3.random.normal());

Plotly.plot(
  "myPlot",
  [
    {
      x: x,
      y: y1,
      type: "scatter",
      name: "Trial 1",
      mode: "markers",
      marker: { size: 16 }
    },
    {
      x: x,
      y: y2,
      type: "scatter",
      name: "Trial 2",
      mode: "markers",
      marker: { size: 16 }
    }
  ],
  {
    hovermode: "closest",
    title: 'Click "Go" button to trigger hover'
  }
);

(myPlot as any).on("plotly_beforehover", function() {
  return false;
});
