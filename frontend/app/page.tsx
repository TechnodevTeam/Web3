import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRocket, 
  faUsers, 
  faShieldAlt, 
  faChartLine,
  faCalendarCheck,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
<<<<<<< HEAD
=======

import "./globals.css";

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
export default function HomePage() {
  return (
    <div className="home-page-wrapper">
      <section className="home-page">
          <div className="admin-login-page">
                    <div className="hero-content-card">
                      <h1>Bienvenue sur EventSync</h1>
                      <p>
                        EventSync est une plateforme de gestion d’événements et
                        d’interaction en direct avec les participants.
                      </p>
                      <div className="hero-buttons">
                        <Link href="/events" className="btn-primary">
                          Voir les événements
                        </Link>
                        <Link href="/admin" className="btn-secondary">
                          Espace admin
                        </Link>
                      </div>
                    </div>
          </div>
      </section>
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Pourquoi choisir EventSync ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box blue">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3>Performance Web3</h3>
              <p>Une infrastructure ultra-rapide basée sur les dernières technologies blockchain pour une transparence totale.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box green">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3>Engagement Communautaire</h3>
              <p>Favorisez les interactions entre participants grâce à nos outils de networking intégrés.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box purple">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3>Sécurité Maximale</h3>
              <p>Vos données et transactions sont protégées par des protocoles de chiffrement de pointe.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Événements organisés</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Participants actifs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">120+</span>
              <span className="stat-label">Salles disponibles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfaction client</span>
            </div>
          </div>
        </div>
      </section>
      <section className="info-blocks-section">
        <div className="section-container">
          <div className="info-block">
            <div className="info-text">
              <h2>Gérez vos événements comme un pro</h2>
              <p>Notre plateforme vous offre tous les outils nécessaires pour planifier, promouvoir et analyser vos sessions en temps réel. Que ce soit pour un petit meetup ou une conférence internationale.</p>
              <ul className="info-list">
                <li><FontAwesomeIcon icon={faCalendarCheck} className="li-icon" /> Gestion simplifiée des sessions</li>
                <li><FontAwesomeIcon icon={faChartLine} className="li-icon" /> Statistiques de présence en direct</li>
                <li><FontAwesomeIcon icon={faShieldAlt} className="li-icon" /> Accès sécurisé pour les admins</li>
              </ul>
              <Link href="/events" className="btn-primary">Explorer les outils</Link>
            </div>
            <div className="info-visual">
              <img src="/images/lego.jpg" alt="Dashboard Preview" />
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section">
        <div className="section-container">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4><FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" /> Comment s'inscrire ?</h4>
              <p>Cliquez sur "Espace Admin" pour créer votre compte organisateur ou naviguez dans les événements pour participer.</p>
            </div>
            <div className="faq-item">
              <h4><FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" /> Est-ce gratuit ?</h4>
              <p>La consultation des événements est gratuite pour tous les participants.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
