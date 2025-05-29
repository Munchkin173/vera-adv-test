"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie';

export default function Feedback() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    fetchFeedbacks();
  }, [user, router]);

  const fetchFeedbacks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_on', { ascending: false });
    if (!error) setFeedbacks(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!user) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    if (!message) {
      setError("Please enter your feedback or complaint.");
      return;
    }

    const { error } = await supabase
      .from('feedback')
      .insert([{
        user_id: user.id,
        message,
        category,
      }]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setMessage("");
      setCategory("");
      fetchFeedbacks();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove('user_session');
    router.push("/");
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      {/* Navbar */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "2px solid #eee",
        padding: "15px 20px",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Link href="/home" style={{ textDecoration: "none" }}>
            <div style={{ fontWeight: 600, fontSize: "1.6rem", color: "#2a2a2a" }}>Home</div>
          </Link>
          <button onClick={handleLogout} style={{
            padding: "10px 22px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}>
            Logout
          </button>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: "100px auto 0", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: 16 }}>Feedback & Complaints</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }}
            >
              <option value="">-- Select Category --</option>
              <option value="general">General Feedback</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Your Feedback or Complaint *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ width: "100%", minHeight: 80, padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }}
              required
            />
          </div>
          {error && <div style={{ color: "#c53030", marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: "#2f855a", marginBottom: 12 }}>Feedback submitted successfully!</div>}
          <button type="submit" style={{ padding: "10px 24px", background: "#2b6cb0", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
            Submit
          </button>
        </form>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 12 }}>Your Previous Feedback</h2>
        {feedbacks.length === 0 ? (
          <p style={{ color: "#888" }}>No feedback submitted yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Date</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Category</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Message</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(fb => (
                <tr key={fb.id}>
                  <td style={{ padding: 8 }}>{new Date(fb.submitted_on).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{fb.category}</td>
                  <td style={{ padding: 8 }}>{fb.message}</td>
                  <td style={{ padding: 8 }}>{fb.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
