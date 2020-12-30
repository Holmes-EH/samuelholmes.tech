import React, { Component, Fragment } from "react";

import illus1 from "../images/illus1.jpg";

export class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			firstLoad: this.props.firstLoad,
		};
		this.show = this.show.bind(this);
	}
	show = () =>
		this.setState((state) => ({
			show: !state.show,
			firstLoad: !state.firstLoad,
		}));
	componentDidMount = () => {
		if (this.state.firstLoad) {
			var that = this;
			setTimeout(function () {
				that.show();
			}, 6000);
		} else {
			this.show();
		}
	};
	render() {
		const hiddenClass = this.state.show ? "container fadeIn" : "invisible";
		return (
			<div className={hiddenClass}>
				<Fragment>
					<div className="hook">
						<img src={illus1} alt="illustration 1" />
						<div className="hook--text">
							<h1>Votre site web</h1>
							<h2>clés en main</h2>
						</div>
					</div>
				</Fragment>
			</div>
		);
	}
}

export default Homepage;
