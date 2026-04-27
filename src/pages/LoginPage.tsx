import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 900;

const ERROR_MESSAGES = {
  "ERR-AUTH-401": { title: "Invalid Credentials", description: "The email or password you entered is incorrect. You have {remaining} attempts left." },
  "ERR-VER-404": { title: "Account Not Found", description: "No account exists with this email address. Please register or contact IT." },
  "ERR-AUTH-429": { title: "Account Locked", description: "Too many failed attempts. Your account is temporarily locked for {minutes} minutes." },
  "ERR-NET-503": { title: "Connection Error", description: "Unable to connect to authentication server. Please check your internet connection." },
};

const DEMO_EMAILS = [
  "student@auca.ac.rw",
  "lecturer@auca.ac.rw",
  "hod@auca.ac.rw",
  "moderator@auca.ac.rw",
  "admin@auca.ac.rw",
];

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutDisplay, setLockoutDisplay] = useState("");

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;

  useEffect(() => {
    const interval = setInterval(() => {
      if (lockoutUntil && Date.now() < lockoutUntil) {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        setLockoutDisplay(`${mins}:${secs.toString().padStart(2, "0")}`);
      } else if (lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setLockoutDisplay("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      const mins = Math.ceil((lockoutUntil! - Date.now()) / 60000);
      toast({
        title: ERROR_MESSAGES["ERR-AUTH-429"].title,
        description: ERROR_MESSAGES["ERR-AUTH-429"].description.replace("{minutes}", String(mins)),
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        toast({
          title: ERROR_MESSAGES["ERR-AUTH-429"].title,
          description: "Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.",
          variant: "destructive",
        });
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        const msg = err?.message === "ERR-VER-404"
          ? ERROR_MESSAGES["ERR-VER-404"]
          : {
              title: ERROR_MESSAGES["ERR-AUTH-401"].title,
              description: ERROR_MESSAGES["ERR-AUTH-401"].description.replace("{remaining}", String(remaining)),
            };
        toast({ title: msg.title, description: msg.description, variant: "destructive" });
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background font-sans">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 flex items-center gap-3">
          <img src="/auca-logo.png" alt="AUCA" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-lg font-semibold text-foreground">AUCA Connect</p>
            <p className="text-xs text-muted-foreground">Publication Hub</p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Use your university email and password.</p>

          {isLocked && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Account locked</p>
                <p className="text-xs text-muted-foreground">Try again in {lockoutDisplay}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@auca.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLocked}
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotOpen(true);
                    setForgotSent(false);
                    setForgotEmail("");
                  }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {failedAttempts > 0 && !isLocked && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <Lock className="h-3 w-3 shrink-0" />
                  {MAX_ATTEMPTS - failedAttempts} attempts remaining
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-11 w-full"
              disabled={isLoading || verifying || isLocked}
            >
              {isLoading || verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 opacity-80" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            Demo: any password works. Try{" "}
            {DEMO_EMAILS.map((addr, i) => (
              <React.Fragment key={addr}>
                {i > 0 && ", "}
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => setEmail(addr)}
                >
                  {addr.split("@")[0]}
                </button>
              </React.Fragment>
            ))}
            .
          </p>
        </div>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Enter your university email. You will receive a link if an account exists.
            </DialogDescription>
          </DialogHeader>

          {!forgotSent ? (
            <div className="space-y-4 pt-2">
              <Input
                id="forgot-email"
                type="email"
                placeholder="name@auca.ac.rw"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="h-11"
              />
              <Button onClick={handleForgotPassword} disabled={!forgotEmail} className="w-full">
                Send reset link
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted/50">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Check your email</p>
              <p className="text-sm text-muted-foreground">
                If <span className="font-medium text-foreground">{forgotEmail}</span> is registered, a link will arrive shortly.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setForgotOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
