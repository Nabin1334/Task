import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="auth">
          <div className="auth-panel">
            <span className="eyebrow">Something went wrong</span>
            <h1>We hit a snag.</h1>
            <p>Refresh the page to try again. Your session is still saved.</p>
            <button
              type="button"
              className="primary"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
