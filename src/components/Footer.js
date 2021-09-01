import React, { Component } from 'react'

export class Footer extends Component {
	render() {
		const thisyear = new Date().getFullYear()
		return (
			<footer>
				<p style={{ textAlign: 'center' }}>
					© Samuel Holmes - {thisyear}
				</p>
			</footer>
		)
	}
}

export default Footer
