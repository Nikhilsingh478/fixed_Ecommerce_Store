import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { signup } from "@/services/authService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;

interface FormState {
  fullname: string;
  emailid: string;
  mobilenumber: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    fullname: "",
    emailid: "",
    mobilenumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "form", string>>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const next: typeof errors = {};
    if (!form.fullname.trim()) next.fullname = "Full name is required";
    if (!form.emailid.trim()) next.emailid = "Email is required";
    else if (!emailRegex.test(form.emailid)) next.emailid = "Enter a valid email";
    if (!form.mobilenumber.trim()) next.mobilenumber = "Mobile number is required";
    else if (!mobileRegex.test(form.mobilenumber)) next.mobilenumber = "Enter a valid 10-digit number";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Minimum 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await signup({
        fullname: form.fullname.trim(),
        emailid: form.emailid.trim(),
        mobilenumber: form.mobilenumber.trim(),
        password: form.password,
        userroleid: 1,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Signup failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join and start shopping"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-foreground hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput label="Full Name" placeholder="John Doe" autoComplete="name" value={form.fullname} onChange={update("fullname")} error={errors.fullname} />
        <AuthInput label="Email" type="email" placeholder="you@example.com" autoComplete="email" value={form.emailid} onChange={update("emailid")} error={errors.emailid} />
        <AuthInput label="Mobile Number" type="tel" inputMode="numeric" placeholder="10-digit number" autoComplete="tel" maxLength={10} value={form.mobilenumber} onChange={update("mobilenumber")} error={errors.mobilenumber} />
        <AuthInput label="Password" type="password" placeholder="At least 6 characters" autoComplete="new-password" value={form.password} onChange={update("password")} error={errors.password} />

        {errors.form && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {errors.form}
          </div>
        )}

        <AuthButton type="submit" loading={loading}>
          {loading ? "Creating..." : "Create Account"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Signup;
