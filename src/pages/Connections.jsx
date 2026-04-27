import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "../utils/toast";
import { fetchAndSyncConnections, respondToInvite, unsendInviteById } from "../services/connectionService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Connections() {
    const { user } = useAuth();
    const nav = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [incomingInvites, setIncomingInvites] = useState([]);
    const [outgoingInvites, setOutgoingInvites] = useState([]);
    const [connections, setConnections] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function loadNetworking() {
            if (!user) return;
            try {
                // Fetch core data structures from the backend
                const { incoming, outgoing, connectionsIds } = await fetchAndSyncConnections(user.uid);
                
                // Helper to populate user details safely
                const populateUser = async (uid) => {
                    const snap = await getDoc(doc(db, "users", uid));
                    return { id: uid, ...(snap.exists() ? snap.data() : { fullName: "Unknown User" }) };
                };
                
                // Hydrate full user details
                const populatedIncoming = await Promise.all(
                    incoming.map(async inv => ({ ...inv, _user: await populateUser(inv.fromUserId) }))
                );
                
                const populatedOutgoing = await Promise.all(
                    outgoing.filter(i => i.status === "pending").map(async inv => ({ ...inv, _user: await populateUser(inv.toUserId) }))
                );
                
                const hydratedConnections = await Promise.all(
                    connectionsIds.map(uid => populateUser(uid))
                );

                if (isMounted) {
                    setIncomingInvites(populatedIncoming);
                    setOutgoingInvites(populatedOutgoing);
                    setConnections(hydratedConnections);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) toast("Error loading connections", "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        
        loadNetworking();
        return () => { isMounted = false; };
    }, [user]);

    const handleInviteResponse = async (inviteId, senderId, status) => {
        if (!user || actionLoading) return;
        setActionLoading(inviteId);
        try {
            await respondToInvite(inviteId, status, user.uid, senderId);
            toast(status === "accepted" ? "Connection added!" : "Invite declined.");
            
            // Re-organize local UI state seamlessly without needing heavy re-fetch
            const targetInvite = incomingInvites.find(i => i.id === inviteId);
            setIncomingInvites(prev => prev.filter(i => i.id !== inviteId));
            
            if (status === "accepted" && targetInvite) {
                setConnections(prev => [...prev, targetInvite._user]);
            }
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnsend = async (inviteId) => {
        if (!user || actionLoading) return;
        setActionLoading(inviteId);
        try {
            await unsendInviteById(inviteId);
            toast("Invite cancelled.");
            setOutgoingInvites(prev => prev.filter(i => i.id !== inviteId));
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 dark:bg-none dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-violet-200/40 dark:bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 z-0 transition-colors duration-500"></div>

            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                
                {/* Header Navigation */}
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

                <div className="mb-10 text-center sm:text-left pt-2 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
                    <h1 className="text-4xl sm:text-5xl font-extrabold pb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 tracking-tight mb-2">
                        Your Connections
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Manage invites and chat with your matching roommates.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        
                        {/* INCOMING INVITES */}
                        {incomingInvites.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 px-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">Pending Invitations ({incomingInvites.length})</h3>
                                <div className="grid gap-4">
                                    {incomingInvites.map(inv => (
                                        <div key={inv.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-5 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-all duration-300">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md text-xl">
                                                    {(inv._user.fullName || inv._user.email || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{inv._user.fullName || inv._user.email}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Wants to connect with you</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={() => handleInviteResponse(inv.id, inv.fromUserId, "accepted")}
                                                    disabled={actionLoading === inv.id}
                                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex justify-center items-center h-[44px]"
                                                >
                                                    {actionLoading === inv.id ? <span className="animate-spin text-lg">⏳</span> : "Accept"}
                                                </button>
                                                <button 
                                                    onClick={() => handleInviteResponse(inv.id, inv.fromUserId, "declined")}
                                                    disabled={actionLoading === inv.id}
                                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center h-[44px]"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* OUTGOING PENDING */}
                        {outgoingInvites.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 px-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">Sent Requests ({outgoingInvites.length})</h3>
                                <div className="grid gap-4">
                                    {outgoingInvites.map(inv => (
                                        <div key={inv.id} className="flex justify-between items-center bg-white/40 dark:bg-[#0f1225]/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-indigo-500/10 shadow-sm opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-300">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">
                                                    {(inv._user.fullName || inv._user.email || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <h4 className="font-bold text-slate-700 dark:text-slate-300 truncate">{inv._user.fullName || inv._user.email}</h4>
                                            </div>
                                            <div className="flex items-center shrink-0">
                                                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 hidden sm:inline-block">Pending</span>
                                                <button 
                                                    onClick={() => handleUnsend(inv.id)}
                                                    disabled={actionLoading === inv.id}
                                                    className="ml-0 sm:ml-3 px-4 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-xl text-xs font-bold uppercase tracking-widest border border-rose-100 dark:border-rose-900/50 transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    {actionLoading === inv.id ? "..." : "Cancel"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ACCEPTED CONNECTIONS */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 px-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">Your Roommate Network</h3>
                                {connections.length === 0 ? (
                                    <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-dashed border-slate-300 dark:border-slate-600">
                                        <span className="text-4xl mb-4 block">🤝</span>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">No connections yet.</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">Go to Matches to start inviting people!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {connections.map(u => (
                                            <div key={u.id} className="flex flex-col bg-white/80 dark:bg-[#151932]/80 backdrop-blur-lg p-5 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 shadow-md hover:shadow-lg transition-all duration-300 group">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/30 text-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                        {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{u.fullName || u.email}</h4>
                                                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-200 dark:border-emerald-800/30">Connected</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if (u.email) {
                                                            window.location.href = `mailto:${u.email}`;
                                                        } else {
                                                            toast("User email not available.", "error");
                                                        }
                                                    }}
                                                    className="w-full mt-auto py-2.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 font-bold rounded-xl transition-colors border border-slate-200 dark:border-slate-700 dark:hover:border-indigo-500/30"
                                                >
                                                    Message User
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </motion.div>

                    </div>
                )}
            </div>
        </div>
    );
}
