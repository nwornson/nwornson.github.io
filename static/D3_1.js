// creates circles that transition, fit line using data saved from fitting  a loess spline in R.

//  Currently lines do not transition, the previous one is removed and the new one is rendered.


// prev svgWidth 960
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg1 = d3
  .select("#chart1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg1.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYaxis = "m";
var chosenLine = 'mfit';


// function used for updating y-scale var upon click on axis label
function yScale(nnData, chosenYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(nnData, d => d[chosenYaxis]) * 1.2,
      d3.min(nnData, d => d[chosenYaxis]) * .8
    ])
    .range([0,height]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYaxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip

/* 
long form comment
*/

function updateToolTip(chosenYaxis, circlesGroup) {

   var label;

   if (chosenYaxis === "m") {
     label = "Mean Acc:";

   }
   else {
     label = "Standard Error:";
   }

   var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.samplesize}<br>${label} ${d[chosenYaxis]}<br>Model:${d['model']}`);

 
     });

   circlesGroup.call(toolTip);

   circlesGroup.on("mouseover", function(data) {
     toolTip.show(data);
   })
     // onmouseout event
     .on("mouseout", function(data, index) {
       toolTip.hide(data);
     });

   return circlesGroup;
 } 

// Retrieve data from the CSV file and execute everything below
d3.csv("static/ciphar_data_spread_100320.csv").then(function(nnData, err) {
  if (err) throw err;

  // parse data
  nnData.forEach(function(data) {
    data.samplesize = +data.samplesize;
    data.m = +data.m;
    data.s = +data.s;
    data.mfit = +data.mfit;
    data.sfit = +data.sfit;
  });

  // grouped data
  var gdata = d3.nest()
  .key(function(d) { return d.model})
  .entries(nnData)

  // xLinearScale function above csv import
  var yLinearScale = yScale(nnData, chosenYaxis);

  // Create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(nnData, d => d.samplesize)])
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(nnData)
    .enter() 
    .append("circle")
    .attr("cx", d => xLinearScale(d.samplesize))
    .attr("cy", d => yLinearScale(d[chosenYaxis]))
    .attr("r", 5)
    .attr("fill", function(d,i) {
      return d['color']
    })
    .attr("opacity", ".5");
  

    // Create group for two y-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height/2})`);

  var mean_acc = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - margin.top)
    .attr("y", 0 - 40)
    .attr("value", "m") // value to grab for event listener
    .classed("active", true)
    .text("Mean Accuracy");

  var se_acc = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - margin.top)
    .attr("y", 0 - 60)
    .attr("value", "s") // value to grab for event listener
    .classed("inactive", true)
    .text("Standard Error");

  // append x axis
  chartGroup.append("text")
 
    .attr("y", height + 40)
    .attr("x", width/2)
    .attr("dx", "1em")
    .classed("axis-text", true)
    .text("Sample Size");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYaxis, circlesGroup);

  
 // legend

 var res = gdata.map(function(d){ return d.key })

 var color = d3.scaleOrdinal()
 .domain(res)
 .range(['#F0CD0A','#8CDA11','#F26B59'])
var legendRectSize = 18;                                 
var legendSpacing = 4;                                   

var legend = chartGroup.selectAll('.legend')                     
.data(color.domain())                                   
.enter()                                                
.append('g')                                            
.attr('class', 'legend')                                
.attr('transform', function(d, i) {                     
  var height = legendRectSize + legendSpacing;          
  var offset =  height * color.domain().length / 2;     
  var horz = 2 * legendRectSize;                       
  var vert = i * height;                       
  return 'translate(' + horz + ',' + vert + ')';        
});                                                     

legend.append('rect')                                   
.attr('width', legendRectSize)                          
.attr('height', legendRectSize)                         
.style('fill', color)                                   
.style('stroke', color);                                

legend.append('text')                                   
.attr('x', legendRectSize + legendSpacing)              
.attr('y', legendRectSize - legendSpacing)              
.text(function(d) { return d; }); 



  // line

  var curve1 = d3.line()
    .x(d => xLinearScale(d.samplesize))
    .y(d => yLinearScale(d[chosenLine]))
    .curve(d3.curveBasisOpen);


  gdata.forEach(function(d,i) {
    var pathData = curve1(d.values);
    chartGroup.append('path')
      .attr('d',pathData)
      .classed('line',true)

    //console.log(d.values[0]['color'])
    
      .attr("stroke", function(d,j) {
        return  color(i);

      });

    
      

  })

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var fitted;
      var value = d3.select(this).attr("value");
      //console.log(value);
      if (value !== chosenYaxis) {

        // replaces chosenYaxis with value
        chosenYaxis = value;
        
        if (chosenYaxis == 'm') {
          chosenLine = 'mfit';
        } else {
          chosenLine = 'sfit';
        }
       

        // console.log(chosenYaxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(nnData, chosenYaxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYaxis);
        
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYaxis, circlesGroup);


        // changes classes to change bold text
        if (chosenYaxis === "m") {
            mean_acc
            .classed("active", true)
            .classed("inactive", false);
            se_acc
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            mean_acc
            .classed("active", false)
            .classed("inactive", true);
            se_acc
            .classed("active", true)
            .classed("inactive", false);
        }
          // line
          
          d3.selectAll("path.line").remove();

          

        // line
        var curve1 = d3.line()
          .x(d => xLinearScale(d.samplesize))
          .y(d => yLinearScale(d[chosenLine]))
          .curve(d3.curveBasisOpen);

        gdata.forEach(function(d,i) {
        var pathData = curve1(d.values);
        chartGroup.append('path')
          .attr('d',pathData)
          .classed('line',true)
          .attr("stroke", function(d,j) {
            return  color(i);
    
          });

        })
        //   var curve1 = d3.line()
        //   .x(d => xLinearScale(d.samplesize))
        //   .y(d => yLinearScale(d[fitted]))
        //   .curve(d3.curveBasisOpen);
        
        // // append path for line
        // chartGroup
        //   .append('path')
        //   .attr('d',curve1)
        //   .classed('line orange',true)
        //   .transition()
        //   .duration(1000)


          
    


        
        
      }
    });
}).catch(function(error) {
  console.log(error);
});
