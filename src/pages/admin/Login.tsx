import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/common/Card";
import { FieldWrapper, Input } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setCredentials } from "@/store/slices/authSlice";
import { login } from "@/services/resourceServices";

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await login({ email, password });
      dispatch(setCredentials(res.data));
      const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin/dashboard";
      navigate(from, { replace: true });
    } catch {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়। Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-600 text-white">
            <ShieldCheck size={22} />
          </span>
          <h1 className="text-xl font-bold text-forest-900">Admin Login</h1>
          <p className="text-sm text-slate-500">আমাদের কাঞ্চনা — Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldWrapper label="Email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FieldWrapper>
          <FieldWrapper label="Password" required>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FieldWrapper>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
