import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Auth() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [residence, setResidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        nav("/dashboard");
      } else {
        await signup(email, password, fullName, gender, residence);
        nav("/dashboard");
      }
    } catch (err) {
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 dark:bg-none dark:bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
        {/* Background decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-300/30 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="max-w-md w-full relative z-10"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl py-10 px-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/60 dark:border-slate-700/50 transition-colors duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight pb-1">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                {isLogin ? "Sign in to your account" : "Join Roommate Matcher today"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 dark:text-slate-100"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required={!isLogin}
                      className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Residence</label>
                    <select
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      required={!isLogin}
                      className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
                    >
                      <option value="" disabled>Select Residence</option>
                      <option value="Uniworld-1">Uniworld-1</option>
                      <option value="Uniworld-2">Uniworld-2</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wide">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 flex justify-center rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/25 transform text-lg mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-violet-700 hover:to-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  isLogin ? "Log In" : "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                  setGender("");
                  setResidence("");
                }} 
                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-bold underline decoration-2 underline-offset-4"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Auth;
