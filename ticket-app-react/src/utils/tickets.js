// Ticket CRUD operations with user-specific data
import { getCurrentUser } from "./auth";

const TICKETS_KEY = "ticketapp_tickets";

/**
 * Get tickets key for current user
 * @returns {string}
 */
function getUserTicketsKey() {
  const user = getCurrentUser();
  if (!user) return TICKETS_KEY;
  return `${TICKETS_KEY}_${user.id}`;
}

/**
 * Initialize with demo tickets if none exist for this user
 */
function initializeDemoTickets() {
  const userKey = getUserTicketsKey();
  const existing = localStorage.getItem(userKey);

  if (!existing) {
    const demoTickets = [
      {
        id: "ticket_1",
        title: "Login page not responsive on mobile",
        description:
          "Users report that the login form is cut off on mobile devices",
        status: "open",
        priority: "high",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "ticket_2",
        title: "Add dark mode support",
        description: "Users have requested a dark mode theme option",
        status: "in_progress",
        priority: "medium",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "ticket_3",
        title: "Update terms of service page",
        description: "Legal team requested updates to the terms page",
        status: "closed",
        priority: "low",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(userKey, JSON.stringify(demoTickets));
  }
}

/**
 * Get all tickets for current user
 * @returns {Array} Array of ticket objects
 */
export function getTickets() {
  try {
    initializeDemoTickets();
    const userKey = getUserTicketsKey();
    const tickets = localStorage.getItem(userKey);
    return tickets ? JSON.parse(tickets) : [];
  } catch (error) {
    console.error("Error getting tickets:", error);
    return [];
  }
}

/**
 * Get a single ticket by ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getTicketById(id) {
  const tickets = getTickets();
  return tickets.find((ticket) => ticket.id === id) || null;
}

/**
 * Create a new ticket
 * @param {Object} ticketData
 * @returns {Object} The created ticket
 */
export function createTicket(ticketData) {
  try {
    const tickets = getTickets();
    const userKey = getUserTicketsKey();

    const newTicket = {
      id:
        "ticket_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      title: ticketData.title,
      description: ticketData.description || "",
      status: ticketData.status || "open",
      priority: ticketData.priority || "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tickets.push(newTicket);
    localStorage.setItem(userKey, JSON.stringify(tickets));
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

/**
 * Update an existing ticket
 * @param {string} id
 * @param {Object} updates
 * @returns {Object|null} Updated ticket or null
 */
export function updateTicket(id, updates) {
  try {
    const tickets = getTickets();
    const userKey = getUserTicketsKey();
    const index = tickets.findIndex((ticket) => ticket.id === id);

    if (index === -1) {
      return null;
    }

    tickets[index] = {
      ...tickets[index],
      ...updates,
      id: tickets[index].id,
      createdAt: tickets[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(userKey, JSON.stringify(tickets));
    return tickets[index];
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
}

/**
 * Delete a ticket
 * @param {string} id
 * @returns {boolean} Success status
 */
export function deleteTicket(id) {
  try {
    const tickets = getTickets();
    const userKey = getUserTicketsKey();
    const filteredTickets = tickets.filter((ticket) => ticket.id !== id);

    if (filteredTickets.length === tickets.length) {
      return false;
    }

    localStorage.setItem(userKey, JSON.stringify(filteredTickets));
    return true;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
}

/**
 * Get ticket statistics
 * @returns {Object} Stats object with counts
 */
export function getTicketStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}

/**
 * Get tickets filtered by status
 * @param {string} status
 * @returns {Array}
 */
export function getTicketsByStatus(status) {
  const tickets = getTickets();
  return tickets.filter((ticket) => ticket.status === status);
}

/**
 * Validate ticket data
 * @param {Object} ticketData
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateTicket(ticketData) {
  const errors = {};

  if (!ticketData.title || !ticketData.title.trim()) {
    errors.title = "Title is required";
  } else if (ticketData.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  const validStatuses = ["open", "in_progress", "closed"];
  if (ticketData.status && !validStatuses.includes(ticketData.status)) {
    errors.status = "Status must be one of: open, in_progress, closed";
  }

  if (ticketData.priority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(ticketData.priority)) {
      errors.priority = "Priority must be one of: low, medium, high";
    }
  }

  if (ticketData.description && ticketData.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
