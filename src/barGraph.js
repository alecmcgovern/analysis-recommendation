import React, { Component } from 'react';
import * as d3 from "d3";

import './barGraph.css';
import './tooltip.css';

const tickLabels = ['J','A','S','O','N','D','J','F','M','A','M','J']

const dates = [
	'Jul 1', 'Jul 15', 
	'Aug 1', 'Aug 15', 
	'Sep 1', 'Sep 15', 
	'Oct 1', 'Oct 15',
	'Nov 1', 'Nov 15', 
	'Dec 1', 'Dec 15', 
	'Jan 1', 'Jan 15', 
	'Feb 1', 'Feb 15',
	'Mar 1', 'Mar 15', 
	'Apr 1', 'Apr 15', 
	'May 1', 'May 15', 
	'Jun 1', 'Jun 15',
];

const recTypes = ["buy", "hold", "sell"];

class BarGraph extends Component {

	constructor(props) {
		super(props);

		this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
		this.width = 500 - this.margin.left - this.margin.right;
		this.height = 300 - this.margin.top - this.margin.bottom;

		this.numBars = 24;
		this.barPadding = 2;
		this.barWidth = (this.width / this.numBars) - this.barPadding;
		this.rangeMax = 100;

		this.state = {
			dataColumns: this.randomData(this.numBars)
		}
	}

	componentDidMount() {
		this.svg = d3.select('.container').append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.attr("class", "bar-graph")
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.x = d3.scaleBand()
			.rangeRound([0, this.width])
			.domain(dates);

		this.y = d3.scaleLinear()
			.rangeRound([this.height, 0]);

		this.stack = d3.stack()
			.keys(recTypes)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);

		this.redraw(this.randomDataNew());

		this.scaleXAxis = d3.scaleLinear()
			.range([0, this.width])
			.domain([0, this.numBars]);

		this.xAxis = d3.axisBottom(this.scaleXAxis)
			.tickFormat((d, i) => { return tickLabels[i]});
		this.yAxis = d3.axisLeft(this.y);

		// ToolTip
		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.text("");

		// X Axis
		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + this.height + ")")
			.call(this.xAxis);
		
		this.svg.append("text")
			.attr("transform", "translate(" + (this.width/2) + ", " + (this.height + this.margin.top + 5) + ")")
			.attr("class", "label-x")
			.text("Time in Months");

		// Y Axis
		this.svg.append("g")
			.attr("class", "y axis")
			.call(this.yAxis);

		this.svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", 0 - this.height/2)
			.attr("y", 0 - this.margin.left/2 - 5)
			.attr("class", "label-y")
			.text("Price");
	}

	redraw(data) {
		console.log(data);
		this.y.domain([0, Math.max.apply(Math, data.map((d) => { return d.sum }))]);

		recTypes.forEach((key, i) => {

			let bar = this.svg.selectAll(".bar-" + key)
				.data(this.stack(data)[i], (d) => { return d.data.date + "-" + key});

			bar.transition()
				.attr("y", (d) => { return this.y(d[1]); })
				.attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); });

			bar.enter().append("rect")
				.attr("class", (d) => { return "bar bar-" + key; })
				.attr("x", (d, i) => { return (this.barWidth + this.barPadding) * i + 1; })
				.attr("y", (d) => { return this.y(d[1]); })
				.attr("height", (d) => { return this.y(d[0]) - this.y(d[1]) })
				.attr("width", (d, i) => { return this.barWidth })
				.on("mouseover", (d, i) => {
					this.tooltip.text((d[1] - d[0]).toFixed(2));
					return this.tooltip.style("visibility", "visible");
				})
				.on("mousemove", () => {
					return this.tooltip.style("top", (d3.event.pageY - 40) + "px")
						.style("left", (d3.event.pageX + 10) + "px");
				})
				.on("mouseout", () => {
					return this.tooltip.style("visibility", "hidden");
				});


		});
	}

	componentDidUpdate() {

	}

	randomDataNew() {
		return dates.map((d) => {
			let obj = {};
			obj.date = d;
			let nums = [];

			let buy = Math.random()*100;
			let hold = Math.random()*(100 - buy);
			let sell = 100 - buy - hold;

			obj["buy"] = buy;
			obj["hold"] = hold;
			obj["sell"] = sell;

			obj.sum = buy + hold + sell;

			return obj;
		})
	}

	randomData(length) {
		let columns = [];

		for (let i = 0; i < length; i++) {
			let values = {}
			let buy = Math.random()*100;
			let hold = Math.random()*(100 - buy);
			let sell = 100 - buy - hold;
			values["buy"] = buy;
			values["hold"] = hold;	
			values["sell"] = sell;

			columns[i] = values;
		}

		return columns;
	}

	randomizeData() {
		this.redraw(this.randomDataNew());
	}

	render() {
		return (
			<div className="bar-graph-container">
				<div className="title">Bar Graph</div>
				<div className="container"></div>
				<div className="randomize-data-button" onClick={() => this.randomizeData()}>
					<div className="sub-button tl"></div>
					<div className="sub-button tr"></div>
					<div className="sub-button bl"></div>
					<div className="sub-button br"></div>
				</div>
			</div>
		);
	}
}

export default BarGraph;