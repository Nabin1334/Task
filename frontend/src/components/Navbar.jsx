import { LogOut, Orbit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { session, logout } = useAuth();
  return (
    <header className="nav">
      <div className="brand">
        <Orbit size={22} /> Orbit Tasks
      </div>
      <div className="user-chip">
        <span>{session?.user?.name || session?.user?.email}</span>
        <button onClick={logout} aria-label="Log out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
