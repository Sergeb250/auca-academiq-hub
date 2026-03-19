import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff, BookOpen, Loader2, Mail, Phone, X, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 900; // 15 minutes

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  "ERR-VER-404": {
    title: "ERR-VER-404",
    description: "Your ID was not found in the AUCA campus database. Contact ICT support if you believe this is an error.",
  },
  "ERR-AUTH-401": {
    title: "ERR-AUTH-401",
    description: "Incorrect password. You have {remaining} attempts remaining before your account is temporarily locked.",
  },
  "ERR-AUTH-429": {
    title: "ERR-AUTH-429",
    description: "Account temporarily locked. Please try again in {minutes} minutes.",
  },
};

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

  // Update lockout timer display
  useState(() => {
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
  });

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
    // In real app, would call API
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary/5">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A4B8C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <img
            src="/auca-logo.png"
            alt="Adventist University of Central Africa Logo"
            className="w-24 h-24 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-heading font-bold text-foreground">
            AUCA Connect
          </h1>
          <p className="text-lg font-heading font-semibold text-primary">
            Publication Hub
          </p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            "Preserving Knowledge. Enabling Discovery."
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl border border-border card-shadow p-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Sign In to Your Account
            </h2>
          </div>

          {/* Lockout Warning */}
          {isLocked && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Account Temporarily Locked</p>
                <p className="text-destructive/80 text-xs mt-0.5">Try again in {lockoutDisplay}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                University Email or Campus ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@auca.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLocked}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {failedAttempts > 0 && !isLocked && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {MAX_ATTEMPTS - failedAttempts} attempt{MAX_ATTEMPTS - failedAttempts !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>

            {/* Verification Badge */}
            {(isLoading || verifying) && (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm">
                <Shield className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-muted-foreground">Verifying campus identity...</span>
                <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isLoading || verifying || isLocked}
            >
              {isLoading || verifying ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying campus identity...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Campus Verification Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium">Secured by AUCA Campus Identity Verification</span>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              onClick={() => { setForgotOpen(true); setForgotSent(false); setForgotEmail(""); }}
              className="text-secondary hover:underline"
            >
              Forgot password?
            </button>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Help Desk
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs space-y-1 max-w-[220px]">
                <p className="font-semibold">ICT Help Desk</p>
                <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> ict.helpdesk@auca.ac.rw</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> +250 788 000 000</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Accounts (any password):</p>
            <p>student@auca.ac.rw · lecturer@auca.ac.rw</p>
            <p>moderator@auca.ac.rw · admin@auca.ac.rw</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 AUCA Connect Publication Hub — Adventist University of Central Africa | Internal Use Only
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Reset Password</DialogTitle>
            <DialogDescription>
              Enter your university email address. If the account exists, we'll send a reset link.
            </DialogDescription>
          </DialogHeader>

          {!forgotSent ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">University Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="name@auca.ac.rw"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                For security, we do not reveal whether an account exists for a given email address.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setForgotOpen(false)}>Cancel</Button>
                <Button onClick={handleForgotPassword} disabled={!forgotEmail}>
                  Send Reset Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-success" />
              </div>
              <p className="text-sm text-foreground font-medium">Check your email</p>
              <p className="text-xs text-muted-foreground">
                If an AUCA account exists for <strong>{forgotEmail}</strong>, a password reset link has been sent.
              </p>
              <Button variant="outline" onClick={() => setForgotOpen(false)} className="mt-2">
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
