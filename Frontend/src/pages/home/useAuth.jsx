// useAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cokkie from 'js-cookie';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const bearerToken = cokkie.get('bearerToken');
    if (!bearerToken) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return;
};

export default useAuth;
