import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await login(email, password);
    } catch {
      toast({
        title: "Verification Failed",
        description: "Your ID was not found in the AUCA database. Use: student@auca.ac.rw, lecturer@auca.ac.rw, moderator@auca.ac.rw, or admin@auca.ac.rw",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
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
            </div>

            {/* Verification Badge */}
            {(isLoading || verifying) && (
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 text-sm">
                <Shield className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-muted-foreground">Campus Identity Verification...</span>
                <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isLoading || verifying}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button className="text-secondary hover:underline">Forgot password?</button>
            <button className="text-muted-foreground hover:text-foreground">Help Desk</button>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
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
    </div>
  );
};

export default LoginPage;
