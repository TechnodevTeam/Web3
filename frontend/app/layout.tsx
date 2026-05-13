import type { ReactNode } from "react";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Navbar from "@/app/components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faHome, faCalendarAlt, faDoorOpen, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

config.autoAddCss = false;

export const metadata = {
  title: "EventSync",
  description: "Plateforme de gestion d’événements",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />

        <main className="main-content">{children}</main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-container-small">
                  <FontAwesomeIcon icon={faCubes} />
                </div>
                <span>EventSync</span>
              </div>
              <p>Simplifiez la gestion de vos événements avec une expérience moderne et fluide.</p>
              <div className="footer-socials">
                <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#" aria-label="GitHub"><FontAwesomeIcon icon={faGithub} /></a>
                <a href="#" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Navigation</h4>
                <Link href="/">
                  <FontAwesomeIcon icon={faHome} className="footer-nav-icon" />
                  Accueil
                </Link>
                <Link href="/events">
                  <FontAwesomeIcon icon={faCalendarAlt} className="footer-nav-icon" />
                  Événements
                </Link>
                <Link href="/rooms">
                  <FontAwesomeIcon icon={faDoorOpen} className="footer-nav-icon" />
                  Salles
                </Link>
                <Link href="/favorites">
                  <FontAwesomeIcon icon={faHeart} className="footer-nav-icon" />
                  Favoris
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 EventSync - Tous droits réservés</p>
          </div>
        </footer>
      </body>
    </html>
  );
}