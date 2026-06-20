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
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  function toggleMenu() {
    setIsOpen(!isOpen);
  }
  function closeMenu() {
    setIsOpen(false);
  }
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
        <Link href="/" onClick={closeMenu}>
          <FontAwesomeIcon icon={faHome} className="nav-icon" />
          Accueil
        </Link>
        <Link href="/events" onClick={closeMenu}>
          <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
          Événements
        </Link>
        <Link href="/rooms" onClick={closeMenu}>
          <FontAwesomeIcon icon={faDoorOpen} className="nav-icon" />
          Salles
        </Link>
        <Link href="/planning">
          <FontAwesomeIcon icon={faCalendarDays} />
          Planning
        </Link>
        <Link href="/favorites" onClick={closeMenu}>
          <FontAwesomeIcon icon={faHeart} className="nav-icon" />
          Favoris
        </Link>
<<<<<<< HEAD
        <Link href="/admin/login" onClick={closeMenu}>
=======

        <Link href="/admin" onClick={closeMenu}>
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
          <FontAwesomeIcon icon={faUserShield} className="nav-icon" />
          Admin
        </Link>
      </nav>
    </header>
  );
}
