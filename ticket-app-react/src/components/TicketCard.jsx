export default function TicketCard({ ticket, onEdit, onDelete }) {
  const statusConfig = {
    open: {
      label: "Open",
      className: "status-badge-open",
    },
    in_progress: {
      label: "In Progress",
      className: "status-badge-progress",
    },
    closed: {
      label: "Closed",
      className: "status-badge-closed",
    },
  };

  const priorityConfig = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h3 className="ticket-title">{ticket.title}</h3>
        <span
          className={`status-badge ${
            statusConfig[ticket.status]?.className || ""
          }`}
        >
          {statusConfig[ticket.status]?.label || ticket.status}
        </span>
      </div>

      {ticket.description && (
        <p className="ticket-description">{ticket.description}</p>
      )}

      <div className="ticket-meta">
        {ticket.priority && (
          <span
            className={`priority-badge ${
              priorityConfig[ticket.priority] || ""
            }`}
          >
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}{" "}
            Priority
          </span>
        )}
        <span className="ticket-date">
          Created: {formatDate(ticket.createdAt)}
        </span>
      </div>

      <div className="ticket-actions">
        <button
          onClick={() => onEdit(ticket)}
          className="btn btn-secondary btn-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(ticket.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
