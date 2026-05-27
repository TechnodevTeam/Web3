"use client";
import Link from "next/link";
import "./favorites.css";

export default function FavoritesPage() {
  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <Link href="/" className="back-link">
          ←
        </Link>
        <h1>Mes Favoris</h1>
      </div>

      {/* Page intentionally left blank */}
      <div className="favorites-blank" />
    </section>
  );
    }
