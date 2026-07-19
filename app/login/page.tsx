"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (
      email === "admin@madinafastfood.com" &&
      password === "12345678"
    ) {
      localStorage.setItem("adminLoggedIn", "true");

      router.push("/admin");
    } else {
      alert("Invalid Email or Password");
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-8">
          Admin Login
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <button
            onClick={login}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
          >
            Login
          </button>

        </div>

      </div>

    </section>
  );
}