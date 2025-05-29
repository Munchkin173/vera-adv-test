"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from "next/link";
import Image from "next/image";

interface CommitteeMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  responsibilities: string;
  image: string;
}

export default function Committee() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    // Fetch committee members
    const fetchCommitteeMembers = async () => {
      try {
        const response = await fetch('/api/committee');
        if (!response.ok) {
          throw new Error('Failed to fetch committee members');
        }
        const data = await response.json();
        setCommitteeMembers(data.committeeMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommitteeMembers();
  }, [user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "2px solid #eee",
          padding: "15px 20px",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Left: Home */}
          <Link href="/home" style={{ textDecoration: "none" }}>
            <div style={{ fontWeight: 600, fontSize: "1.3rem", color: "#2a2a2a" }}>Home</div>
          </Link>

          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 22px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Committee Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", textAlign: "center", color: "#333" }}>
          Strata Committee Members
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", margin: "20px auto 40px", color: "#555", textAlign: "center", maxWidth: "800px" }}>
          Our Strata Committee is dedicated to ensuring The Vera Imperia remains a premier residential community. 
          Committee members work diligently to address community concerns, manage finances, and maintain the property to the highest standards.
        </p>

        {/* Members Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" }}>
          {committeeMembers.map((member, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
              {/* Image Block with Zoom Logic */}
              <div style={{ width: "100%", height: "320px", overflow: "hidden" }}>
                <Image
                  src={`/images/${member.image}`}
                  alt={member.name}
                  width={400}
                  height={300}
                  style={{
                    objectFit: member.name === "James Smith" ? "contain" : "cover",
                    objectPosition:
                      member.name === "James Smith"
                        ? "center top"
                        : member.name === "Charlotte Brown"
                        ? "center 10%"
                        : "center center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>

              <div style={{ padding: "25px" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "8px", color: "#333" }}>{member.name}</h3>
                <div style={{ display: "inline-block", padding: "5px 12px", backgroundColor: "#6c5ce7", color: "white", borderRadius: "20px", fontSize: "0.9rem", marginBottom: "15px" }}>
                  {member.role}
                </div>

                <p style={{ marginBottom: "10px", color: "#444" }}>
                  <strong>Email:</strong> {member.email}
                </p>
                <p style={{ marginBottom: "10px", color: "#444" }}>
                  <strong>Phone:</strong> {member.phone}
                </p>

                <h4 style={{ fontWeight: "600", marginTop: "15px", marginBottom: "5px", color: "#444" }}>Responsibilities:</h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#666" }}>
                  {member.responsibilities}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div style={{ backgroundColor: "white", padding: "40px 20px", textAlign: "center", marginTop: "60px", borderTop: "1px solid #eee" }}>
        <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#222" }}>
          Contact The Committee
        </h3>
        <p style={{ fontSize: "1rem", color: "#444", maxWidth: "600px", margin: "0 auto 20px" }}>
          For general inquiries to the Strata Committee, please use the contact details below:
        </p>
        <p style={{ fontSize: "1rem", color: "#444" }}>Email: committee@veraimperia.com</p>
        <p style={{ fontSize: "1rem", color: "#444" }}>Phone: +91 98765 40000</p>
        <p style={{ fontSize: "1rem", color: "#444", marginTop: "20px" }}>
          The committee meets on the first Monday of every month at 7:00 PM in the Community Hall.
        </p>
      </div>
    </div>
  );
}
