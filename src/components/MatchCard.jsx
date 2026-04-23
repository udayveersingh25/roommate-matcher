import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function MatchCard({ match, currentUserProfile }) {
    // 🛑 Prevent crash if profile is missing
    if (!match || !match.profile || !currentUserProfile) return null;

    const {
        sleep,
        cleanliness,
        noise,
        social,
        study,
        food
    } = match.profile;

    const data = [
        { subject: 'Sleep', user: currentUserProfile.sleep, match: sleep, fullMark: 10 },
        { subject: 'Cleanliness', user: currentUserProfile.cleanliness, match: cleanliness, fullMark: 10 },
        { subject: 'Noise', user: currentUserProfile.noise, match: noise, fullMark: 10 },
        { subject: 'Social', user: currentUserProfile.social, match: social, fullMark: 10 },
        { subject: 'Study', user: currentUserProfile.study, match: study, fullMark: 10 },
    ];

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
                        {(match.fullName || match.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">{match.fullName || (match.email ? match.email.split('@')[0] : "User")}</h3>
                </div>
                
                <div className="flex flex-col items-end">
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-4 py-1.5 rounded-full text-sm flex items-center shadow-md shadow-emerald-500/20">
                        {match.score}% Match
                    </span>
                </div>
            </div>

            {/* Traits Radar */}
            <div className="mb-6 h-64 md:h-72 bg-slate-50/50 dark:bg-[#141830]/50 rounded-2xl border border-slate-100 dark:border-indigo-500/10 p-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                        <PolarGrid strokeOpacity={0.2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#818cf8', fontSize: 12, fontWeight: 600 }} />
                        <Radar name="You" dataKey="user" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                        <Radar name="Match" dataKey="match" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                        <Tooltip 
                            wrapperClassName="scale-90 opacity-95 shadow-xl"
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', padding: '12px 16px' }}
                            itemStyle={{ fontWeight: 600, fontSize: '13px', paddingTop: '2px' }}
                            labelStyle={{ color: '#cbd5e1', fontWeight: 800, marginBottom: '6px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </RadarChart>
                </ResponsiveContainer>
                
                <div className="absolute top-2 right-4 flex flex-col justify-end">
                    <span className="text-slate-400 dark:text-indigo-300 text-[10px] font-bold tracking-widest uppercase mb-1 text-right">Food</span>
                    <span className="font-semibold text-slate-700 dark:text-indigo-100 text-[11px] bg-slate-100/80 dark:bg-indigo-900/30 border border-transparent dark:border-indigo-500/20 px-2 py-1 rounded-lg inline-block whitespace-nowrap shadow-sm dark:shadow-none">
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