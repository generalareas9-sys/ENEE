"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabase } from "@/lib/supabase/browser";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().trim().min(2, "Enter at least 2 characters.").max(80),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function FieldError({ children }: { children?: string }) {
  return children ? <p role="alert" className="mt-1 text-sm font-medium text-destructive">{children}</p> : null;
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = getBrowserSupabase();
  const isRegister = mode === "register";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  async function submitLogin(values: LoginValues) {
    setMessage("");
    setErrorMessage("");
    if (!supabase) {
      setErrorMessage("Supabase is not configured yet. Copy .env.example to .env.local and add your project URL and publishable key.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  async function submitRegister(values: RegisterValues) {
    setMessage("");
    setErrorMessage("");
    if (!supabase) {
      setErrorMessage("Supabase is not configured yet. Copy .env.example to .env.local and add your project URL and publishable key.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { display_name: values.displayName } },
    });
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    setMessage("Registration submitted. If email confirmation is enabled in Supabase, check your inbox to finish creating your account.");
  }

  const busy = isRegister ? registerForm.formState.isSubmitting : loginForm.formState.isSubmitting;

  return (
    <div className="space-y-5">
      {isRegister ? (
        <form className="space-y-5" onSubmit={registerForm.handleSubmit(submitRegister)} noValidate>
          <div>
            <Label htmlFor="displayName">Your name</Label>
            <Input id="displayName" autoComplete="name" className="mt-2" aria-invalid={Boolean(registerForm.formState.errors.displayName)} {...registerForm.register("displayName")} />
            <FieldError>{registerForm.formState.errors.displayName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="register-email">Email address</Label>
            <Input id="register-email" type="email" autoComplete="email" className="mt-2" aria-invalid={Boolean(registerForm.formState.errors.email)} {...registerForm.register("email")} />
            <FieldError>{registerForm.formState.errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="register-password">Password</Label>
            <Input id="register-password" type="password" autoComplete="new-password" className="mt-2" aria-invalid={Boolean(registerForm.formState.errors.password)} {...registerForm.register("password")} />
            <FieldError>{registerForm.formState.errors.password?.message}</FieldError>
            <p className="mt-1 text-xs text-muted-foreground">Use at least 8 characters.</p>
          </div>
          <Button className="w-full" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={loginForm.handleSubmit(submitLogin)} noValidate>
          <div>
            <Label htmlFor="login-email">Email address</Label>
            <Input id="login-email" type="email" autoComplete="email" className="mt-2" aria-invalid={Boolean(loginForm.formState.errors.email)} {...loginForm.register("email")} />
            <FieldError>{loginForm.formState.errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" autoComplete="current-password" className="mt-2" aria-invalid={Boolean(loginForm.formState.errors.password)} {...loginForm.register("password")} />
            <FieldError>{loginForm.formState.errors.password?.message}</FieldError>
          </div>
          <Button className="w-full" type="submit" disabled={busy}>{busy ? "Signing in…" : "Log in"}</Button>
        </form>
      )}
      {message && <p role="status" className="rounded-xl bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">{message}</p>}
      {errorMessage && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive">{errorMessage}</p>}
    </div>
  );
}
