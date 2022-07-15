import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {
  // Catch user from local storage using thunk appointment(auth) and check inicialState
  const { user } = useSelector((state) => state.auth);

  const [auth, setAuth] = useState(false);
  // make a generic loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setAuth(true);
    } else {
      setAuth(false);
    }

    setLoading(false);
  }, [user]);

  return { auth, loading };
};