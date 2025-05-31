"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpWithEmail, setSignUpWithEmail] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Check for existing session cookie
    const sessionCookie = Cookies.get('user_session');
    if (sessionCookie) {
      router.push("/home");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      Cookies.set('user_session', JSON.stringify({
        id: user.id,
        email: user.email,
        lastLogin: new Date().toISOString()
      }), { 
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
      router.push("/home");
    }
  }, [user, router]);

  useEffect(() => {
    // Check if Supabase client is initialized
    if (supabase) {
      setIsClientReady(true);
      console.log('Supabase client initialized');
    }
  }, [supabase]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Supabase error object:", error);
      const fallbackMessage =
        error.status === 400
          ? "Invalid login. Please check your email and password."
          : "Login failed. Please try again.";
      setError(error.message || fallbackMessage);
      return;
    }

    // Set session cookie with user info
    if (data.user) {
      Cookies.set('user_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        lastLogin: new Date().toISOString()
      }), { 
        expires: 7, // Cookie expires in 7 days
        secure: true, // Only sent over HTTPS
        sameSite: 'strict' // Protect against CSRF
      });
    }
    
    router.push("/home");
  };

  const handleGoogleLogin = async () => {
    if (!isClientReady) {
      console.log('Waiting for Supabase client to initialize...');
      setError("Please wait a moment and try again.");
      return;
    }

    try {
      console.log('Starting Google login process...');
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        setError(error.message || "Google sign-in failed.");
        return;
      }
      
      console.log('Google sign-in successful:', data);
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err);
      setError("An unexpected error occurred during sign-in.");
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    try {
      console.log('Starting sign up process...');
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            signup_date: new Date().toISOString(),
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error cases
        if (error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("already exists") ||
            error.message.toLowerCase().includes("user exists")) {
          setError("This email is already registered. Please log in or use a different email.");
        } else if (error.message.toLowerCase().includes("invalid email")) {
          setError("Please enter a valid email address.");
        } else if (error.message.toLowerCase().includes("password")) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(`Sign up failed: ${error.message}`);
        }
        return;
      }

      // Check if signup was successful
      if (data?.user) {
        console.log('Sign up successful:', data);
        // Set session cookie for new user
        Cookies.set('user_session', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          lastLogin: new Date().toISOString()
        }), { 
          expires: 7,
          secure: true,
          sameSite: 'strict'
        });
        
        setError("Check your email for a confirmation link!");
      } else {
        console.error('No user data returned from signup');
        setError("Sign up completed but no user data was returned. Please try logging in.");
      }
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setError("An unexpected error occurred during sign up. Please try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Remove session cookie
    Cookies.remove('user_session');
    setTimeout(() => {
      router.push("/");
    }, 100);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          Welcome to <em style={styles.brandEmphasis}>The Vera Imperia</em>
        </h2>
        <p style={styles.subheading}>
          Luxury living awaits — please login to continue
        </p>
        <p style={{ textAlign: "center", color: "#4a5568", fontSize: "0.95rem", marginTop: "-1rem", marginBottom: "1.5rem" }}>
          <strong>{isSignUp ? "Sign up" : "Login"}:</strong>
        </p>
        {error && <p style={styles.error}>{typeof error === "string" ? error : JSON.stringify(error)}</p>}
        {isSignUp ? (
          <>
            <form onSubmit={handleSignUp} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.button}>
                Sign up with Email
              </button>
            </form>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(false); setError(""); }}
                style={{ 
                  color: '#2b6cb0', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '1rem',
                  padding: '0'
                }}
              >
                Login
              </button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleEmailLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.button}>
                Sign in with Email
              </button>
            </form>
            <div style={{ textAlign: "center", margin: "1rem 0" }}>or</div>
            <button onClick={handleGoogleLogin} style={styles.button}>
              Sign in with Google
            </button>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              Don&apos;t have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(true); setError(""); }}
                style={{ 
                  color: '#2b6cb0', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '1rem',
                  padding: '0'
                }}
              >
                Sign up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Inline CSS Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Soft overlay + background image
    background: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/Background_image.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "'Montserrat', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 1)",
    backdropFilter: "blur(8px)",
    padding: "3rem",
    borderRadius: "20px",
    maxWidth: "480px",
    width: "90%",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
    color: "#2d3748",
    transition: "transform 0.3s ease",
  },
  heading: {
    fontSize: "2.4rem",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "#1a365d",
    letterSpacing: "-0.5px",
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: "italic",
  },
  brandEmphasis: {
    fontStyle: "normal", // keep the "The Vera Imperia" text not slanted
    color: "#2b6cb0",
  },
  subheading: {
    fontSize: "1.05rem",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#4a5568",
    fontStyle: "italic",
  },
  error: {
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "rgba(229, 62, 62, 0.1)",
  },
  form: {
    marginTop: "1rem",
  },
  inputGroup: {
    marginBottom: "1.75rem",
  },
  label: {
    display: "block",
    marginBottom: "0.75rem",
    fontWeight: 500,
    color: "#4a5568",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "1rem 1.25rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "1.05rem",
    backgroundColor: "#f8fafc",
    color: "#2d3748",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "1.1rem",
    background: "linear-gradient(90deg, #4299e1, #3182ce)",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(66, 153, 225, 0.2)",
    transition: "all 0.3s ease",
  },
};