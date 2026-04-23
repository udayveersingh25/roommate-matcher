import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, calculateCompatibility, getMatchReasons } from "../services/matchService";

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

                // 3. Filter out the current user and malformed profiles, map scores, sort
                const results = users
                    .filter((u) => u.id !== user.uid && u.profile)
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

    return { matches, loading, currentUserProfile };
}
