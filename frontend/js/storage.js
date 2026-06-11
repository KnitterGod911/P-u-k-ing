/**
 * Unified storage manager for PUK
 * Handles all persistent data with proper error handling and initialization
 */

const STORAGE_VERSION = '1.0';
const STORAGE_PREFIX = 'puk_';

// Define all storage keys in one place
export const storageKeys = {
  // Profile
  profileName: `${STORAGE_PREFIX}profileName`,
  profileBio: `${STORAGE_PREFIX}profileBio`,
  profilePic: `${STORAGE_PREFIX}profilePic`,
  profileCreated: `${STORAGE_PREFIX}profileCreated`,
  
  // Chat
  chatUsername: `${STORAGE_PREFIX}chatUsername`,
  chatMessages: `${STORAGE_PREFIX}chatMessages`,
  chatGroup: `${STORAGE_PREFIX}chatGroup`,
  chatCallState: `${STORAGE_PREFIX}chatCallState`,
  banList: `${STORAGE_PREFIX}banList`,
  
  // Games
  gameState: `${STORAGE_PREFIX}gameState`,
  gamesPlayed: `${STORAGE_PREFIX}gamesPlayed`,
  
  // Settings
  animationsEnabled: `${STORAGE_PREFIX}animationsEnabled`,
  theme: `${STORAGE_PREFIX}theme`,
  
  // Admin
  adminUsers: `${STORAGE_PREFIX}adminUsers`,
  
  // Meta
  messagesSent: `${STORAGE_PREFIX}messagesSent`,
  aiAssists: `${STORAGE_PREFIX}aiAssists`,
  version: `${STORAGE_PREFIX}version`
};

/**
 * Get a value from localStorage with type safety
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // Try to parse as JSON, otherwise return as string
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error reading storage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set a value in localStorage with type safety
 */
export function setStorageItem(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return true;
    }
    
    // Store objects/arrays as JSON, primitives as-is
    const stringValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing storage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove a value from localStorage
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing storage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all PUK-related storage
 */
export function clearAllStorage() {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Initialize storage with defaults if needed
 */
export function initializeStorage() {
  try {
    // Check if storage is accessible
    localStorage.setItem(`${STORAGE_PREFIX}test`, 'test');
    localStorage.removeItem(`${STORAGE_PREFIX}test`);
    
    // Set version if not set
    if (!localStorage.getItem(storageKeys.version)) {
      setStorageItem(storageKeys.version, STORAGE_VERSION);
    }
    
    // Initialize profile if empty
    if (!getStorageItem(storageKeys.profileName)) {
      setStorageItem(storageKeys.profileName, 'Guest Explorer');
      setStorageItem(storageKeys.profileBio, 'Your next-gen control hub.');
      setStorageItem(storageKeys.profileCreated, new Date().toLocaleDateString());
    }
    
    // Initialize game state if empty
    if (!getStorageItem(storageKeys.gameState)) {
      setStorageItem(storageKeys.gameState, {
        highScore: 0,
        activity: []
      });
    }
    
    // Initialize settings if empty
    if (getStorageItem(storageKeys.animationsEnabled) === null) {
      setStorageItem(storageKeys.animationsEnabled, true);
    }
    
    // Initialize chat if empty
    if (!getStorageItem(storageKeys.chatMessages)) {
      setStorageItem(storageKeys.chatMessages, []);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
}

/**
 * Get all PUK-related storage as an object (for debugging/export)
 */
export function getAllStorage() {
  const result = {};
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => {
        result[key] = getStorageItem(key);
      });
  } catch (error) {
    console.error('Error getting all storage:', error);
  }
  return result;
}

/**
 * Export storage as JSON for backup
 */
export function exportStorageAsJSON() {
  return JSON.stringify(getAllStorage(), null, 2);
}

// Initialize on module load
initializeStorage();
