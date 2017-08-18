//arrays for the values in each of the columns
var dir=[];
var dirCount=[];
var zero12=[];
var twelve25=[];
var twentyfive38=[];
var thirty8=[];
//array for bottom legend
var legNames=["Mean Speed: ", "Peak Frequency: ", "Peak Direction: ", "Percent Calm: "];
var maxSpeed=[];

//importing the data, pushing every value in every column into their respective array
d3.csv("hmf_practice.csv",function(csv){
            csv.map(function(d){
                dir.push(d.direction);
                dirCount.push(+d.directionCount);
                zero12.push(+d.zeroTwelve);
                twelve25.push(+d.twelveTwentyfive);
                twentyfive38.push(+d.twentyfiveThirtyeight);
                thirty8.push(+d.thirtyeightPlus);
                maxSpeed.push(+d.maxSpeed);
            })


//variables for the data that will create the background arcs, and set height, width, and radius
//parameters
var data = [1, 1, 1, 1, 1,1,1,1,1,1,1,1,1,1,1,1];
var width = 400;
var height = 400;
var radius = 140;
var radians = Math.PI/180

//creates tooltip, sets parameters
var tooltip = d3.select("body").append("div").style("opacity","0").style("position","absolute");

//Colour scale for inside arcs and legend
var color = d3.scaleOrdinal()
  .range(["blue", "green", "yellow", "red"]);

//Gets the maximum value in the Direction Count column
var maxCount = d3.max(dirCount)

//slightly larger than maxCount to manipulate arc magnitude
var pref = maxCount * .15

//gets sum of direction counts
var totality = 0;
for (var i = 0; i < 16; i++) {
  totality = (dirCount[i] + totality)
}

//finds index of highest direction count
var peakIndex = 0;
for (var i = 0; i < 16; i++) {
if (dirCount[i] == maxCount) {
  peakIndex = i;
  }
};

//Direction of most wind counts using direction count index from for loop
var peakDir = dir[peakIndex]

//Creates pie chart variable
var pie = d3.pie()

//creates linear scale for top axis
var y = d3.scaleLinear()
              .domain([0,(((maxCount + pref)/totality) * 100)])
              .range([0,-139]);

//creates linear scale for bottom axis
var help = d3.scaleLinear()
              .domain([(((maxCount + pref)/totality) * 100),0])
              .range([138,0]);

//creates variable for top y axis
var yAxis = d3.axisLeft(y);

//creates variable for bottom y axis
var helpAxis = d3.axisLeft(help);

//creates variable to round values to two decimal places
var rounding = d3.format(".3f");

//variable calculating mean speed from maxSpeed array and rounding for human readability
var meanSpeed = (rounding(d3.mean(maxSpeed))) + " mph";

//finds how many times wind is calm and increments variable
var calmCount=0;
for (var i = 0; i <= maxSpeed.length; i++) {
  if(maxSpeed[i] < 1) {
    calmCount++;
  }
}

//divides highest direction count by total counts to find peak frequency
var peakFreq = (rounding(maxCount/totality) * 100) + "%"

//divides calm count by length of maxSpeed array to find percentage in which wind was calm
var percCalm = ((calmCount/maxSpeed.length) * 100) + "%"

//creates array to hold values for bottom legend
var legValues=[meanSpeed, peakFreq, peakDir, percCalm];

//creates svg image, sets parameters
var svg = d3.select("body").append("svg")
  .attr("width", "100%")
  .attr("height", 960)
  .append("g")
  .attr("transform", "translate(" + width / 1.5 + "," + height / 2 + ")")

//creates g group and attributes class within which
//it creates arcs based on 'data' array
var g = svg.selectAll(".arc")
  .data(pie(data))
  .enter().append("g")
  .attr("class", "arc")


//creates and places tiny arcs lines on each of the background arcs based on radius
for (var i = 0; i < 20; i++) {
  arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 4)
    .startAngle(function(d) {return d.startAngle - Math.PI/16;})
    .endAngle(function(d) {return d.endAngle - Math.PI/16;});

  radius = radius - 5;

  g.append("path")
    .attr("d", arc)
    .style("fill", "lightsteelblue")
    .style("stroke", "#ffffff")
    .style("stroke-width", 3)
}

//sets start angle where arcs are drawn from, for loop draws arcs with magnitude based on certain array
var startAngle = -11.5*radians;
for (var i = 0; i < 16; i++) {
  arc = d3.arc()
    .innerRadius(0)
    //adds all the arc magnitudes together so that the arc colours appear in the proper order
    .outerRadius(radius + (((thirty8[i] + twentyfive38[i] + twelve25[i] + zero12[i])/(maxCount + pref)) * 10000) / 100)
    .startAngle(startAngle)
    //sets angle where the arc stops and the new angle that the next arc will draw from
        .endAngle(startAngle + 2*Math.PI/16)
    startAngle = (startAngle + 2*Math.PI/16)

    if(thirty8[i]!=0){
  //draws the arcs, fill based on the array values are coming from
  svg.append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", "red")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
}
}

//sets start angle where arcs are drawn from, for loop draws arcs with magnitude based on certain array
var startAngle = -11.5*radians;
for (var i = 0; i < 16; i++) {
  arc = d3.arc()
    .innerRadius(0)
    //adds all the arc magnitudes together so that the arc colours appear in the proper order
    .outerRadius(radius + (((twentyfive38[i] + twelve25[i] + zero12[i])/(maxCount + pref)) * 10000) / 100)
    .startAngle(startAngle)
    //sets angle where the arc stops and the new angle that the next arc will draw from
        .endAngle(startAngle + 2*Math.PI/16)
    startAngle = (startAngle + 2*Math.PI/16)

    if(twentyfive38[i]!=0){
  //draws the arcs, fill based on the array values are coming from
  svg.append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", "yellow")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
}
}

//sets start angle where arcs are drawn from, for loop draws arcs with magnitude based on certain array
var startAngle = -11.5*radians;
for (var i = 0; i < 16; i++) {
  arc = d3.arc()
    .innerRadius(0)
    //adds all the arc magnitudes together so that the arc colours appear in the proper order
    .outerRadius(radius + (((twelve25[i] + zero12[i])/(maxCount + pref)) * 10000) / 100)
    .startAngle(startAngle)
    //sets angle where the arc stops and the new angle that the next arc will draw from
        .endAngle(startAngle + 2*Math.PI/16)
    startAngle = (startAngle + 2*Math.PI/16)

    if(twelve25[i]!=0){
  //draws the arcs, fill based on the array values are coming from
  svg.append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", "green")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
  }

}

//sets start angle where arcs are drawn from, for loop draws arcs with magnitude based on certain array
var startAngle = -11.5*radians;
for (var i = 0; i < 16; i++) {
  arc = d3.arc()
    .innerRadius(0)
    //adds all the arc magnitudes together so that the arc colours appear in the proper order
    .outerRadius(radius + ((zero12[i]/(maxCount + pref)) * 10000) / 100)
    .startAngle(startAngle)
    //sets angle where the arc stops and the new angle that the next arc will draw from
        .endAngle(startAngle + 2*Math.PI/16)
    startAngle = (startAngle + 2*Math.PI/16)

    if(zero12[i]!=0){
  //draws the arcs, fill based on the array values are coming from
  svg.append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", "blue")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
}

}

  //on mouseover, tooltip is activated
  g.on('mouseover', function(d,i) {
       tooltip.transition()
           .style("visibility","visible")
           .style('opacity', .9)

       //positions and sets tooltip text
       tooltip.html((rounding(dirCount[i]/totality) * 100) + "%")
           .style('left', (d3.event.pageX - 15) + 'px')
           .style('top',  (d3.event.pageY - 20) + 'px')

       //upon mouseover, changes opacity of arcs
       tempColor = this.style.fill;
       d3.select(this)
           .style('opacity', .5)
   })

//on mouseout, tooltip is hidden, arcs returned to their original colour
    .on('mouseout', function(d) {
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
            tooltip.transition().duration(1000).style("visibility","hidden")
            });


//appends the top y axis to the svg
svg.append("g")
    .attr("class","y axis")
    .attr("transform", "translate(-200,0)")
    .call(yAxis.ticks(4));

//appends the bottom y axis to the svg
svg.append("g")
    .attr("class","help axis")
    .attr("transform", "translate(-200,0)")
    .call(helpAxis.ticks(4));

//add text behind the y axixs
svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(-235,0)rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Frequency (%)");

//creates arc positions in which the labels will reside
var labelArc = d3.arc()
    .outerRadius(203 - 37)
    .innerRadius(203 - 40)
    .startAngle(function(d) {return d.startAngle - Math.PI/16;})
    .endAngle(function(d) {return d.endAngle - Math.PI/16;});

//appends directions from direction array to the group
    g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("dx", "-1em")
      .text(function(d,i) { return dir[i]; })

//importing title data and placing the headings in an array
d3.csv("hmf_titles.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
    }, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

//creates top legend variable and sets location/text parameters,
//sets number of lines in legend based on number of items in headings array
var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//creates rectangle boxes for top legend, sets parameters, bases colours on colour array
legend.append("rect")
      .attr("x", width - 50)
      .attr("width", 19)
      .attr("height", 19)
      .attr("y", -150)
      .attr("fill", color);

//appends text from headings array onto top legend group
//sets parameters for text
  legend.append("text")
      .attr("x", width - 60)
      .attr("y", -140)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

//appends text (legend title) onto top legend
  svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .append("text")
      .attr("x", width - 140)
      .attr("y", -160)
      .text("Wind Speed (Miles per Hour)");

//appends bottom legend text on group and sets parameters so
//that it doesn't overlap with top legend. function is based on
//data from specific arrays
legend.append("text")
    .attr("x", width - 40)
    .attr("y", 60)
    .attr("dy", "0.32em")
    .text(function(d,i) { return legNames[i] + legValues[i]; });

//appends text constant onto bottom legend, parameters set so that it doesn't
//overlap with text in bottom legend
svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .append("text")
    .attr("x", width - 170)
    .attr("y", 139)
    .attr("dy", "0.32em")
    .text("Calm Defined as: < 1mph");



    });

});
