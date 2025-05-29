"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from "next/link";
import Cookies from 'js-cookie';

export default function Fees() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    fetchPaymentHistory();
  }, [user, router]);

  const fetchPaymentHistory = async () => {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      return;
    }

    setPaymentHistory(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!user) {
      setError("You must be logged in to make a payment");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .insert([
          {
            user_id: user.id,
            service_type: selectedService,
            amount: parseFloat(amount),
            account_number: accountNumber,
            card_number: cardNumber.replace(/\s/g, '').slice(-4), // Store only last 4 digits
            card_name: cardName,
            status: 'completed'
          }
        ])
        .select();

      if (error) throw error;

      setSuccess(true);
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardName("");
      setSelectedService("");
      setAmount("");
      setAccountNumber("");
      
      // Refresh payment history
      fetchPaymentHistory();

    } catch (error: any) {
      setError(error.message || "Payment failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove('user_session');
    router.push("/");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navInner}>
          <Link href="/home" style={{ textDecoration: "none" }}>
            <div style={styles.brand}>🏛 Vera Imperia</div>
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.formContainer}>
        <h1 style={styles.formHeading}>Service Fee Payment</h1>
        <p style={styles.formSubheading}>
          Please enter your debit card details and select the service you wish to pay for.
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            Payment processed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Service Selection */}
          <div style={styles.inputGroup}>
            <label htmlFor="service" style={styles.label}>
              Service Type *
            </label>
            <select 
              id="service" 
              required 
              style={styles.input}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">-- Select Service --</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="appliance">Appliance Repair</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="pest">Pest Control</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Account Number */}
          <div style={styles.inputGroup}>
            <label htmlFor="accountNumber" style={styles.label}>
              Account Number *
            </label>
            <input
              id="accountNumber"
              type="text"
              required
              placeholder="Enter your account number"
              style={styles.input}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div style={styles.inputGroup}>
            <label htmlFor="amount" style={styles.label}>
              Amount *
            </label>
            <input
              id="amount"
              type="number"
              required
              placeholder="Enter amount"
              style={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Card Details */}
          <div style={styles.inputGroup}>
            <label htmlFor="cardNumber" style={styles.label}>
              Debit Card Number *
            </label>
            <input
              id="cardNumber"
              type="text"
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              style={styles.input}
              value={cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                setCardNumber(formatted);
              }}
            />
          </div>

          <div style={styles.cardDetailsRow}>
            <div style={styles.cardDetailGroup}>
              <label htmlFor="expiryDate" style={styles.label}>
                Expiry Date (MM/YY) *
              </label>
              <input
                id="expiryDate"
                type="text"
                required
                placeholder="MM/YY"
                maxLength={5}
                style={styles.input}
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    const formatted = value.replace(/(\d{2})/, '$1/');
                    setExpiryDate(formatted);
                  }
                }}
              />
            </div>

            <div style={styles.cardDetailGroup}>
              <label htmlFor="cvv" style={styles.label}>
                CVV *
              </label>
              <input
                id="cvv"
                type="text"
                required
                placeholder="123"
                maxLength={3}
                style={styles.input}
                value={cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCvv(value);
                }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="cardName" style={styles.label}>
              Name on Card *
            </label>
            <input
              id="cardName"
              type="text"
              required
              placeholder="Enter name as it appears on card"
              style={styles.input}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Pay Now
          </button>
        </form>

        {/* Payment History */}
        <div style={styles.paymentHistory}>
          <h2 style={styles.historyHeading}>Payment History</h2>
          {paymentHistory.length > 0 ? (
            <div style={styles.historyTable}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Service</th>
                    <th style={styles.tableHeader}>Amount</th>
                    <th style={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td style={styles.tableCell}>
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>{payment.service_type}</td>
                      <td style={styles.tableCell}>${payment.amount}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          color: payment.status === 'completed' ? '#28a745' : '#ffc107',
                          fontWeight: '500'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.noHistory}>No payment history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Montserrat', sans-serif",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
    paddingBottom: "40px",
  },
  navbar: {
    backgroundColor: "white",
    borderBottom: "2px solid #eee",
    padding: "15px 20px",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontWeight: 600,
    fontSize: "1.6rem",
    color: "#2a2a2a",
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
  formContainer: {
    maxWidth: "800px",
    margin: "100px auto 0",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
  formHeading: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#2d3748",
  },
  formSubheading: {
    textAlign: "center",
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#4a5568",
    fontStyle: "italic",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  cardDetailsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  cardDetailGroup: {
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
    color: "#4a5568",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
  },
  success: {
    backgroundColor: "#f0fff4",
    color: "#2f855a",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #9ae6b4",
  },
  paymentHistory: {
    marginTop: "40px",
    paddingTop: "40px",
    borderTop: "1px solid #e2e8f0",
  },
  historyHeading: {
    fontSize: "1.5rem",
    color: "#2d3748",
    marginBottom: "20px",
  },
  historyTable: {
    overflowX: "auto",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#4a5568",
    borderBottom: "2px solid #e2e8f0",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#4a5568",
  },
  noHistory: {
    textAlign: "center",
    color: "#718096",
    fontStyle: "italic",
  },
};