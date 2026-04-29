"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading ? "Loading…" : "Upgrade to Premium"}
    </Button>
  );
}
