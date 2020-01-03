import * as d3 from "d3";

import electron from 'electron'
import { spawn } from "child_process";
import split from "split2";
import { getLabels, predict } from './core/backend'

interface Vector2 {
  x: number;
  y: number;
}

const openFolderButton = document.getElementById('open-folder')! as HTMLButtonElement

openFolderButton.onclick = async () => {
  const files = await electron.ipcRenderer.invoke('open-folder')
}


const main = async () => {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 700 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#myPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Read the data

  // Add X axis
  const x = d3
    .scaleLinear()
    .domain([-1, 1])
    .range([0, width]);
    
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([-1, 1])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  const tooltip = d3
    .select("#myPlot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  const mouseover: d3.ValueFn<SVGCircleElement, any, void> = function(d: any) {
    tooltip.style("opacity", 1);

    const context = new AudioContext();

    window
      .fetch(d.file_path)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start();
      });
  };

  interface Node {
    file_path: string;
    classes: {
      [key: string]: number;
    };
  }

  const mousemove: d3.ValueFn<SVGCircleElement, any, void> = function(d: any) {
    tooltip
      .html(d.summary)
      .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d3.mouse(this)[1] + "px");
  };

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  const mouseleave: d3.ValueFn<SVGCircleElement, any, void> = function(d: any) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0);
  };

  const labels = await getLabels()

  interface LabelDataPoint {
    coordinate: Vector2;
    name: string;
  }

  const offset = Math.PI * 2 / labels.length;
  const radius = 1.0;
  const center: Vector2 = {x: 0, y: 0}
  const label_coordinates: LabelDataPoint[] = [];
  
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const angle = i * offset;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    label_coordinates.push({
      coordinate: {x, y},
      name: label
    })
  }

  console.log(label_coordinates)

  const div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

  svg
    .selectAll('.label.dot')
    .data(label_coordinates)
    .enter()
    .append('circle')
    .attr("class", "label dot")
    .attr('cx', data => x(data.coordinate.x))
    .attr('cy', data => y(data.coordinate.y))
    .attr('r', 7)
    .style("fill", "#34eb3d")
    .style("stroke", "white")
    .on("mouseover", function(d) {		
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(d.name)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
  .on("mouseout", function(d) {		
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
  });


  const predictResult = await predict();
  const predictClassesArray = Object.entries(predictResult.classes);

  const location: Vector2 = { x: 0, y: 0 }

  for (let i = 0; i < label_coordinates.length; i++) {
    const label = label_coordinates[i];
    const [_, sameness] = predictClassesArray.find(([l, _]) => label.name === l)!
    location.x += label.coordinate.x * sameness;
    location.y += label.coordinate.y * sameness;
  }

  console.log(location)

    svg
      .append("g")
      .selectAll("dot")
      //.data(data.filter(function(d: any, i: any){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
      .data([{
        file_name: predictResult.file_name,
        location: location,
        // summary: labelsArray.map(([label, sameness]) => `${label}: ${sameness}`).join("\n")
      }])
      .enter()
      .append("circle")
      .attr("cx", d => x(d.location.x))
      .attr("cy", d => y(d.location.y))
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .style("opacity", 0.3)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

  

  // const result = spawn("python", [
  //   "..\\app\\backend\\main.py",
  //   "predict",
  //   "..\\app\\backend\\snare.wav"
  // ]);

  // result.stdout.pipe(split(JSON.parse)).on("data", data => {
  //   svg
  //     .append("g")
  //     .selectAll("dot")
  //     //.data(data.filter(function(d: any, i: any){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
  //     .data([data])
  //     .enter()
  //     .append("circle")
  //     .attr("cx", function(d: any) {
  //       return x(0.7);
  //     })
  //     .attr("cy", function(d: any) {
  //       return y(d.classes.Snare);
  //     })
  //     .attr("r", 7)
  //     .style("fill", "#69b3a2")
  //     .style("opacity", 0.3)
  //     .style("stroke", "white")
  //     .on("mouseover", mouseover)
  //     .on("mousemove", mousemove)
  //     .on("mouseleave", mouseleave);
  // });
};

main()