"use client";
import type { ReactNode } from "react";
import "./globals.css";
import { usePathname } from "next/navigation";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "@/app/components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faHome, faCalendarAlt, faDoorOpen, faHeart, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
config.autoAddCss = false;
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  return (
    <html lang="fr">
      <body>
        {!isAdminPage && <Navbar />}
        <main className={isAdminPage ? "" : "main-content"}>{children}</main>
        {!isAdminPage && (
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
                  <span className="social-icon" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></span>
                  <span className="social-icon" aria-label="GitHub"><FontAwesomeIcon icon={faGithub} /></span>
                  <span className="social-icon" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></span>
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
                  <Link href="/planning">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    Planning
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
        )}
      </body>
    </html>
  );
}
