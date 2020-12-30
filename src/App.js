import React, { Component } from "react";

import "./App.css";
import Header from "./components/Header";
import Homepage from "./components/Homepage";

export class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstLoad: true,
		};
	}
	render() {
		return (
			<div>
				<Header firstLoad={this.state.firstLoad} />
				<Homepage firstLoad={this.state.firstLoad} />
			</div>
		);
	}
}

export default App;
