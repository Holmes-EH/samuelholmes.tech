import React, { Component, Fragment } from 'react'

import Footer from './Footer'
import { ReactComponent as Illus1 } from '../images/illus1.svg'
import { ReactComponent as Illus2 } from '../images/illus2.svg'
import { ReactComponent as Illus3 } from '../images/illus3.svg'

import {
	SiNextDotJs,
	SiNetlify,
	SiWordpress,
	SiOvh,
	SiPhp,
	SiGithub,
	SiJavascript,
	SiLinkedin,
	SiHeroku,
	SiNodeDotJs,
	SiMongodb,
	SiReact,
	SiRedux,
} from 'react-icons/si'

export class Homepage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false,
			firstLoad: this.props.firstLoad,
		}
		this.show = this.show.bind(this)
	}
	show = () =>
		this.setState((state) => ({
			show: !state.show,
			firstLoad: !state.firstLoad,
		}))
	componentDidMount = () => {
		if (this.state.firstLoad) {
			var that = this
			setTimeout(function () {
				that.show()
			}, 4000)
		} else {
			this.show()
		}
	}
	render() {
		const hiddenClass = this.state.show ? 'container fadeIn' : 'invisible'
		return (
			<div className={hiddenClass}>
				<Fragment>
					<div className='hook'>
						<div className='box'>
							<h1>Techniquement ?</h1>
							<h2>Tout est possible...</h2>
						</div>
					</div>
					<div className='container flex'>
						<h2>Je suis à votre écoute</h2>
					</div>
					<div className='container flex'>
						<div className='hook'>
							<Illus1 />
							<div className='hook--text'>
								<h2>Votre site web</h2>
								<h2>clés en main</h2>
							</div>
						</div>
						<div className='hook'>
							<Illus3 />
							<div className='hook--text'>
								<h2>Ciblez</h2>
								<h2>votre audience</h2>
							</div>
						</div>
						<div className='hook'>
							<Illus2 />
							<div className='hook--text'>
								<h2>Fonctionnalités</h2>
								<h2>sur mesure</h2>
							</div>
						</div>
					</div>

					<hr />

					<div className='container flex'>
						<h1>Quelques-unes de mes réalisations</h1>
					</div>
					<div className='container flex showcaseSection'>
						<div className='showcase card'>
							<h2>Le Food Shop à Anglet</h2>
							<a
								href='https://lefoodshop.com'
								target='_blank'
								rel='noopener noreferrer'
								className='imageLink'
							>
								<img
									src='https://lefoodshop.com/favicon.png'
									alt='Favicon Le Food Shop'
								/>
							</a>
							<div className='hook-text'>
								<p>
									Site vitrine d'un restaurant streetfood et
									cuisine de bistro indépendant, presque
									statique.
									<br />
									<br />
									Presque, car toutes les informations de
									biographie / description / contact sont
									statiques, mais le client souhaitait
									afficher six de ses derniers posts instagram
									en haut de page afin de rendre le site plus
									dynamique de façon automatique.
									<br />
									<br />
									Développé avec le framework NextJS / React
									et interroge l'API Graph Instagram Business.
									<br />
									<br />
									Intégration de google analytics et mise en
									conformité avec les règles GDPR européennes.
								</p>
							</div>
							<div
								style={{
									alignSelf: 'end',
									textAlign: 'center',
								}}
							>
								<p>
									Conception et déploiement en Ci/Cd sur{' '}
									<a
										href='https://www.netlify.com/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Netlify
									</a>
								</p>
								<div className='flex cardIcons'>
									<SiNextDotJs />
									<SiNetlify />
									<SiJavascript />
									<SiGithub />
								</div>
							</div>
						</div>
						<div className='showcase card'>
							<h2>SimpleLuxe</h2>

							<a
								href='https://simpleluxe.fr'
								target='_blank'
								rel='noopener noreferrer'
								className='imageLink'
							>
								<img
									src='/images/favicon_SimpleLuxe.png'
									alt='Simple luxe favicon'
								/>
							</a>
							<div className='hook--text'>
								<p>
									Site dynamique avec un thème wordpress sur
									mesure.
									<br />
									<br />
									Module de réservation via booking calendar
									(Plugin tiers).
									<br />
									Plugins sur-mesure pour la gestion de
									catégories et des liens internes vers la
									page blog.
									<br />
									<br />
									Site bilingue, géré via le plugin{' '}
									<a
										href='https://polylang.pro/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Polylang
									</a>
									<br />
									<br />
									Installation et mise en place de chat en
									temps réél via{' '}
									<a
										href='https://www.tawk.to/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Tawk.to
									</a>
									<br />
									<br />
									Intégration de google analytics et mise en
									conformité avec les règles GDPR européennes.
								</p>
							</div>
							<div
								style={{
									alignSelf: 'end',
									textAlign: 'center',
								}}
							>
								<p>
									Développement et déploiement sur{' '}
									<a
										href='https://www.ovh.com/fr/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Ovh
									</a>
								</p>
								<div className='flex cardIcons'>
									<SiWordpress />
									<SiOvh />
									<SiPhp />
								</div>
							</div>
						</div>
						<div className='showcase card'>
							<h2>Gabarra films</h2>

							<a
								href='http://gabarra-films.org'
								target='_blank'
								rel='noopener noreferrer'
								className='imageLink'
							>
								<img
									src='http://gabarra-films.org/wp-content/uploads/2017/06/GABARRA-RVB-MARINE02.png'
									alt='Favicon Le Food Shop'
								/>
							</a>
							<div className='hook--text'>
								<p>
									Site dynamique avec un thème wordpress sur
									mesure.
									<br />
									<br />
									Le cinéma l'Atalante avait d'un besoin d'un
									site web pour communiquer sur leur catalogue
									de films basques qu'ils distribuent en
									France
									<br />
									<br />
									Site multilingue, géré via le plugin{' '}
									<a
										href='https://polylang.pro/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Polylang
									</a>
								</p>
							</div>
							<div
								style={{
									alignSelf: 'end',
									textAlign: 'center',
								}}
							>
								<p>
									Développement et déploiement sur{' '}
									<a
										href='https://www.ovh.com/fr/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Ovh
									</a>
								</p>
								<div className='flex cardIcons'>
									<SiWordpress />
									<SiOvh />
									<SiPhp />
								</div>
							</div>
						</div>
						<div className='showcase card'>
							<h2>Proshop (Projet)</h2>
							<a
								href='https://holmes-proshop.herokuapp.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='imageLink'
							>
								<img
									src='/images/proshop - screenshot.png'
									alt="Capture d'écran Proshop"
								/>
							</a>
							<div className='hook-text'>
								<p>
									Projet de site e-commerce largement inspiré
									d'un tutoriel de{' '}
									<a
										href='https://www.traversymedia.com/'
										target='_blank'
										rel='noopener noreferrer'
									>
										Brad Traversy
									</a>
									<br />
									<br />
									Frontend développé avec React.js
									<br />
									Backend avec Express.js et MongoDb
									<br />
									<br />
									Entièrement codé de 0, ce site e-commerce
									vous permet la vente de produits mais
									également la publication d'articles de blog
									auxquels vous pouvez relier des produits en
									vente sur votre site. Implémentation de
									paiement par PayPal
									<br />
									Back office pour la gestion de commandes, la
									création de contenu, messagerie avec les
									clients.
									<br />
									<br />
									Vous pouvez cliquer sur l'image pour visiter
									le site. Il est hébergé sur Heroku avec un
									compte gratuit. L'instance cloud aura besoin
									d'être « réveilée » avant de pouvoir
									répondre à la requête de votre navigateur.
									<br />
									Pour l'instant, il n'est disponible qu'en
									anglais.
								</p>
							</div>
							<div
								style={{
									alignSelf: 'end',
									textAlign: 'center',
								}}
							>
								<p>
									Déploiement en Ci/Cd sur{' '}
									<a
										href='https://www.heroku.com//'
										target='_blank'
										rel='noopener noreferrer'
									>
										Heroku
									</a>
								</p>
								<div className='flex cardIcons'>
									<SiNodeDotJs />
									<SiMongodb />
									<SiReact />
									<SiRedux />
									<SiHeroku />
								</div>
							</div>
						</div>
					</div>
					<hr />
					<div className='container flex'>
						<h3>Retrouvez-moi :</h3>
					</div>
					<div className='container flex contact'>
						<div className='flex socialIcons cardIcons'>
							<a
								href='https://www.linkedin.com/in/samuel-holmes-eh/'
								target='_blank'
								rel='noopener noreferrer'
							>
								<SiLinkedin />
							</a>
							<a
								href='https://github.com/Holmes-EH'
								target='_blank'
								rel='noopener noreferrer'
							>
								<SiGithub />
							</a>
						</div>
					</div>
				</Fragment>
				<Footer />
			</div>
		)
	}
}

export default Homepage
