import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

export default function AdminVatSwitch() {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const { data: vatEnabled = true, isLoading } = useVatEnabled();

  const mutation = useMutation({
    mutationFn: (enabled) =>
      axiosPublicUrl.post("/api/settings/vat", { vat_enabled: enabled }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["vatEnabled"] }),
  });

  if (isLoading) return <span>Loading VAT setting...</span>;

  return (
    <div className="flex items-center gap-3">
      <label className="font-bold">Enable VAT globally</label>
      <input
        type="checkbox"
        checked={!!vatEnabled}
        onChange={(e) => mutation.mutate(e.target.checked)}
        className="w-5 h-5 cursor-pointer"
      />
      <span className="ml-2">{vatEnabled ? "Enabled" : "Disabled"}</span>
    </div>
  );
}
