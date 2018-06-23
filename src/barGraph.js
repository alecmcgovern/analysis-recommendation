import React, { Component } from 'react';
import * as d3 from "d3";

import './barGraph.css';
import './tooltip.css';

class BarGraph extends Component {

	constructor(props) {
		super(props);

		this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
		this.width = 500 - this.margin.left - this.margin.right;
		this.height = 300 - this.margin.top - this.margin.bottom;

		this.numBars = 24;
		this.barPadding = 2;
		this.barWidth = this.width / this.numBars;
		this.rangeMax = 100;

		this.state = {
			data: this.randomData(this.numBars)
		}

		this.x = d3.scaleLinear()
			.range([0, this.width]);

		this.y = d3.scaleLinear()
			.range([this.height, 0]);
	}

	componentDidMount() {
		this.svg = d3.select('.container').append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.attr("class", "bar-graph")
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.x.domain([0, this.numBars]);
		this.y.domain([0, this.rangeMax]);
		this.xAxis = d3.axisBottom(this.x);
		this.yAxis = d3.axisLeft(this.y);


		// X Axix
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


		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.text("");

		this.barGraph = this.svg.selectAll("rect")
			.data(this.state.data)
			.enter()
			.append("rect")
			.attr("y", (d) => {
				return this.y(d);
			})
			.attr("height", (d) => {
				return this.height - this.y(d);
			})
			.attr("width", this.barWidth - this.barPadding)
			.attr("transform", (d, i) => {
				let translate = [this.barWidth * i + 1, 0];
				return "translate(" + translate + ")";
			})
			.attr("class", "bar1")
			.on("mouseover", (d) => { 
				this.tooltip.text(d.toFixed(2));
				return this.tooltip.style("visibility", "visible");
			})
			.on("mousemove", () => {
				return this.tooltip.style("top", (d3.event.pageY - 10) + "px")
					.style("left", (d3.event.pageX + 10) + "px");
			})
			.on("mouseout", () => {
				return this.tooltip.style("visibility", "hidden");
			});
	}

	componentDidUpdate() {
		// this.x.domain([0, this.numBars]);
		// this.y.domain([0, this.rangeMax]);
		// this.yAxis = d3.axisLeft(this.y);

		this.svg.selectAll("rect")
			.data(this.state.data);

		let transitionSvg = d3.select('svg').transition();

		transitionSvg.selectAll("rect")
			.duration(450)
			.attr("y", (d) => {
				return this.y(d);
			})
			.attr("height", (d) => {
				return this.height - this.y(d);
			});

		// transitionSvg.select("y.axis")
		// 	.duration(450)
		// 	.call(this.yAxis);
	}

	randomData(length) {
		let values = [];

		for (let i = 0; i < length; i++) {
			values[i] = Math.random()*100;
		}

		return values;
	}

	randomizeData() {
		let newData = this.randomData(this.numBars);
		this.setState({
			data: newData
		});
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