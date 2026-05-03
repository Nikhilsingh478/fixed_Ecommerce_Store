import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import api from "@/services/apiClient";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!emailRegex.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Login clicked");
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post("/login", null, {
        headers: {
          emailId: email.trim(),
          password,
        },
      });

      console.log("Login API response:", response.data);

      localStorage.setItem("emailId", email.trim());
      localStorage.setItem("password", password);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ form: "Invalid credentials" });
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login to your account"
      subtitle="Welcome back, please sign in"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-foreground hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {errors.form && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {errors.form}
          </div>
        )}

        <AuthButton type="submit" loading={loading}>
          {loading ? "Signing in..." : "Login"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Login;
