import React, { Component } from "react";
import { ReactComponent as SHLogo } from "../images/sh-on.svg";

export class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showNav: false,
			show: false,
			slideUp: true,
			firstLoad: this.props.firstLoad,
		};
		this.toggleNav = this.toggleNav.bind(this);
		this.show = this.show.bind(this);
	}

	toggleNav = () => this.setState((state) => ({ showNav: !state.showNav }));
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
			}, 4500);
		} else {
			this.setState((state) => ({ slideUp: !state.slideUp }));
			this.show();
		}
	};

	render() {
		const slideUpClass = this.state.slideUp ? "slideUp" : "";
		const navClasses = this.state.showNav
			? "nav fadeIn nav--visible"
			: "nav fadeIn";
		const hiddenClass = this.state.show ? "" : "hidden";
		const className = this.state.show ? "nav-toggle" : "nav-toggle hidden";
		return (
			<header className={`row ${slideUpClass}`}>
				<a href="/" style={{ display: "block", margin: "0 auto" }}>
					<div className="logoContainer">
						<div className="topLeftText">
							<h1>
								<span className="samuel">Samuel</span>
							</h1>
							<h1>
								<span className="holmes">Holmes</span>
							</h1>
						</div>
						<SHLogo className="topLogo" />
						<div className="topRightText">
							<h1>
								<span className="T">T</span>
								<span className="E">E</span>
								<span className="C">C</span>
								<span className="H">H</span>
							</h1>
						</div>
					</div>
				</a>
				<nav className={navClasses + hiddenClass}>
					<ul className="nav-item--container">
						{/* <a href="#">
							<li className="nav-item">Portfolio</li>
						</a>
						<a href="#">
							<li className="nav-item">Login</li>
						</a> */}
					</ul>
				</nav>
				<button
					className={`nav-toggle ${className} ${hiddenClass}`}
					aria-label="open navigation"
					onClick={this.toggleNav}
				>
					<span className="hamburger"></span>
				</button>
			</header>
		);
	}
}

export default Header;
