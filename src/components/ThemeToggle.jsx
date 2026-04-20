import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
            setIsDark(true);
        } else {
            root.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-yellow-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 ease-in-out"
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
        </motion.button>
    );
}
