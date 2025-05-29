export default function ThankYouPage() {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontFamily: "'Poppins', sans-serif" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#28a745", marginBottom: "1rem" }}>
          Request Submitted!!
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#333" }}>
          Thank you for your submission. Our maintenance team will contact you shortly.
        </p>
        <a
          href="/home"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            padding: "0.9rem 2.2rem",
            background: "#2b6cb0",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "background 0.2s",
          }}
        >
          Home
        </a>
      </div>
    );
  }
  