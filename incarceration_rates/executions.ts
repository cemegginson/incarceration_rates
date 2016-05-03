"use strict";

import * as d3 from 'd3';
import * as _ from 'lodash';

// We'll make this global since it should be useful.
let years = _.range(1977, 2015);

function GenerateGraph(title:string, data_row, iter:number) {
    // define dimensions of graph
    let margins:number[] = [80, 80, 80, 80];
    let width:number = 1000 - margins[1] - margins[3];
    let height:number = 400 - margins[0] - margins[2];

    // Scale functions for x and y values
    let x = d3.scale.linear().domain([0, 38]).range([0, height]);

    let y_max:any = _.max(data_row);
    if (y_max < 30) {
        y_max = 30;
    }
    let y = d3.scale.linear().domain([0, y_max]).range([height, 0]);

    // automatically determining max range can work something like this
    // let y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
    // create a line function that can convert data[] into x and y points
    let line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    // Add an SVG element with the desired dimensions and margin.
    let div_element = "#graph_" + iter;
    let graph = d3.select(div_element).append("svg:svg")
          .attr("width", width + margins[1] + margins[3])
          .attr("height", height + margins[0] + margins[2])
        .append("svg:g")
          .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");

    // create x axis
    let xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(-height)
    .tickValues([1977, 1982, 1987, 1992, 1997, 2002, 2007, 2012]);

    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    // create left y axis
    let yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);

    // resort data_row
    let data_row_temp = [];
    for (let i = 0; i < data_row.length; i++) {
      data_row_temp.push([i+1, data_row[i]]);
    }
    data_row = data_row_temp;

    // Add the line by appending an svg:path element with the data line
    // we created above do this AFTER the axes above so that the line is
    // above the tick-lines
    graph.append("svg:path").data(data_row).attr("d", line(data_row));

    // Add the jurisdiciton
    graph.append("svg:text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margins[1] / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text(title);
    console.log(title)
}

let current_graph:number = 1;
d3.csv("data/cp_executed.csv", function(data){
for (let i in data) {
    let actual_data:number[] = [];
    let data_row = data[i];
    for (let j of years) {
        actual_data.push(+data_row[j]);
    }
    console.log(data[i])
    GenerateGraph(data[i]["Jurisdiction"], actual_data, current_graph);
    current_graph++;
}
});
