import { describe, it, expect } from 'vitest';
import { calculateCompatibility, getMatchReasons } from './matchService';

describe('matching algorithm', () => {
    it('should calculate 100% compatibility for mathematically identical profiles', () => {
        const userA = {
            profile: { sleep: 5, cleanliness: 5, noise: 5, social: 5, study: 5, food: 0 }
        };
        const userB = {
            profile: { sleep: 5, cleanliness: 5, noise: 5, social: 5, study: 5, food: 0 }
        };

        const score = calculateCompatibility(userA, userB);
        expect(score).toBe(100);
    });

    it('should calculate a highly penalizing low compatibility score for opposite profiles', () => {
        const userA = {
            profile: { sleep: 1, cleanliness: 1, noise: 1, social: 1, study: 1, food: 0 }
        };
        const userB = {
            profile: { sleep: 10, cleanliness: 10, noise: 10, social: 10, study: 10, food: 1 }
        };

        const score = calculateCompatibility(userA, userB);
        // Opposite profiles resolve to approximately 22% mathematically based on current weightings
        expect(score).toBeLessThan(30);
    });

    it('should clearly highlight matching food preference in generated reasons array', () => {
        const userA = {
            profile: { sleep: 1, cleanliness: 5, noise: 3, social: 8, study: 2, food: 1 }
        };
        const userB = {
            profile: { sleep: 10, cleanliness: 2, noise: 10, social: 1, study: 9, food: 1 }
        };

        const reasons = getMatchReasons(userA, userB);
        expect(reasons).toContain("Same food preference");
    });
});
