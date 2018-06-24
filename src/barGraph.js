import React, { Component } from 'react';
import * as d3 from "d3";

import './barGraph.css';
import './tooltip.css';

const tickLabels = ['J','A','S','O','N','D','J','F','M','A','M','J']

const dates = [
	'Jul 1, 2017', 'Jul 15, 2017', 
	'Aug 1, 2017', 'Aug 15, 2017', 
	'Sep 1, 2017', 'Sep 15, 2017', 
	'Oct 1, 2017', 'Oct 15, 2017',
	'Nov 1, 2017', 'Nov 15, 2017', 
	'Dec 1, 2017', 'Dec 15, 2017', 
	'Jan 1, 2018', 'Jan 15, 2018', 
	'Feb 1, 2018', 'Feb 15, 2018',
	'Mar 1, 2018', 'Mar 15, 2018', 
	'Apr 1, 2018', 'Apr 15, 2018', 
	'May 1, 2018', 'May 15, 2018', 
	'Jun 1, 2018', 'Jun 15, 2018',
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
			dataBars: [],
			priceReal: [],
			priceExpected: []
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
			.rangeRound([this.height, 0])
			.domain([0,100]);

		this.stack = d3.stack()
			.keys(recTypes)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);

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

		// Line

		this.xLine = d3.scaleLinear()
			.domain([0, 24])
			.range([0, this.width]);

		this.yLine = d3.scaleLinear()
			.domain([0, 100])
			.range([this.height, 0]);

		this.line = d3.line()
			.x((d, i) => { return (this.barWidth + this.barPadding) * i + 1; })
			.y((d) => { return this.yLine(d.y); });

		this.redrawBars(this.randomDataBars());
		this.redrawLine(this.randomDataLines("real"), "real");
		this.redrawLine(this.randomDataLines("expected"), "expected");
	}

	redrawBars(data) {
		this.y.domain([0, Math.max.apply(Math, data.map((d) => { return d.sum }))]);

		recTypes.forEach((key, i) => {

			let bar = this.svg.selectAll(".bar-" + key)
				.data(this.stack(data)[i], (d) => { return d.data.date + "-" + key});

			bar.transition()
				.attr("y", (d) => { return this.y(d[1]); })
				.attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); });

			let _this = this;

			bar.enter().append("rect")
				.attr("class", (d) => { return "bar bar-" + key; })
				.attr("x", (d, i) => { return (this.barWidth + this.barPadding) * i + 1; })
				.attr("y", (d) => { return this.y(d[1]); })
				.attr("height", (d) => { return this.y(d[0]) - this.y(d[1]) })
				.attr("width", (d, i) => { return this.barWidth })
				.on("mouseover", (d, i) => {
					let text =  d.data.date + "\r\n" + 
								"Real: $" + (_this.state.priceReal[i].y).toFixed(2) + "\r\n" + 
								"Expected: $" + (_this.state.priceExpected[i].y).toFixed(2);
					this.tooltip.text(text);
					// this.tooltip.text((d[1] - d[0]).toFixed(2));
					return this.tooltip.style("visibility", "visible");
				})
				.on("mousemove", () => {
					return this.tooltip.style("top", (d3.event.pageY - 85) + "px")
						.style("left", (d3.event.pageX + 10) + "px");
				})
				.on("mouseout", () => {
					return this.tooltip.style("visibility", "hidden");
				});


		});
	}

	redrawLine(data, type) {
		this.svg.selectAll("." + type).remove();

		let path = this.svg.append("path");

		path.attr("class", type)
			.attr("d", this.line(data));
	}

	randomDataBars() {
		let data = dates.map((d) => {
			let obj = {};
			obj.date = d;

			let buy = Math.random()*30 + 10;
			let hold = Math.random()*20 + 40;
			let sell = 100 - buy - hold;

			obj["buy"] = buy;
			obj["hold"] = hold;
			obj["sell"] = sell;

			obj.sum = buy + hold + sell;

			return obj;
		});

		this.setState({ dataBars: data });
		return data;
	}

	randomDataLines(type) {
		let pricePoints = [];

		for (let i = 0; i < dates.length; i++) {
			let value;

			if (i === 0) {
				value = Math.random()* 100;
			} else {
				value = Math.min(Math.max(pricePoints[i-1] + Math.random()*40 - 20, 0), 100);
			}

			pricePoints[i] = value;
		}
		
		let data = dates.map((d, i) => {
			let obj = {};

			obj.x = i + 1;
			obj.y = pricePoints[i];

			return obj;
		});

		if (type === "real") {
			this.setState({ priceReal: data });
		} else {
			this.setState({ priceExpected: data });
		}
		return data;
	}

	randomizeData() {
		this.redrawBars(this.randomDataBars());
		this.redrawLine(this.randomDataLines("real"), "real");
		this.redrawLine(this.randomDataLines("expected"), "expected");
	}

	render() {
		return (
			<div className="bar-graph-container">
				<div className="layout">
					<div className="controls">
						<div className="legend">
							<div className="legend-container">
								<i className="fas fa-chart-line white fa-1.5x"></i>
								<div className="real-label">Real Price</div>
							</div>
							<div className="legend-container">
								<i className="fas fa-chart-line red fa-1.5x"></i>
								<div className="expected-label">Expected Price</div>
							</div>
						</div>
						<div className="randomize-data-button" onClick={() => this.randomizeData()}>
							Randomize Data
						</div>
					</div>
					<div className="container"></div>
					<div className="bar-legend-container">
						<div className="color-container">
							<div className="color-box blue"></div>
							<div>buy</div>
						</div>
						<div className="color-container">
							<div className="color-box white"></div>
							<div>hold</div>
						</div>
						<div className="color-container">
							<div className="color-box green"></div>
							<div>sell</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default BarGraph;