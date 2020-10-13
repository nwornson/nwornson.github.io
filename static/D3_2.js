// creates circles that transition, fit line using data saved from fitting  a loess spline in R.




var svg2Width2 = 800;
var svg2Height2 = 500;

var margin2 = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width2 = svg2Width2 - margin2.left - margin2.right;
var height2 = svg2Height2 - margin2.top - margin2.bottom;

// Create an svg2 wrapper, append an svg2 group that will hold our chart,
// and shift the latter by left and top margin2s.
var svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("width", svg2Width2)
  .attr("height", svg2Height2);

// Append an svg2 group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// Initial Params
var chosenYaxis2 = "m";
var chosenLine2 = 'mfit';




// function used for updating y-scale var upon click on axis label
function yScale(nnData, chosenYaxis2) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(nnData, d => d[chosenYaxis2]) * 1.2,
      d3.min(nnData, d => d[chosenYaxis2]) * .8
    ])
    .range([0,height2]);

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
function renderCircles(circlesGroup2, newYScale, chosenYaxis2) {

  circlesGroup2.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYaxis2]));

  return circlesGroup2;
}


// function used for updating circles group with new tooltip



function updateToolTip(chosenYaxis2, circlesGroup2) {

   var label;

   if (chosenYaxis2 === "m") {
     label = "Mean Acc:";

   }
   else {
     label = "Standard Error:";
   }

   var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.samplesize}<br>${label} ${d[chosenYaxis2]}<br>Model:${d['model']}`);

 
     });

   circlesGroup2.call(toolTip);

   circlesGroup2.on("mouseover", function(data) {
     toolTip.show(data);
   })
     // onmouseout event
     .on("mouseout", function(data, index) {
       toolTip.hide(data);
     });

   return circlesGroup2;
 } 



// Retrieve data from the CSV file and execute everything below
d3.csv("static/red_ciphar_data_spread_100920.csv").then(function(nnData, err) {
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
  var gdata2 = d3.nest()
  .key(function(d) { return d.model})
  .entries(nnData)

  // xLinearScale function above csv import
  var yLinearScale2 = yScale(nnData, chosenYaxis2);

  // Create x scale function
  var xLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(nnData, d => d.samplesize)])
    .range([0, width2]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale2);
  var leftAxis = d3.axisLeft(yLinearScale2);

  // append y axis
  var yAxis2 = chartGroup2.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append x axis
  chartGroup2.append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(bottomAxis);

  // append initial circles
  var circlesGroup2 = chartGroup2.selectAll("circle")
    .data(nnData)
    .enter() 
    .append("circle")
    .attr("cx", d => xLinearScale2(d.samplesize))
    .attr("cy", d => yLinearScale2(d[chosenYaxis2]))
    .attr("r", 5)
    .attr("fill", function(d,i) {
      return d['color']
    })
    .attr("opacity", ".5");
  

    // Create group for two y-axis labels
  var labelsGroup2 = chartGroup2.append("g")
    .attr("transform", `translate(0, 0)`);

  var mean_acc2 = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height2/2)
    .attr("y", 0 - 40)
    .attr("value", "m") // value to grab for event listener
    .classed("active", true)
    .text("Mean Accuracy");

  var se_acc2 = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height2/2)
    .attr("y", 0 - 60)
    .attr("value", "s") // value to grab for event listener
    .classed("inactive", true)
    .text("Standard Error");

  // append x axis
  chartGroup2.append("text")
 
    .attr("y", height2 + 40)
    .attr("x", width2/2)
    .attr("dx", "1em")
    .classed("axis-text", true)
    .text("Sample Size");

  // updateToolTip function above csv import
  var circlesGroup2 = updateToolTip(chosenYaxis2, circlesGroup2);

  
 // legend

 var res = gdata2.map(function(d){ return d.key })

 var color = d3.scaleOrdinal()
 .domain(res)
 .range(['#F0CD0A','#8CDA11','#F26B59'])
var legendRectSize = 18;                                 
var legendSpacing = 4;                                   

var legend2 = chartGroup2.selectAll('.legend')                     
.data(color.domain())                                   
.enter()                                                
.append('g')                                            
.attr('class', 'legend')                                
.attr('transform', function(d, i) {                     
  var height = legendRectSize + legendSpacing;          
  var offset =  height2 * color.domain().length / 2;     
  var horz = 2 * legendRectSize;                       
  var vert = i * height;                       
  return 'translate(' + horz + ',' + vert + ')';        
});                                                     

legend2.append('rect')                                   
.attr('width', legendRectSize)                          
.attr('height', legendRectSize)                         
.style('fill', color)                                   
.style('stroke', color);                                

legend2.append('text')                                   
.attr('x', legendRectSize + legendSpacing)              
.attr('y', legendRectSize - legendSpacing)              
.text(function(d) { return d; }); 



  // line

  var curve2 = d3.line()
    .x(d => xLinearScale2(d.samplesize))
    .y(d => yLinearScale2(d[chosenLine2]))
    .curve(d3.curveBasisOpen);


  gdata2.forEach(function(d,i) {
    var pathData = curve2(d.values);
    chartGroup2.append('path')
      .attr('d',pathData)
      .classed('line2',true)

    //console.log(d.values[0]['color'])
    
      .attr("stroke", function(d,j) {
        return  color(i);

      });

    
      

  })

  // x axis labels event listener
  labelsGroup2.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value2 = d3.select(this).attr("value");
      //console.log(value);
      if (value2 !== chosenYaxis2) {

        // replaces chosenYaxis2 with value
        chosenYaxis2 = value2;
        
        if (chosenYaxis2 == 'm') {
          chosenLine2 = 'mfit';
        } else {
          chosenLine2 = 'sfit';
        }
       

        // console.log(chosenYaxis2)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale2 = yScale(nnData, chosenYaxis2);

        // updates x axis with transition
        yAxis2 = renderAxes(yLinearScale2, yAxis2);

        // updates circles with new y values
        circlesGroup2 = renderCircles(circlesGroup2, yLinearScale2, chosenYaxis2);
        
        // updates tooltips with new info
        circlesGroup2 = updateToolTip(chosenYaxis2, circlesGroup2);


        // changes classes to change bold text
        if (chosenYaxis2 === "m") {
            mean_acc2
            .classed("active", true)
            .classed("inactive", false);
            se_acc2
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            mean_acc2
            .classed("active", false)
            .classed("inactive", true);
            se_acc2
            .classed("active", true)
            .classed("inactive", false);
        }
          // line
          
          d3.selectAll("path.line2").remove();

          

        // line
        var curve2 = d3.line()
          .x(d => xLinearScale2(d.samplesize))
          .y(d => yLinearScale2(d[chosenLine2]))
          .curve(d3.curveBasisOpen);

        gdata2.forEach(function(d,i) {
        var pathData = curve2(d.values);
        chartGroup2.append('path')
          .attr('d',pathData)
          .classed('line2',true)
          .attr("stroke", function(d,j) {
            return  color(i);
    
          });

        })
        //   var curve2 = d3.line()
        //   .x(d => xLinearScale(d.samplesize))
        //   .y(d => yLinearScale(d[fitted]))
        //   .curve(d3.curveBasisOpen);
        
        // // append path for line
        // chartGroup2
        //   .append('path')
        //   .attr('d',curve2)
        //   .classed('line orange',true)
        //   .transition()
        //   .duration(1000)


          
    


        
        
      }
    });
}).catch(function(error) {
  console.log(error);
});
