"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarAlt,
  faDoorOpen,
  faHeart,
  faUserShield,
  faCubes,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from 'next/navigation';
import "./navbar.css";

export default function Navbar() {
  
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  // ✅ AJOUT : Fonction pour vérifier si un lien est actif
  // Exact match pour la page d'accueil, startsWith pour les autres
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link href="/" onClick={closeMenu}>
          <div className="logo-container">
            <FontAwesomeIcon icon={faCubes} className="logo-icon" />
          </div>
          <span className="logo-text">EventSync</span>
        </Link>
      </div>

      <button className="menu-button" onClick={toggleMenu}>
        {isOpen ? "✕" : "☰"}
      </button>

      <nav className={isOpen ? "nav-links active" : "nav-links"}>
        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Accueil */}
        <Link 
          href="/" 
          onClick={closeMenu}
          className={isActive('/') ? 'active-link' : ''}
        >
          Accueil
        </Link>

        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Événements */}
        <Link 
          href="/events" 
          onClick={closeMenu}
          className={isActive('/events') ? 'active-link' : ''}
        >
          Événements
        </Link>

        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Salles */}
        <Link 
          href="/rooms" 
          onClick={closeMenu}
          className={isActive('/rooms') ? 'active-link' : ''}
        >
          Salles
        </Link>

        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Planning */}
        <Link 
          href="/planning"
          onClick={closeMenu}
          className={isActive('/planning') ? 'active-link' : ''}
        >
          Planning
        </Link>

        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Favoris */}
        <Link 
          href="/favorites" 
          onClick={closeMenu}
          className={isActive('/favorites') ? 'active-link' : ''}
        >
          Favoris
        </Link>

        {/* ✅ MODIFICATION : Ajout de className conditionnel pour Admin */}
        <Link 
          href="/admin" 
          onClick={closeMenu}
          className={isActive('/admin') ? 'active-link' : ''}
        >
          <button className="admin-button">
            <big>
                Admin
            </big>
          </button>
        </Link>
      </nav>
    </header>
  );
}