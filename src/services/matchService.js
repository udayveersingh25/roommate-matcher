import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { PROFILE_WEIGHTS } from "../constants";

export async function getAllUsers(filters) {
    let usersRef = collection(db, "users");
    
    if (filters && filters.gender && filters.residence) {
        usersRef = query(
            usersRef,
            where("residence", "==", filters.residence),
            where("gender", "==", filters.gender)
        );
    }
    
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
export function calculateCompatibility(userA, userB) {
    let score = 0;

    for (let key in PROFILE_WEIGHTS) {
        // Food is a binary 0|1 classification, other sliders are on a 9-point difference scale
        const maxDiff = key === "food" ? 1 : 9;
        const diff = Math.abs(userA.profile[key] - userB.profile[key]) / maxDiff;
        
        // Non-linear penalty: small diffs tolerated, massive diffs square exponentially
        score += PROFILE_WEIGHTS[key] * Math.pow(diff, 2);
    }

    // 🚨 Hard penalties for irreconcilable roommate traits mathematically overriding standard weights
    let penalty = 0;
    if (Math.abs(userA.profile.sleep - userB.profile.sleep) > 6) penalty += 15;
    if (Math.abs(userA.profile.cleanliness - userB.profile.cleanliness) > 6) penalty += 15;
    if (Math.abs(userA.profile.noise - userB.profile.noise) > 6) penalty += 10;

    let finalScore = 100 - score * 100 - penalty;
    return Math.max(0, Math.round(finalScore));
}

export function getMatchReasons(userA, userB) {
    const reasons = [];

    const a = userA.profile;
    const b = userB.profile;

    if (Math.abs(a.sleep - b.sleep) <= 2) {
        reasons.push("Similar sleep schedule");
    }

    if (Math.abs(a.cleanliness - b.cleanliness) <= 2) {
        reasons.push("Matching cleanliness level");
    }

    if (Math.abs(a.noise - b.noise) <= 2) {
        reasons.push("Comfortable noise preferences");
    }

    if (Math.abs(a.social - b.social) <= 2) {
        reasons.push("Similar social habits");
    }

    if (Math.abs(a.study - b.study) <= 2) {
        reasons.push("Aligned study intensity");
    }

    if (a.food === b.food) {
        reasons.push("Same food preference");
    }

    return reasons;
}