// shared.js - Common utilities across DryChess pages

/**
 * Get user nickname from Firestore
 * Requires: db (global Firestore instance), getDoc, doc functions
 */
async function getUserNickname(uid) {
  const firestoreGetDoc = window.getDoc || getDoc;
  const firestoreDoc = window.doc || doc;

  if (
    typeof firestoreGetDoc !== "function" ||
    typeof firestoreDoc !== "function"
  ) {
    throw new Error("Firestore helpers are not available: getDoc/doc");
  }

  const userDoc = await firestoreGetDoc(firestoreDoc(db, "users", uid));
  if (!userDoc.exists()) return "Unknown user";
  return userDoc.data().nickname || "Unknown user";
}

/**
 * Display error message and hide other containers
 * Handles most common container naming patterns (forumContainer, threadContainer, profileContainer, createContainer)
 */
function showError(message, mainContainerId = null) {
  const loading = document.getElementById("loadingContainer");
  const error = document.getElementById("errorContainer");
  const errorMsg = document.getElementById("errorMessage");

  // Auto-detect main container if not provided
  if (!mainContainerId) {
    const possibleIds = [
      "forumContainer",
      "threadContainer",
      "profileContainer",
      "createContainer",
      "leaderboardContainer",
    ];
    for (const id of possibleIds) {
      if (document.getElementById(id)) {
        mainContainerId = id;
        break;
      }
    }
  }

  const main = mainContainerId
    ? document.getElementById(mainContainerId)
    : null;

  if (loading) loading.style.display = "none";
  if (main) main.style.display = "none";
  if (error) error.style.display = "block";
  if (errorMsg) errorMsg.textContent = message;
}

/**
 * Wait for Firebase to initialize (window.db and window.auth to be available)
 * Returns true if successful, false if timeout
 */
async function waitForFirebaseReady(checkAuth = true) {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const dbReady = window.db !== undefined;
    const authReady = !checkAuth || window.auth !== undefined;

    if (dbReady && authReady) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
    attempts++;
  }

  console.error(
    "Firebase failed to initialize after " + maxAttempts + " attempts",
  );
  return false;
}

/**
 * Calculate ELO rating change based on game result
 * Returns object with newRating and ratingChange
 * @param playerRating - Player's current rating
 * @param opponentRating - Opponent's current rating
 * @param result - 1 for win, 0.5 for draw, 0 for loss
 * @param kFactor - K-factor (volatility): 32 for rated games, 16 for bots
 */
function calculateEloChange(
  playerRating,
  opponentRating,
  result,
  kFactor = 32,
) {
  // Expected score: probability that player wins
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  // Rating change
  const ratingChange = Math.round(kFactor * (result - expectedScore));
  const newRating = Math.max(0, playerRating + ratingChange);

  return {
    newRating: newRating,
    ratingChange: ratingChange,
    expectedScore: expectedScore,
  };
}

/**
 * Update user rating in Firestore after a game
 * Requires: db (global Firestore instance), setDoc, doc functions
 * @param uid - User ID
 * @param newRating - New rating after game
 */
async function updateUserRating(uid, newRating) {
  const firestoreSetDoc = window.setDoc || setDoc;
  const firestoreDoc = window.doc || doc;

  if (
    typeof firestoreSetDoc !== "function" ||
    typeof firestoreDoc !== "function"
  ) {
    throw new Error("Firestore helpers are not available: setDoc/doc");
  }

  try {
    await firestoreSetDoc(
      firestoreDoc(db, "users", uid),
      { rating: newRating },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error("Error updating rating:", error);
    return false;
  }
}
