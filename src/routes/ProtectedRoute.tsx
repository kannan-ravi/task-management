import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
