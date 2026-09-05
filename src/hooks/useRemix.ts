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
      // Return error for caller if needed (requires changing signature, but for now state is enough triggers useEffect)
      if (!json.success) {
        // Propagate guardrail violation code so dashboard can show specific UI
        if (json.guardrailViolation) {
          throw new Error(`GUARDRAIL_VIOLATION:${json.error}`);
        }
        throw new Error(json.error ?? "Something went wrong");
      }

      setResult(json.data as RemixResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return { remix, loading, error, result };
}
