
(function(){ 'use strict';

var svg = d3.select('#area1'),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom,
    height2 = +svg.attr('height') - margin2.top - margin2.bottom;


var parseDate = d3.timeParse('%b %Y');

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

svg.append('defs').append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height);

var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

d3.csv('assets/data/sp500.csv', type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area);

  focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

  context.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area2);

  context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2);

  context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range());

  svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select('.area').attr('d', area);
  focus.select('.axis--x').call(xAxis);
  svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select('.area').attr('d', area);
  focus.select('.axis--x').call(xAxis);
  context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}

/////////////////////// SPARKLINES //////////////////////

/* http://codepen.io/mginnard/pen/mkBEg?editors=1010 */

function displaySparkLines(id, width, height, interpolation, animate, updateDelay, transitionDelay) {
  // create an SVG element inside the #graph div that fills 100% of the div
  var graph = d3.select(id).append("svg:svg").attr("width", "100%").attr("height", "100%");

  // create simple data arrays that we'll plot with a line (this array represents only the Y values, X will just be the index location)
  var dataOne = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 9];
  var dataTwo = [33, 76, 67, 74, 32, 82, 62, 1, 78, 4, 13, 88, 61, 26, 58, 42, 79, 69, 3, 19, 10, 91, 94, 20, 27, 8, 51, 87, 85, 65, 17, 77, 35, 37, 93, 36, 60, 63, 39, 73, 43, 75, 9, 66, 25, 49, 97, 90, 47, 70, 18, 41, 50, 34, 53, 23, 30, 92, 14, 84, 16, 95, 28, 31, 96, 68, 80, 21, 72, 99, 15, 83, 6, 64, 59, 54, 86, 12, 55, 71, 7, 22, 52, 24, 5, 29, 56, 2, 100, 98, 48, 11, 40, 57, 45, 81, 89, 38, 46, 44];
  var dataSet = [dataOne, dataTwo];
  // var dataRandom = d3.range(50).map(function(){return Math.random()*10});

  // X scale will fit values from 0-10 within pixels 0-100
  var x = d3.scaleLinear().domain([0, 48]).range([-5, width]); // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
  // Y scale will fit values from 0-10 within pixels 0-100
  var y = d3.scaleLinear().domain([0, 10]).range([0, height]);

  // create a line object that represents the SVG line we're creating
  var line = d3.line()
    // assign the X function to plot our line as we wish
    .x(function(d, i) {
      // verbose logging to show what's actually being done
      // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      // return the X coordinate where we want to plot this datapoint
      return x(i);
    })
    .y(function(d) {
      // verbose logging to show what's actually being done
      //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
      // return the Y coordinate where we want to plot this datapoint
      return y(d);
    })
  if (interpolation === "basis") {
    line.curve(d3.curveCatmullRom.alpha(0.5))
  }

  // display the line by appending an svg:path element with the data line we created above
  graph.append("svg:path").attr("d", line(dataSet[0]));

  // or it can be done like this
  //graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);

  function redrawWithAnimation() {
    // update with animation
    graph.selectAll("path")
      .attr("transform", "translate(" + x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
      .data([dataSet[0]]) // set the new data
      .attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
      .transition() // start a transition to bring the new value into view
      .ease(d3.easeLinear)
      .duration(transitionDelay*0.95) // for this demo we want a continual slide so set this to the same as the setInterval amount below
      .attr("transform", "translate(" + x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value

    /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
  }

  // Fallback if redrawWithAnimation doesn't work

	  function redrawWithoutAnimation() {
	    // static update without animation
	    graph.selectAll("path")
	      .data([dataSet[0]]) // set the new data
	      .attr("d", line); // apply the new data values
	  }


  setInterval(function() {
    var v = dataSet[0].shift(); // remove the first element of the array
    dataSet[0].push(v); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
    if (animate) {
      redrawWithAnimation();
    } else {
      redrawWithoutAnimation();
    }
  }, updateDelay);

}



displaySparkLines("#graph1", 2000, 80, "basis", true, 1000, 1000);
displaySparkLines("#graph2", 2000, 80, "basis", true, 1000, 1000);


})();
