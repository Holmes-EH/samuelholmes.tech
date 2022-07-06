const Footer = () => {
	const thisyear = new Date().getFullYear()
	return (
		<footer>
			<p style={{ textAlign: 'center' }}>© Samuel Holmes - {thisyear}</p>
		</footer>
	)
}

export default Footer
