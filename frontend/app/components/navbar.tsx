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
        <Link 
          href="/" 
          onClick={closeMenu}
          className={isActive('/') ? 'active-link' : ''}
        >
          Accueil
        </Link>

        <Link 
          href="/events" 
          onClick={closeMenu}
          className={isActive('/events') ? 'active-link' : ''}
        >
          Événements
        </Link>

        <Link 
          href="/rooms" 
          onClick={closeMenu}
          className={isActive('/rooms') ? 'active-link' : ''}
        >
          Salles
        </Link>

        <Link 
          href="/speakers" 
          onClick={closeMenu}
          className={isActive('/speakers') ? 'active-link' : ''}
        >
          Intervenants
        </Link>

        <Link 
          href="/planning"
          onClick={closeMenu}
          className={isActive('/planning') ? 'active-link' : ''}
        >
          Planning
        </Link>

        <Link 
          href="/favorites" 
          onClick={closeMenu}
          className={isActive('/favorites') ? 'active-link' : ''}
        >
          Favoris
        </Link>

        <Link 
          href="http://localhost:5173/#/login" 
          onClick={closeMenu}
          className={isActive('/admin') ? 'active-link' : ''}
        >
          <button className="admin-button">
            <big>Admin</big>
          </button>
        </Link>
      </nav>
    </header>
  );
}
