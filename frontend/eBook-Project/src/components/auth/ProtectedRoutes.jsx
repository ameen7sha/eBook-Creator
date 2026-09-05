import { Navigate , useLocation } from "react-router-dom";

const ProtectedRoutes = ({children}) => {
  const isAuthenticated = false;
  const loading = false;
  const location = useLocation();

  if (loading) {
  return <div className="spinner"></div>;
  }

  if(!isAuthenticated){
    return <Navigate to ="/login" state={{from: location}} replace />;
  }

  return children;
}

export default ProtectedRoutes;