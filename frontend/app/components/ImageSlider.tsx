"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
const sliderImages = [
  "/images/lego.jpg",
  "/images/oip.webp",
  "/images/image.png",
  "/images/concert.png"
];
export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const isLastSlide = currentIndex === sliderImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  return (
    <div className="slider-container">
      {sliderImages.map((img, index) => (
        <div
          key={index}
          className={`slider-slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url("${img}")` }}
        />
      ))}
      <div className="slider-overlay">
        <button
          className="slider-arrow left"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
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
            <Link href="/admin/login" className="btn-secondary">
              Espace admin
            </Link>
          </div>
        </div>
        <button
          className="slider-arrow right"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
