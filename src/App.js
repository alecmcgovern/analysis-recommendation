import React, { Component } from 'react';
import logo from './logo.svg';

import BarGraph from './barGraph.js';
import CircleGraph from './circleGraph.js';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<BarGraph />
				<CircleGraph />
			</div>
		);
	}
}

export default App;
