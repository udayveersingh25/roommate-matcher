import { motion } from "framer-motion";

export default function MatchCard({ match }) {
    // 🛑 Prevent crash if profile is missing
    if (!match || !match.profile) return null;

    const {
        sleep,
        cleanliness,
        noise,
        social,
        study,
        food
    } = match.profile;

    // Helper for visual progress bars
    const renderBar = (val, colorClass) => (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden shadow-inner dark:shadow-black/20">
            <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${(val / 10) * 100}%` }}></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/80 dark:bg-[#0f1225]/80 backdrop-blur-xl border border-white/60 dark:border-indigo-500/20 p-6 my-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(79,70,229,0.1)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(124,58,237,0.2)] dark:hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100/80 dark:border-indigo-500/10 pb-5 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md text-lg">
                        {match.email.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">{match.email.split('@')[0]}</h3>
                </div>
                
                <div className="flex flex-col items-end">
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-4 py-1.5 rounded-full text-sm flex items-center shadow-md shadow-emerald-500/20">
                        {match.score}% Match
                    </span>
                </div>
            </div>

            {/* Traits */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6 text-sm mb-6">
                <div className="flex flex-col">
                    <div className="flex justify-between items-end"><span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Sleep</span> <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{sleep}/10</span></div>
                    {renderBar(sleep, "bg-indigo-400")}
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-end"><span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Cleanliness</span> <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{cleanliness}/10</span></div>
                    {renderBar(cleanliness, "bg-violet-400")}
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-end"><span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Noise</span> <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{noise}/10</span></div>
                    {renderBar(noise, "bg-fuchsia-400")}
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-end"><span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Social</span> <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{social}/10</span></div>
                    {renderBar(social, "bg-pink-400")}
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-end"><span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Study</span> <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{study}/10</span></div>
                    {renderBar(study, "bg-blue-400")}
                </div>
                <div className="flex flex-col justify-end">
                    <span className="text-slate-400 dark:text-indigo-300 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-1">Food</span>
                    <span className="font-semibold text-slate-700 dark:text-indigo-100 text-xs sm:text-sm bg-slate-100/80 dark:bg-indigo-900/30 border border-transparent dark:border-indigo-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-lg inline-block w-fit whitespace-nowrap shadow-sm dark:shadow-none">
                        {food === 0 ? "🥗 Vegetarian" : "🥩 Non-Veg"}
                    </span>
                </div>
            </div>

            {match.reasons && match.reasons.length > 0 && (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-indigo-950/40 dark:to-violet-950/30 rounded-2xl p-4 sm:p-5 mt-2 border border-violet-100/50 dark:border-indigo-500/20">
                    <strong className="text-violet-900 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 block opacity-80">
                        Why you match
                    </strong>
                    <ul className="space-y-3">
                        {match.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start text-sm text-violet-800 dark:text-indigo-100 font-medium tracking-wide">
                                <span className="text-violet-500 dark:text-violet-400 mr-3 mt-0.5 text-[10px] sm:text-xs leading-none shrink-0 border border-violet-200 dark:border-violet-400/30 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-white dark:bg-[#1a1b36] shadow-sm font-black">✓</span>
                                <span className="leading-snug text-xs sm:text-sm opacity-90">{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {match.reasons && match.reasons.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-2">No specific match reasons found.</p>
            )}
        </motion.div>
    );
}