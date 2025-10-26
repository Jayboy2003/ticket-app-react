import { useState, useEffect } from "react";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  validateTicket,
} from "../utils/tickets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TicketCard from "../components/TicketCard";
import Toast from "../components/Toast";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
  });
  const [formErrors, setFormErrors] = useState({});

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets = getTickets();
    setTickets(allTickets);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setFormErrors({});
    setEditingTicket(null);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || "",
      status: ticket.status,
      priority: ticket.priority || "medium",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateTicket(formData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      setToast({
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    try {
      if (editingTicket) {
        // Update existing ticket
        updateTicket(editingTicket.id, formData);
        setToast({
          message: "Ticket updated successfully!",
          type: "success",
        });
      } else {
        // Create new ticket
        createTicket(formData);
        setToast({
          message: "Ticket created successfully!",
          type: "success",
        });
      }

      loadTickets();
      resetForm();
    } catch (error) {
      console.error("Error saving ticket:", error);
      setToast({
        message: "Failed to save ticket. Please try again.",
        type: "error",
      });
    }
  };

  const handleDelete = (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        deleteTicket(ticketId);
        loadTickets();
        setToast({
          message: "Ticket deleted successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error saving ticket:", error);
        setToast({
          message: "Failed to save ticket. Please try again.",
          type: "error",
        });
      }
    }
  };

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);

  return (
    <div className="page">
      <Navbar />

      <div className="tickets-container">
        <div className="container">
          {/* Header */}
          <div className="tickets-header">
            <div>
              <h1 className="page-title">Ticket Management</h1>
              <p className="page-description">
                Create, view, edit, and manage all your tickets
              </p>
            </div>
            <button onClick={handleCreateNew} className="btn btn-primary">
              <svg
                className="btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Ticket
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              onClick={() => setFilterStatus("all")}
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setFilterStatus("open")}
              className={`filter-btn ${
                filterStatus === "open" ? "active" : ""
              }`}
            >
              Open ({tickets.filter((t) => t.status === "open").length})
            </button>
            <button
              onClick={() => setFilterStatus("in_progress")}
              className={`filter-btn ${
                filterStatus === "in_progress" ? "active" : ""
              }`}
            >
              In Progress (
              {tickets.filter((t) => t.status === "in_progress").length})
            </button>
            <button
              onClick={() => setFilterStatus("closed")}
              className={`filter-btn ${
                filterStatus === "closed" ? "active" : ""
              }`}
            >
              Closed ({tickets.filter((t) => t.status === "closed").length})
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="ticket-form-container">
              <div className="ticket-form-header">
                <h2 className="form-title">
                  {editingTicket ? "Edit Ticket" : "Create New Ticket"}
                </h2>
                <button
                  onClick={resetForm}
                  className="btn-close"
                  aria-label="Close form"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="ticket-form">
                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input ${
                      formErrors.title ? "input-error" : ""
                    }`}
                    placeholder="Enter ticket title"
                  />
                  {formErrors.title && (
                    <span className="error-message">{formErrors.title}</span>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-input ${
                      formErrors.description ? "input-error" : ""
                    }`}
                    placeholder="Enter ticket description (optional)"
                    rows="4"
                  />
                  {formErrors.description && (
                    <span className="error-message">
                      {formErrors.description}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status <span className="required">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`form-input ${
                      formErrors.status ? "input-error" : ""
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  {formErrors.status && (
                    <span className="error-message">{formErrors.status}</span>
                  )}
                </div>

                {/* Priority */}
                <div className="form-group">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTicket ? "Update Ticket" : "Create Ticket"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          <div className="tickets-list">
            {filteredTickets.length === 0 ? (
              <div className="empty-state">
                <svg
                  className="empty-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="empty-title">No tickets found</h3>
                <p className="empty-description">
                  {filterStatus === "all"
                    ? "Create your first ticket to get started"
                    : `No ${filterStatus.replace("_", " ")} tickets`}
                </p>
                {filterStatus === "all" && (
                  <button onClick={handleCreateNew} className="btn btn-primary">
                    Create Ticket
                  </button>
                )}
              </div>
            ) : (
              <div className="tickets-grid">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
