// Authentication utilities for ticket management app
const AUTH_KEY = "ticketapp_session";
const USERS_KEY = "ticketapp_users"; // Store registered users

/**
 * Check if user is currently authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;

    const data = JSON.parse(session);

    // Check if session has expired
    if (data.expiresAt && data.expiresAt < Date.now()) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

/**
 * Get all registered users
 * @returns {Array}
 */
function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

/**
 * Save users to localStorage
 * @param {Array} users
 */
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Object|null}
 */
function findUserByEmail(email) {
  const users = getUsers();
  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

/**
 * Login user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Object} { success: boolean, error?: string, user?: Object }
 */
export function login(email, password) {
  try {
    // Check hardcoded test accounts first
    const testAccounts = {
      "user@test.com": { password: "password123", name: "Test User" },
      "admin@test.com": { password: "admin123", name: "Admin User" },
    };

    let user = null;

    // Check test accounts
    if (testAccounts[email] && testAccounts[email].password === password) {
      user = {
        email,
        name: testAccounts[email].name,
        id: "test_user_" + email.split("@")[0],
      };
    } else {
      // Check registered users
      const registeredUser = findUserByEmail(email);

      if (!registeredUser) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      // Verify password
      if (registeredUser.password !== password) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      user = {
        email: registeredUser.email,
        name: registeredUser.name,
        id: registeredUser.id,
      };
    }

    // Create session
    const session = {
      token: "mock_jwt_" + Date.now(),
      user: user,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, user: session.user };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

/**
 * Register new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Object} { success: boolean, error?: string, user?: Object }
 */
export function signup(name, email, password) {
  try {
    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error:
          "An account with this email already exists. Please login instead.",
      };
    }

    // Create new user
    const newUser = {
      id: "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In production, this should be hashed!
      createdAt: new Date().toISOString(),
    };

    // Save user to database
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    // Create session (auto-login after signup)
    const session = {
      token: "mock_jwt_" + Date.now(),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, user: session.user };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An error occurred during signup. Please try again.",
    };
  }
}

/**
 * Logout current user
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Get current logged-in user
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;

    const data = JSON.parse(session);

    // Check expiration
    if (data.expiresAt && data.expiresAt < Date.now()) {
      logout();
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get session token
 * @returns {string|null}
 */
export function getToken() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;

    const data = JSON.parse(session);
    return data.token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}
