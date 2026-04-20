import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/dashboard");
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 dark:bg-none dark:bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
        {/* Background decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-300/30 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl py-10 px-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/60 dark:border-slate-700/50 transition-colors duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight pb-1">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 flex justify-center rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 text-lg mt-4"
            >
              Log In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;