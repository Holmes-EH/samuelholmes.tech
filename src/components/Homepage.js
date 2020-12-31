import React, { Component, Fragment } from "react";

import Footer from "./Footer";
import { ReactComponent as Illus1 } from "../images/illus1.svg";
import { ReactComponent as Illus2 } from "../images/illus2.svg";
import { ReactComponent as Illus3 } from "../images/illus3.svg";

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
			}, 4000);
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
						<div className="box">
							<h1>Techniquement ?</h1>
							<h2>Tout est possible...</h2>
						</div>
					</div>
					<hr />
					<div className="container flex">
						<div className="hook">
							<Illus1 />
							<div className="hook--text">
								<h2>Votre site web</h2>
								<h2>clés en main</h2>
							</div>
						</div>
						<div className="hook">
							<div className="hook--text">
								<h2>Ciblez</h2>
								<h2>votre audience</h2>
							</div>
							<Illus3 />
						</div>
						<div className="hook">
							<Illus2 />
							<div className="hook--text">
								<h2>Fonctionnalités</h2>
								<h2>sur mesure</h2>
							</div>
						</div>
					</div>

					<hr />
				</Fragment>
				<Footer />
			</div>
		);
	}
}

export default Homepage;
