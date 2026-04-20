import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
export function calculateCompatibility(userA, userB) {
    const weights = {
        sleep: 0.2,
        cleanliness: 0.2,
        noise: 0.15,
        social: 0.15,
        study: 0.15,
        food: 0.15
    };

    let score = 0;

    for (let key in weights) {
        const diff = Math.abs(
            userA.profile[key] - userB.profile[key]
        );
        score += weights[key] * diff;
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