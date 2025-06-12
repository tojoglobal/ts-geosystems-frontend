import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";

export function useVatEnabled() {
  const axiosPublicUrl = useAxiospublic();
  return useQuery({
    queryKey: ["vatEnabled"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/settings/vat");
      return res.data.vat_enabled;
    },
  });
}
