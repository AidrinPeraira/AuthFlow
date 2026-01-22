"use client";

import { getProtectedDashboard } from "@/actions/LoginActions";
import React, { useState } from "react";

export default function ServerAuthPage() {
  const [status, setStatus] = useState<string>(
    "Response messages will appear here...",
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckAccess = async () => {
    setLoading(true);

    const result = await getProtectedDashboard();

    if (result.success) {
      setStatus(JSON.stringify(result.data, null, 2));
      setIsError(false);
    } else {
      setStatus(result.message);
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.header}>Server-Side Auth Demo</h1>

      <div style={styles.controls}>
        <button
          onClick={handleCheckAccess}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Access Protected Route (via Server)"}
        </button>
      </div>

      <div
        style={{
          ...styles.status,
          borderColor: isError ? "#ef4444" : "#10b981",
          color: isError ? "#b91c1c" : "#065f46",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{status}</pre>
      </div>
    </main>
  );
}

// ... styles remain the same

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "-apple-system, sans-serif",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#111827",
  },
  controls: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
  },
  status: {
    padding: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f9fafb",
    minHeight: "80px",
    borderRadius: "8px",
    fontSize: "14px",
  },
};
