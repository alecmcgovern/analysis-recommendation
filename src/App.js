import React, { Component } from 'react';

import BarGraph from './barGraph.js';
import title from './assets/title.svg';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<div className="title">Analysis Recommendation</div>
				</header>
				<div className="app-body">
					<BarGraph />
				</div>
			</div>
		);
	}
}

export default App;
