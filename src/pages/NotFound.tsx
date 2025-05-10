
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: El usuario intentó acceder a una ruta que no existe:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-gray">
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-app-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">¡Oops! Página no encontrada</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-app-blue hover:bg-app-blue/90"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
