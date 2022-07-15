import { useLocation } from "react-router-dom";
// Store the value and not change component state when renderize
import { useMemo } from "react";

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
