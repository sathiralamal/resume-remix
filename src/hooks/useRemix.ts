import { useState, useCallback } from "react";
import { RemixResult } from "../types";

interface RemixInput {
  experience: string;
  skills:     string;
  jobDescription: string;
}

export function useRemix() {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [result,   setResult]   = useState<RemixResult | null>(null);

  const remix = useCallback(async (input: RemixInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res  = await fetch("/api/remix", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(input),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { remix, loading, error, result };
}
