"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
setLoading(true);
setError("");

const fd = new FormData(e.currentTarget);
const result = await signIn("credentials", {
email: fd.get("email"),
password: fd.get("password"),
redirect: false,
});

if (result?.error) {
setError("Email atau password salah.");
setLoading(false);
} else {
router.push("/admin/dashboard");
}
}

return (
<div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
<div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
<h1
className="text-3xl font-light text-center mb-2"
style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
>
Undangan Digital
</h1>
<p className="text-sm text-center text-[#6b6560] mb-8">
Dashboard Mempelai
</p>

<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="block text-sm text-[#6b6560] mb-1">Email</label>
<input
name="email"
type="email"
required
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
<div>
<label className="block text-sm text-[#6b6560] mb-1">
Password
</label>
<input
name="password"
type="password"
required
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>

{error && (
<p className="text-red-500 text-sm text-center">{error}</p>
)}

<button
type="submit"
disabled={loading}
className="w-full py-2 rounded-lg text-white text-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)]"
>
{loading ? "Masuk..." : "Masuk"}
</button>
</form>
</div>
</div>
);
}
