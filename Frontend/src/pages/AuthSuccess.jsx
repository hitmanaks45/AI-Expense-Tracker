import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { fetchUser } = useAuth();

  useEffect(() => {
    const login = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      await fetchUser();

      navigate("/dashboard");
    };

    login();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-semibold">
        Signing you in...
      </h1>
    </div>
  );
};

export default AuthSuccess;