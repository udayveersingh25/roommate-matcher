import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/MatchCard";
import { motion } from "framer-motion";

const SkeletonCard = () => (
    <div className="bg-white/40 dark:bg-[#0f1225]/40 backdrop-blur-xl border border-white/60 dark:border-indigo-500/20 p-6 my-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(79,70,229,0.05)] animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center border-b border-slate-100/80 dark:border-indigo-500/10 pb-5 mb-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50"></div>
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
            </div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
        </div>

        {/* Radar/Traits Skeleton */}
        <div className="mb-6 h-64 md:h-72 bg-slate-200/50 dark:bg-slate-700/30 rounded-2xl"></div>

        {/* Reasons Skeleton */}
        <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl p-4 sm:p-5 mt-2 space-y-4">
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
                <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
            </div>
        </div>
    </div>
);

export default function Matches() {
    const { matches, loading, currentUserProfile } = useMatches();
    const nav = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const matchesPerPage = 5;

    // Pagination bounds
    const indexOfLast = currentPage * matchesPerPage;
    const indexOfFirst = indexOfLast - matchesPerPage;
    const currentMatches = matches.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(matches.length / matchesPerPage);

    // YouTube-style page mapping bounds
    const getVisiblePages = () => {
        let pages = [];
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pages.push(i);
        }
        return pages;
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    };

    // Safely memoize the mapped array of components so we only iterate when `currentMatches` changes array ref
    const renderedMatches = useMemo(() => {
        return currentMatches.map((match) => (
            <MatchCard key={match.id} match={match} currentUserProfile={currentUserProfile} />
        ));
    }, [currentMatches, currentUserProfile]);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-50 via-white to-violet-50 dark:bg-none dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-violet-200/40 dark:bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 z-0 transition-colors duration-500"></div>
            <div className="absolute top-40 left-1/4 w-[30rem] h-[30rem] bg-fuchsia-200/40 dark:bg-fuchsia-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 z-0 transition-colors duration-500"></div>

            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                
                {/* Navigation Button */}
                <div className="mb-2">
                    <button 
                        onClick={() => nav("/dashboard")}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-x-1 hover:shadow-md transition-all duration-300"
                    >
                        <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Dashboard
                    </button>
                </div>

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
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        {[1, 2, 3].map((key) => (
                            <SkeletonCard key={key} />
                        ))}
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
                        
                        {/* Pagination Controls */}
                        {matches.length > matchesPerPage && (
                            <div className="mt-8 flex items-center justify-center space-x-2 pb-6">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Prev
                                </button>
                                
                                {getVisiblePages().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm ${
                                            currentPage === page 
                                            ? "bg-indigo-600 text-white border-none scale-110 shadow-indigo-500/30" 
                                            : "bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
