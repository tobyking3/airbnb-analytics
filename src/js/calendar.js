import * as d3 from 'd3';

/***************************************************************************************

  The calendar is an adaptation of the Calendar heat map (vertical) demonstration.

  The code has been adapted and completey refactored to suit the needs of the application.

*    Title: Update and transition of pie chart
*    Author: Joseph, D
*    Date: 2019
*    Code version: 1.0
*    Availability: https://bl.ocks.org/danbjoseph/13d9365450c27ed3bf5a568721296dcc
*
***************************************************************************************/

const monthWords = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const containerWidth = document.getElementsByClassName("heatmap")[0].offsetWidth;

const labelArea = 50;
const squareMargin = 2;
const squareSize = containerWidth / 50;

let sel;

const tooltipWidth = (squareSize * 6) + (squareMargin * 5);

const calendarDate = d3.select(".calendar-date");
const calendarBookings = d3.select(".calendar-bookings");
const calendarTooltip = d3.select(".calendar-tooltip").style("width", tooltipWidth + "px");

const getDate = d => {
    let strDate = new String(d);
    let selectYear = strDate.substr(0, 4);
    let selectMonth = strDate.substr(4, 2)-1;
    let selectDay = strDate.substr(6, 2);
    return new Date(selectYear, selectMonth, selectDay);
};

const dateStr = dateDashed => {
  let dateString = dateDashed.split("-");
  return dateString[2] + " " + monthWords[Number(dateString[1]) - 1];
}

const weeksInMonth = month => {
    let m = d3.timeMonth.floor(month)
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
}

const formatDate = d => d.replace(/-/g, "");

const width = 700;
const height = 400;

const render = dateData => {

    let minDate = d3.min(dateData, d => getDate(d.date));
    let maxDate = d3.max(dateData, d => getDate(d.date));

    let dateFormat = {
        day: d3.timeFormat("%w"),
        week: d3.timeFormat("%U"),
        format: d3.timeFormat("%Y-%m-%d"),
        monthName: d3.timeFormat("%B"),
        months: d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate)
    }

    let svg = d3.select(".heatmap")
        .selectAll("svg")
        .data(dateFormat.months)
        .enter()
        .append("svg")
        .style("margin-top", "10px")
        .style("margin-bottom", "10px")
        .style("margin-left", "10px")
        .style("margin-right", "10px")
        .attrs({
            "class": "month",
            "height": ((squareSize * 7) + (squareMargin * 8) + 20),
            "width": d => ((squareSize * weeksInMonth(d)) + (squareMargin * (weeksInMonth(d) + (labelArea / 2))))
        })
        .append("g");

    svg.append("text")
        .attrs({
            "class": "month-name",
            "text-anchor": "middle",
            "y": (squareSize * 7) + (squareMargin * 8) + 15,
            "x": d => (((squareSize * weeksInMonth(d)) + (squareMargin * (weeksInMonth(d) + 1))) / 2 + (labelArea / 2))
        })
        .text(d => dateFormat.monthName(d));


    ["Mon", "Tues", "Weds", "Thu", "Fri", "Sat", "Sun"].forEach(function(d, i) { 
        svg.append("text")
            .attrs({
                "class": "day-name",
                "text-anchor": "left",
                "y": (squareSize * i) + (squareMargin * i) + squareSize - 4,
                "x": 0
            })
            .text(d);
    });

    let lookup = d3.nest()
        .key(d => d.date)
        .rollup(item => d3.sum(item, d => d.booked))
        .object(dateData);

    let scale = d3.scaleLinear()
        .domain(d3.extent(dateData, d => d.booked))
        .range([0,1]);

    let colorScale = d3.scaleLinear().domain([1,length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#3E67FF"), d3.rgb('#C6DAFB')])

    let rect = svg.selectAll("rect.day")
        .data((d, i) => d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)))
        .enter()
        .append("rect")
        .attrs({
            "class": "day",
            "width": squareSize,
            "height": squareSize,
            "rx": 2,
            "ry": 2,
            "fill": '#E5ECFD',
            "y": d => (dateFormat.day(d) * squareSize) + (dateFormat.day(d) * squareMargin) + squareMargin,
            "x": d => ((dateFormat.week(d) - dateFormat.week(new Date(d.getFullYear(),d.getMonth(),1))) * squareSize) + ((dateFormat.week(d) - dateFormat.week(new Date(d.getFullYear(),d.getMonth(),1))) * squareMargin) + squareMargin + labelArea
        })
        .datum(dateFormat.format)
        .on("mouseover", highlight)
        .on("mouseout", hideTooltip)
        .on("click", showTooltip)

    rect.filter(d => formatDate(d) in lookup)
        .style("fill", d => colorScale(scale(lookup[formatDate(d)])));

    function showTooltip(d, i) {
        calendarTooltip.style("display", "block")
            .style("left", (d3.event.pageX - (tooltipWidth / 2)) + "px")
            .style("top", (d3.event.pageY - 95) + "px")
            .transition().duration(100).style("opacity", 1);

        calendarDate.html(dateStr(d));

        if(lookup[formatDate(d)]){
            calendarBookings.html(lookup[formatDate(d)] + " bookings");
        } else {
            calendarBookings.html(" No Data ");
        }
    }

    function hideTooltip(d, i) {
        d3.select(this).attr("stroke-width", 0);

        calendarTooltip.transition()
            .duration(100)
            .style("opacity", 0)
            .on("end", function() { calendarTooltip.style("display", "none"); });
    }

    function highlight(d, i) {
        let currentSquare = d3.select(this).attrs({
            "stroke": "yellow",
            "stroke-width": 2
        });
    }
}



//======================================================================================================



const update = (newData) => {
    let minDate = d3.min(newData, d => getDate(d.date));
    let maxDate = d3.max(newData, d => getDate(d.date));

    let dateFormat = {
        day: d3.timeFormat("%w"),
        week: d3.timeFormat("%U"),
        format: d3.timeFormat("%Y-%m-%d"),
        monthName: d3.timeFormat("%B"),
        months: d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate)
    }

    let svg = d3.select(".heatmap")
        .selectAll("svg")
        .data(dateFormat.months)
        .enter()
        .append("svg")
        .style("margin-top", "10px")
        .style("margin-bottom", "10px")
        .style("margin-left", "10px")
        .style("margin-right", "10px")
        .attrs({
            "class": "month",
            "height": ((squareSize * 7) + (squareMargin * 8) + 20),
            "width": d => ((squareSize * weeksInMonth(d)) + (squareMargin * (weeksInMonth(d) + (labelArea / 2))))
        })
        .append("g");

    svg.append("text")
        .attrs({
            "class": "month-name",
            "text-anchor": "middle",
            "y": (squareSize * 7) + (squareMargin * 8) + 15,
            "x": d => (((squareSize * weeksInMonth(d)) + (squareMargin * (weeksInMonth(d) + 1))) / 2 + (labelArea / 2))
        })
        .text(d => dateFormat.monthName(d));


    ["Mon", "Tues", "Weds", "Thu", "Fri", "Sat", "Sun"].forEach(function(d, i) { 
        svg.append("text")
            .attrs({
                "class": "day-name",
                "text-anchor": "left",
                "y": (squareSize * i) + (squareMargin * i) + squareSize - 4,
                "x": 0
            })
            .text(d);
    });

    let lookup = d3.nest()
        .key(d => d.date)
        .rollup(item => d3.sum(item, d => d.booked))
        .object(newData);

    let scale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.booked))
        .range([0,1]);

    let colorScale = d3.scaleLinear().domain([1,length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#3E67FF"), d3.rgb('#C6DAFB')])

    let rect = svg.selectAll("rect.day")
        .data((d, i) => d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)))
        .enter()
        .append("rect")
        .attrs({
            "class": "day",
            "width": squareSize,
            "height": squareSize,
            "rx": 2,
            "ry": 2,
            "fill": '#E5ECFD',
            "y": d => (dateFormat.day(d) * squareSize) + (dateFormat.day(d) * squareMargin) + squareMargin,
            "x": d => ((dateFormat.week(d) - dateFormat.week(new Date(d.getFullYear(),d.getMonth(),1))) * squareSize) + ((dateFormat.week(d) - dateFormat.week(new Date(d.getFullYear(),d.getMonth(),1))) * squareMargin) + squareMargin + labelArea
        })
        .datum(dateFormat.format)
        .on("mouseover", highlight)
        .on("mouseout", hideTooltip)
        .on("click", showTooltip)

    rect.filter(d => formatDate(d) in lookup)
        .style("fill", d => colorScale(scale(lookup[formatDate(d)])));

    function showTooltip(d, i) {
        calendarTooltip.style("display", "block")
            .style("left", (d3.event.pageX - (tooltipWidth / 2)) + "px")
            .style("top", (d3.event.pageY - 95) + "px")
            .transition().duration(100).style("opacity", 1);

        calendarDate.html(dateStr(d));

        if(lookup[formatDate(d)]){
            calendarBookings.html(lookup[formatDate(d)] + " bookings");
        } else {
            calendarBookings.html(" No Data ");
        }
    }

    function hideTooltip(d, i) {
        d3.select(this).attr("stroke-width", 0);

        calendarTooltip.transition()
            .duration(100)
            .style("opacity", 0)
            .on("end", function() { calendarTooltip.style("display", "none"); });
    }

    function highlight(d, i) {
        let currentSquare = d3.select(this).attrs({
            "stroke": "yellow",
            "stroke-width": 2
        });
    }
}







d3.json("calendar-array.json").then(json => {
    let data = json["City of London"];
    render(data);

    d3.select("#calendar-borough-select").on("change", (d, i) => {
        sel = d3.select("#calendar-borough-select").node().value;
        update(json[sel]);
    })
})