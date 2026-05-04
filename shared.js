// shared.js - Common utilities across DryChess pages

/**
 * Get user nickname from Firestore
 * Requires: db (global Firestore instance), getDoc, doc functions
 */
async function getUserNickname(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
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
        const possibleIds = ["forumContainer", "threadContainer", "profileContainer", "createContainer", "leaderboardContainer"];
        for (const id of possibleIds) {
            if (document.getElementById(id)) {
                mainContainerId = id;
                break;
            }
        }
    }
    
    const main = mainContainerId ? document.getElementById(mainContainerId) : null;
    
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
        
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
    }
    
    console.error("Firebase failed to initialize after " + maxAttempts + " attempts");
    return false;
}
