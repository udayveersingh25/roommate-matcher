import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, calculateCompatibility, getMatchReasons } from "../services/matchService";
import { getUserInvites } from "../services/connectionService";

export function useMatches() {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    useEffect(() => {
        async function fetchMatches() {
            try {
                // 1. Fetch current user from database
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (!userDoc.exists() || !userDoc.data().profile) {
                    setMatches([]);
                    setLoading(false);
                    return;
                }
                
                const currentUser = { id: userDoc.id, ...userDoc.data() };
                setCurrentUserProfile(currentUser.profile);

                // 2. Pass filters directly into our service to optimize backend read layer
                const users = await getAllUsers({
                    gender: currentUser.gender,
                    residence: currentUser.residence
                });

                // 3. Get connection states
                const { outgoing, incoming } = await getUserInvites(user.uid);
                
                // Track interacting mapped IDs
                const pendingOutgoingIds = new Set(outgoing.filter(i => i.status === "pending").map(i => i.toUserId));
                const connectedOutgoingIds = new Set(outgoing.filter(i => i.status === "accepted").map(i => i.toUserId));
                const connectedIncomingIds = new Set(incoming.filter(i => i.status === "accepted").map(i => i.fromUserId));
                
                const getInviteStatus = (targetId) => {
                    if (connectedOutgoingIds.has(targetId) || connectedIncomingIds.has(targetId)) return "connected";
                    if (pendingOutgoingIds.has(targetId)) return "pending";
                    return "none";
                };

                // 4. Filter out the current user and malformed profiles, map scores, sort
                const results = users
                    .filter((u) => u.id !== user.uid && u.profile)
                    .map((u) => ({
                        ...u,
                        score: calculateCompatibility(currentUser, u),
                        reasons: getMatchReasons(currentUser, u),
                        inviteStatus: getInviteStatus(u.id)
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

    return { matches, loading, currentUserProfile };
}
