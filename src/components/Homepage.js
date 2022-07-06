import {
	SiNextdotjs,
	SiNetlify,
	SiWordpress,
	SiMysql,
	SiOvh,
	SiPhp,
	SiGithub,
	SiJavascript,
	SiLinkedin,
	SiHeroku,
	SiNodedotjs,
	SiMongodb,
	SiReact,
	SiRedux,
	SiExpress,
	SiPython,
} from 'react-icons/si'
import { RiCodeFill, RiCodeSSlashFill } from 'react-icons/ri'
import { useState, useEffect } from 'react'

const Homepage = () => {
	const [show, setShow] = useState(false)
	const [fadeIn, setFadeIn] = useState(false)
	const [firstLoad, setFirstLoad] = useState(true)

	useEffect(() => {
		const display = () => {
			setShow(true)
			setFadeIn(true)
			setFirstLoad(!firstLoad)
		}
		if (firstLoad) {
			setTimeout(function () {
				display()
			}, 4000)
		} else {
			display()
		}
	}, [show, firstLoad])

	const hiddenClass = fadeIn && show ? 'container fadeIn' : 'invisible'

	return (
		<div className={hiddenClass}>
			<>
				<div className='hook'>
					<div className='box'>
						<h1>Développeur Web Full stack</h1>
						<div className='flex'>
							<RiCodeFill />
							<h2>Autodidacte</h2>
							<RiCodeSSlashFill />
						</div>
					</div>
				</div>
				<div className='container flex'>
					<h3>
						Technicien polyvalent et très curieux.
						<br />
						J&apos;ai toujours envie d&apos;apprendre quelque chose
						de nouveau !
					</h3>
				</div>
				<div className='container flex'>
					<div className='hook'>
						<div className='hook--text'>
							<h2>Le stack</h2>
						</div>
						<div className='flex stack'>
							<div className='hook'>
								<SiMongodb />
								MongoDB
							</div>
							<div className='hook'>
								<SiExpress />
								Express
							</div>
							<div className='hook'>
								<SiReact />
								React
							</div>
							<div className='hook'>
								<SiNodedotjs />
								NodeJS
							</div>
							<div className='hook'>
								<SiNextdotjs />
								NextJS
							</div>
							<div className='hook'>
								<SiPython />
								Python
							</div>
							<div className='hook'>
								<SiWordpress />
								WordPress
							</div>
							<div className='hook'>
								<SiMysql />
								MySQL
							</div>
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
								src='/images/favicon_LeFoodShop.png'
								alt='Favicon Le Food Shop'
							/>
						</a>
						<div className='hook-text'>
							<p>
								Site vitrine d&apos;un restaurant streetfood et
								cuisine de bistro indépendant, presque statique.
								<br />
								<br />
								Presque, car toutes les informations de
								biographie / description / contact sont
								statiques, mais le client souhaitait afficher
								six de ses derniers posts instagram en haut de
								page afin de rendre le site plus dynamique de
								façon automatique.
								<br />
								<br />
								Développé avec le framework NextJS / React et
								interroge l&apos;API Graph Instagram Business.
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
								<SiNextdotjs />
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
								Plugins sur-mesure pour la gestion de catégories
								et des liens internes vers la page blog.
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
								Installation et mise en place de chat en temps
								réél via{' '}
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
								src='/images/GABARRA-RVB-MARINE02.png'
								alt='Favicon Gabarra Films'
							/>
						</a>
						<div className='hook--text'>
							<p>
								Site dynamique avec un thème wordpress sur
								mesure.
								<br />
								<br />
								Le cinéma l&apos;Atalante avait d&apos;un besoin
								d&apos;un site web pour communiquer sur leur
								catalogue de films basques qu&apos;ils
								distribuent en France
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
								d&apos;un tutoriel de{' '}
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
								Entièrement codé de 0, ce site e-commerce vous
								permet la vente de produits mais également la
								publication d&apos;articles de blog auxquels
								vous pouvez relier des produits en vente sur
								votre site. Implémentation de paiement par
								PayPal
								<br />
								Back office pour la gestion de commandes, la
								création de contenu, messagerie avec les
								clients.
								<br />
								<br />
								Vous pouvez cliquer sur l&apos;image pour
								visiter le site. Il est hébergé sur Heroku avec
								un compte gratuit. L&apos;instance cloud aura
								besoin d&apos;être « réveilée » avant de pouvoir
								répondre à la requête de votre navigateur.
								<br />
								Pour l&apos;instant, il n&apos;est disponible
								qu&apos;en anglais.
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
								<SiNodedotjs />
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
			</>
		</div>
	)
}

export default Homepage
