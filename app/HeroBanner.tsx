"use client";
import styles from './HeroBanner.module.css';
import React, { useState, useEffect } from "react";
import Image from "next/image";

const images: string[] = [
  "/images/ATS_03_23_2017_09060.jpg",
  "/images/3eb77be0-9558-4efc-8847-1c71bbcea208.webp",
  "/images/ats_knightsbridge-sector_124-noida-ats_infrastructure_limited.jpeg.avif",
  "/images/1.jpg",
];

const HeroBanner: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev: number) => (prev + 1) % images.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 500); // Adding delay before transitioning
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Image
          src={images[currentImage]}
          alt="Luxury Property"
          fill
          priority
          quality={90}
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2,
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "800px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "white",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
          }}
        >
          Welcome to The Vera Imperia
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            color: "white",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          Experience ultra-luxury living with breathtaking skyline views and
          world-class amenities.
        </p>
      </div>

      {/* Indicator Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 4,
        }}
      >
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor:
                currentImage === index
                  ? "white"
                  : "rgba(255, 255, 255, 0.5)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner; 