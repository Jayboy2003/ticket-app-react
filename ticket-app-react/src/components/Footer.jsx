import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="footer-title">TicketApp</h3>
          <p className="footer-description">
            Simple and efficient ticket management for your team
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/auth/login" className="footer-link">
              Login
            </Link>
            <Link to="/auth/signup" className="footer-link">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Documentation
            </a>
            <a href="#" className="footer-link">
              Support
            </a>
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            © {currentYear} TicketApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
