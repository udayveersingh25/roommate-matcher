import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    const handleNavigateMatches = useCallback(() => nav("/matches"), [nav]);
    const handleNavigatePref = useCallback(() => nav("/questionnaire"), [nav]);
    const handleLogout = useCallback(() => logout(), [logout]);

    const [isProfileComplete, setIsProfileComplete] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        async function fetchUserProfile() {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (!data.profile) {
                        setIsProfileComplete(false);
                    }
                } else {
                    setIsProfileComplete(false);
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        }
        fetchUserProfile();
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 dark:bg-none dark:bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background decorative blobs */}
            <div className="absolute top-1/4 right-1/3 w-[30rem] h-[30rem] bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>
            <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] bg-purple-300/30 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl z-0 transition-colors duration-500"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl py-12 px-8 sm:px-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/60 dark:border-slate-700/50 text-center transition-colors duration-500">
                    
                    {/* Welcome Header */}
                    <div className="mb-10">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-3xl text-white shadow-lg mb-6 shadow-indigo-500/30 font-bold">
                           {user?.email ? user.email.charAt(0).toUpperCase() : "👋"}
                        </div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight pb-1">
                            Welcome Back!
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>

                    {!loadingProfile && !isProfileComplete && (
                        <div 
                            onClick={handleNavigatePref}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl mb-8 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors text-sm text-left font-medium flex gap-3 shadow-sm"
                        >
                            <span className="text-yellow-500 text-lg leading-none">⚠️</span>
                            <div>
                                <strong className="block mb-1">Your profile is incomplete</strong> 
                                Matches won't show until you fill your preferences. <span className="underline font-bold text-yellow-600 dark:text-yellow-300">Fill it out now</span>.
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button 
                            onClick={handleNavigateMatches}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 flex justify-center rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 text-lg"
                        >
                            Find Roommates
                        </button>
                        
                        <button 
                            onClick={handleNavigatePref}
                            className="w-full bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-100 dark:border-slate-600 font-bold py-4 flex justify-center rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-600 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-lg"
                        >
                            Edit Preferences
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent dark:border-slate-700 font-bold py-3.5 flex justify-center rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 mt-6 shadow-sm hover:text-slate-800 dark:hover:text-slate-200"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}