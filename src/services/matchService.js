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
        const diff = Math.abs(
            userA.profile[key] - userB.profile[key]
        );
        score += PROFILE_WEIGHTS[key] * diff;
    }

    return Math.round(100 - score * 10);
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