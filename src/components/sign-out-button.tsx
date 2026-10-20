"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  async function signOut() {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setErrorMessage("Supabase is not configured. Sign out is unavailable.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.replace("/");
    router.refresh();
  }
  return (
    <div className="flex flex-col items-end">
      <Button variant="outline" size="sm" type="button" onClick={signOut}>Sign out</Button>
      {errorMessage && <span role="alert" className="mt-1 max-w-48 text-xs text-destructive">{errorMessage}</span>}
    </div>
  );
}
