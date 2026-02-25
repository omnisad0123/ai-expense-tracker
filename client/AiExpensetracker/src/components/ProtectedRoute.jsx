import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  // 1. If we are still checking for the token, show a loader
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  // 2. If no token after loading is finished, kick them to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 3. If token exists, show the protected content
  return children;
}

export default ProtectedRoute;