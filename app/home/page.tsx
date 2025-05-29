"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Cookies from 'js-cookie';

const images = [
  "/images/ATS_03_23_2017_09060.jpg",
  "/images/3eb77be0-9558-4efc-8847-1c71bbcea208.webp",
  "/images/ats_knightsbridge-sector_124-noida-ats_infrastructure_limited.jpeg.avif",
  "/images/1.jpg",
];

function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={heroStyles.container}>
      {/* Background Image */}
      <div style={heroStyles.imageWrapper}>
        <Image
          src={images[currentImage]}
          alt="Luxury Property"
          fill
          priority
          quality={90}
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Dark overlay */}
      <div style={heroStyles.overlay}></div>

      {/* Hero Content */}
      <div style={heroStyles.content}>
        <h1 style={heroStyles.heading}>Welcome to The Vera Imperia</h1>
        <p style={heroStyles.subheading}>Ultra-luxury living. Sky-high elegance.</p>
      </div>
    </div>
  );
}

const heroStyles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 1,
    transition: "opacity 0.5s ease-in-out",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 2,
  },
  content: {
    position: "relative",
    zIndex: 3,
    maxWidth: "800px",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "3.8rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "white",
    textShadow: "3px 3px 10px rgba(0, 0, 0, 0.7)",
    letterSpacing: "-1px",
  },
  subheading: {
    fontSize: "1.6rem",
    color: "white",
    textShadow: "1px 1px 6px rgba(0, 0, 0, 0.6)",
    lineHeight: "1.5",
    maxWidth: "600px",
    margin: "0 auto",
  },
};

export default function Home() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Check for session cookie
    const sessionCookie = Cookies.get('user_session');
    if (!sessionCookie) {
      router.push("/");
      return;
    }

    try {
      const userData = JSON.parse(sessionCookie);
      setUserInfo(userData);
    } catch (error) {
      console.error('Error parsing user session:', error);
      router.push("/");
    }
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove('user_session');
    router.push("/");
  };

  return (
    <div style={homeStyles.container}>
      {/* Navbar */}
      <div style={homeStyles.navbar}>
        <div style={homeStyles.navInner}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={homeStyles.brand}>🏛 Vera Imperia</div>
          </Link>
          <div style={homeStyles.navButtons}>
            <Link href="/committee" style={{ textDecoration: "none" }}>
              <button style={homeStyles.navButton}>Committee</button>
            </Link>
            <Link href="/maintenance" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 22px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
              >
                Maintenance
              </button>
            </Link>
            <Link href="/fees" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 22px",
                  backgroundColor: "#6c5ce7",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#5549c0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6c5ce7")
                }
              >
                Fees
              </button>
            </Link>
            <Link href="/feedback" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 22px",
                  backgroundColor: "#ffa502",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e1a100")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffa502")
                }
              >
                Feedback/Complaints
              </button>
            </Link>
            <button onClick={handleLogout} style={homeStyles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Contact Section */}
      <div style={homeStyles.contact}>
        <h3 style={homeStyles.contactHeading}>📞 Contact Us</h3>
        <p style={homeStyles.contactText}>Email: info@veraimperia.com</p>
        <p style={homeStyles.contactText}>Phone: +123 456 7890</p>
        <p style={homeStyles.contactText}>Address: 123 Luxury Avenue, Noida, India</p>
      </div>
    </div>
  );
}

const homeStyles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    position: "relative",
  },
  navbar: {
    backgroundColor: "white",
    borderBottom: "2px solid #eee",
    padding: "15px 20px",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  brand: {
    fontWeight: 600,
    fontSize: "1.6rem",
    color: "#2a2a2a",
  },
  navButtons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  navButton: {
    padding: "10px 22px",
    backgroundColor: "#6c5ce7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  logoutButton: {
    padding: "10px 22px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  contact: {
    backgroundColor: "white",
    padding: "50px 20px",
    textAlign: "center",
    borderTop: "2px solid #eee",
    marginTop: "auto",
  },
  contactHeading: {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#222",
  },
  contactText: {
    fontSize: "1.1rem",
    color: "#444",
    marginBottom: "8px",
  },
};