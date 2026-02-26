"use client";
import { signIn }  from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email, password,
      redirect: false,
    });
    if (res?.error) setError("Invalid credentials");
    else             router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded shadow-md dark:shadow-gray-800/50 transition-colors">
      <h2 className="text-2xl font-bold text-center dark:text-white">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="user@example.com"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="password"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
        <button 
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
      <div className="text-center text-sm dark:text-gray-400">
        Don't have an account? <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</a>
      </div>
    </div>
  );
}
