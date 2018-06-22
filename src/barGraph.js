import React, { Component } from 'react';
import * as d3 from "d3";

import './barGraph.css';

class BarGraph extends Component {

	constructor(props) {
		super(props);

		this.margin = { top: 20, right: 20, bottom: 20, left: 40 };
		this.svgWidth = 500 - this.margin.left - this.margin.right;
		this.svgHeight = 300 - this.margin.top - this.margin.bottom;

		this.numBars = 20;
		this.barPadding = 2;
		this.barWidth = this.svgWidth / this.numBars;
		this.rangeMax = 100;

		this.state = {
			data: this.randomData(this.numBars)
		}

		this.scaleY = d3.scaleLinear()
			.domain([0, d3.max(this.state.data)])
			.range([0, this.svgHeight]);

		this.scaleYAxis = d3.scaleLinear()
			.domain([0, d3.max(this.state.data)])
			.range([this.svgHeight, 0]);

		this.scaleXAxis = d3.scaleLinear()
			.domain([0, this.numBars])
			.range([0, this.svgWidth]);
	}

	componentDidMount() {
		this.svg = d3.select('.container').append("svg")
			.attr("width", this.svgWidth + this.margin.left + this.margin.right)
			.attr("height", this.svgHeight + this.margin.top + this.margin.bottom)
			.attr("class", "bar-graph")
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.xAxis = d3.axisBottom(this.scaleXAxis)
			.tickFormat((d) => { return d.toFixed(1) });

		this.yAxis = d3.axisLeft(this.scaleYAxis)
			.tickFormat((d) => { return (d).toFixed(0) });

		this.tooltip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("background", "#000")
			.style("color", "#FFF")
			.text("");

		this.barGraph = this.svg.selectAll("rect")
			.data(this.state.data)
			.enter()
			.append("rect")
			.attr("y", (d) => {
				return this.svgHeight - this.scaleY(d);
			})
			.attr("height", (d) => {
				return this.scaleY(d);
			})
			.attr("width", this.barWidth - this.barPadding)
			.attr("transform", (d, i) => {
				let translate = [this.barWidth * i, 0];
				return "translate(" + translate + ")";
			})
			.attr("class", "bar1")
			.on("mouseover", (d) => { 
				this.tooltip.text(d);
				return this.tooltip.style("visibility", "visible");
			})
			.on("mousemove", () => {
				return this.tooltip.style("top", (d3.event.pageY - 10) + "px")
					.style("left", (d3.event.pageX + 10) + "px");
			})
			.on("mouseout", () => {
				return this.tooltip.style("visibility", "hidden");
			});

		this.svg.append("g")
			.attr("transform", "translate(0, " + this.svgHeight + ")")
			.attr("class", "x axis")
			.call(this.xAxis);

		this.svg.append("g")
			.attr("class", "y axis")
			.call(this.yAxis);
	}

	componentDidUpdate() {
		this.svg.selectAll("rect")
			.data(this.state.data);
		
		let transitionSvg = d3.select('svg').transition();

		transitionSvg.selectAll("rect")
			.duration(450)
			.attr("y", (d) => {
				return this.svgHeight - this.scaleY(d);
			})
			.attr("height", (d) => {
				return this.scaleY(d);
			});
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