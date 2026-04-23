export const GENDER_OPTIONS = ["Male", "Female", "Other"];
export const RESIDENCE_OPTIONS = ["Uniworld-1", "Uniworld-2", "Other"];

export const PROFILE_TRAITS = [
    {
        id: "sleep",
        label: "Sleep Schedule",
        leftLabel: "Early Bird (9 PM – 12 PM)",
        rightLabel: "Night Owl (4 AM – 6 AM)",
        badgeBg: "bg-indigo-100",
        badgeText: "text-indigo-700",
        accent: "accent-indigo-600",
        leftText: "text-indigo-500",
        rightText: "text-purple-500"
    },
    {
        id: "cleanliness",
        label: "Cleanliness",
        leftLabel: "Messy",
        rightLabel: "Neat Freak",
        badgeBg: "bg-violet-100",
        badgeText: "text-violet-700",
        accent: "accent-violet-500",
        leftText: "text-violet-500",
        rightText: "text-fuchsia-500"
    },
    {
        id: "noise",
        label: "Noise Tolerance",
        leftLabel: "Strictly Quiet",
        rightLabel: "Loud",
        badgeBg: "bg-fuchsia-100",
        badgeText: "text-fuchsia-700",
        accent: "accent-fuchsia-500",
        leftText: "text-fuchsia-500",
        rightText: "text-pink-500"
    },
    {
        id: "social",
        label: "Social Level",
        leftLabel: "Introverted",
        rightLabel: "Extroverted",
        badgeBg: "bg-pink-100",
        badgeText: "text-pink-700",
        accent: "accent-pink-500",
        leftText: "text-pink-500",
        rightText: "text-rose-500"
    },
    {
        id: "study",
        label: "Study Intensity",
        leftLabel: "Relaxed",
        rightLabel: "Intense",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-700",
        accent: "accent-blue-500",
        leftText: "text-blue-500",
        rightText: "text-sky-500"
    }
];

export const PROFILE_WEIGHTS = {
    sleep: 0.2,
    cleanliness: 0.2,
    noise: 0.15,
    social: 0.15,
    study: 0.15,
    food: 0.15
};
