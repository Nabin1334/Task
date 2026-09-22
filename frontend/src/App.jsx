import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function Router() {
  const { session, authenticate } = useAuth();
  const [register, setRegister] = useState(false);
  if (session) return <Dashboard />;
  return register ? (
    <Register
      onSubmit={(data) => authenticate("/auth/register/", data)}
      onLogin={() => setRegister(false)}
    />
  ) : (
    <Login
      onSubmit={(data) => authenticate("/auth/login/", data)}
      onRegister={() => setRegister(true)}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ErrorBoundary>
  );
}
