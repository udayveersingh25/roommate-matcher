import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, calculateCompatibility, getMatchReasons } from "../services/matchService";
import MatchCard from "../components/MatchCard"; // ✅ FIXED casing
import { motion } from "framer-motion";

export default function Matches() {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ added loading state

    useEffect(() => {
        async function fetchMatches() {
            try {
                const users = await getAllUsers();

                // 🛑 Guard: ensure current user exists
                const currentUser = users.find((u) => u.id === user.uid);
                if (!currentUser || !currentUser.profile) {
                    setMatches([]);
                    setLoading(false);
                    return;
                }

                const results = users
                    .filter((u) => u.id !== user.uid && u.profile && u.gender === currentUser.gender && u.residence === currentUser.residence) // ✅ skip incomplete users and filter by gender and residence
                    .map((u) => ({
                        ...u,
                        score: calculateCompatibility(currentUser, u),
                        reasons: getMatchReasons(currentUser, u)
                    }))
                    .sort((a, b) => b.score - a.score);

                setMatches(results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (user) fetchMatches();
    }, [user]);

    // Safely memoize the mapped array of components so we only iterate when `matches` changes array ref
    const renderedMatches = useMemo(() => {
        return matches.map((match) => (
            <MatchCard key={match.id} match={match} />
        ));
    }, [matches]);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-50 via-white to-violet-50 dark:bg-none dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-violet-200/40 dark:bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 z-0 transition-colors duration-500"></div>
            <div className="absolute top-40 left-1/4 w-[30rem] h-[30rem] bg-fuchsia-200/40 dark:bg-fuchsia-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 z-0 transition-colors duration-500"></div>

            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold pb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight mb-2">
                        Your Matches
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium pb-2">
                        Find your perfect roommate based on your preferences
                    </p>
                </div>

                {/* 🔄 Loading State */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center py-20"
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] dark:shadow-[0_0_15px_rgba(129,140,248,0.5)]"></div>
                    </motion.div>
                ) : matches.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/60 dark:border-slate-700/50 transition-colors duration-500"
                    >
                        <svg className="mx-auto h-14 w-14 text-indigo-300 dark:text-indigo-500 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No matches yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Ask others to fill their preferences to see them here!</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {renderedMatches}
                    </div>
                )}
            </div>
        </div>
    );
}
