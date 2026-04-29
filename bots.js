// Bot Database - Fixed ratings that don't change
export const botDatabase = [
    {
        id: "bot-rookie",
        name: "Rookiebomb",
        level: 1,
        rating: 400,
        description: "Perfect for beginners",
        elo: 400,
        style: "random"
    },
    {
        id: "bot-pawn",
        name: "Pawn Pusher",
        level: 2,
        rating: 600,
        description: "A simple opponent",
        elo: 600,
        style: "basic"
    },
    {
        id: "bot-knight",
        name: "Knight Rider",
        level: 3,
        rating: 800,
        description: "Challenging play",
        elo: 800,
        style: "knight-focused"
    }
];

// Get bot by ID
export function getBotById(botId) {
    return botDatabase.find(b => b.id === botId);
}

// Get all bots
export function getAllBots() {
    return botDatabase;
}

// Get bots sorted by rating
export function getBotsByRating() {
    return [...botDatabase].sort((a, b) => a.rating - b.rating);
}

// Note: User ratings are stored in Firestore and CAN change
// Bot ratings are fixed constants and will NOT change
