import { useState } from "react";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "../utils/toast";
import { PROFILE_TRAITS } from "../constants";

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
            const finalProfile = {
                sleep: Number(formData.sleep),
                cleanliness: Number(formData.cleanliness),
                noise: Number(formData.noise),
                social: Number(formData.social),
                study: Number(formData.study),
                food: Number(formData.food)
            };

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                fullName: user.displayName || user.email.split('@')[0],
                profile: finalProfile
            }, { merge: true });
            nav("/matches");
            toast("Profile saved!");

        } catch (err) {
            toast(err.message, 'error');
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
                        {PROFILE_TRAITS.map(trait => (
                            <div key={trait.id} className="flex flex-col group">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                    <span className="uppercase tracking-wider text-[11px]">{trait.label}</span>
                                    <span className={`${trait.badgeBg} ${trait.badgeText} px-3 py-1 rounded-full text-xs`}>
                                        {formData[trait.id]} / 10
                                    </span>
                                </label>
                                <input 
                                    type="range" 
                                    name={trait.id} 
                                    min="1" max="10" 
                                    value={formData[trait.id]} 
                                    onChange={handleChange} 
                                    className={`w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${trait.accent} transition-all hover:bg-slate-300`} 
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase">
                                    <span className={trait.leftText}>{trait.leftLabel}</span>
                                    <span className={trait.rightText}>{trait.rightLabel}</span>
                                </div>
                            </div>
                        ))}

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