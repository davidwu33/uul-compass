"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call Supabase auth.signInWithOtp({ email })
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[oklch(0.22_0.06_250)] via-[oklch(0.18_0.04_250)] to-[oklch(0.15_0.03_260)]">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[oklch(0.65_0.15_195)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[oklch(0.55_0.12_250)]/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm border-border/20 shadow-2xl shadow-black/20 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-10 pb-8 px-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Check your email</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  We sent a login link to
                </p>
                <p className="text-sm font-medium mt-0.5">{email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSent(false)}
                className="mt-2 text-xs"
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                    <Compass className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
                <h1 className="text-xl font-bold tracking-tight">UUL Compass</h1>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Post-Merger Command Center
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 text-sm"
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-sm font-medium gap-2">
                  Send Magic Link
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-[11px] text-center text-muted-foreground mt-6">
                Invitation-only access. Contact Jerry for an invite.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
