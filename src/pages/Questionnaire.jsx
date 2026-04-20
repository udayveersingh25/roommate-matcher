import { useState } from "react";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Questionnaire() {
    const { user } = useAuth();
    const nav = useNavigate();

    const [formData, setFormData] = useState({
        sleep: 5,
        cleanliness: 5,
        noise: 5,
        social: 5,
        study: 5,
        food: 0
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: Number(e.target.value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                profile: formData
            });
            nav("/matches");
            alert("Profile saved!");

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 dark:bg-none dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative overflow-hidden transition-colors duration-500">
            {/* blobs */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-200/30 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-2xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/80 dark:border-slate-700/50 p-8 sm:p-12 relative z-10 transition-colors duration-500"
            >
                <div className="mb-10 text-center border-b border-slate-200/60 dark:border-slate-700/60 pb-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight pb-1">Roommate Preferences</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-medium">Tell us about your lifestyle to find the perfect match.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-7">
                        <div className="flex flex-col group">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                <span className="uppercase tracking-wider text-[11px]">Sleep Schedule</span>
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">{formData.sleep} / 10</span>
                            </label>
                            <input type="range" name="sleep" min="1" max="10" value={formData.sleep} onChange={handleChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all hover:bg-slate-300" />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase"><span className="text-indigo-500">Early Bird</span><span className="text-purple-500">Night Owl</span></div>
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                <span className="uppercase tracking-wider text-[11px]">Cleanliness</span>
                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs">{formData.cleanliness} / 10</span>
                            </label>
                            <input type="range" name="cleanliness" min="1" max="10" value={formData.cleanliness} onChange={handleChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 transition-all hover:bg-slate-300" />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase"><span className="text-violet-500">Messy</span><span className="text-fuchsia-500">Neat Freak</span></div>
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                <span className="uppercase tracking-wider text-[11px]">Noise Tolerance</span>
                                <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full text-xs">{formData.noise} / 10</span>
                            </label>
                            <input type="range" name="noise" min="1" max="10" value={formData.noise} onChange={handleChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 transition-all hover:bg-slate-300" />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase"><span className="text-fuchsia-500">Strictly Quiet</span><span className="text-pink-500">Loud</span></div>
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                <span className="uppercase tracking-wider text-[11px]">Social Level</span>
                                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">{formData.social} / 10</span>
                            </label>
                            <input type="range" name="social" min="1" max="10" value={formData.social} onChange={handleChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500 transition-all hover:bg-slate-300" />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase"><span className="text-pink-500">Introverted</span><span className="text-rose-500">Extroverted</span></div>
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                <span className="uppercase tracking-wider text-[11px]">Study Intensity</span>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{formData.study} / 10</span>
                            </label>
                            <input type="range" name="study" min="1" max="10" value={formData.study} onChange={handleChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all hover:bg-slate-300" />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase"><span className="text-blue-500">Relaxed</span><span className="text-sky-500">Intense</span></div>
                        </div>

                        <div className="flex flex-col pt-6 border-t border-slate-200/60 dark:border-slate-700/60 mt-4">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Food Preference</label>
                            <select name="food" value={formData.food} onChange={handleChange} className="w-full bg-white/50 dark:bg-slate-700/50 backdrop-blur-md border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-4 outline-none transition-all shadow-sm">
                                <option value="0">🥗 Vegetarian</option>
                                <option value="1">🥩 Non-Vegetarian</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 mt-8">
                        <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 flex justify-center items-center text-lg tracking-wide">
                            Save Profile
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}