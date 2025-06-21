import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import ShippingCostForm from "./ShippingCostForm";
import ShippingCostList from "./ShippingCostList";

export default function ShippingCostManager() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: shippingCosts = [], refetch } = useQuery({
    queryKey: ["shipping-costs"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/shipping-costs");
      return res.data;
    },
  });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/shipping-costs/${editing.id}`, data);
        setEditing(null);
      } else {
        await axiosPublicUrl.post("/api/shipping-costs", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/shipping-costs/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (cost) => {
    setEditing(cost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {editing ? "Edit Shipping Cost" : "Create New Shipping Cost"}
      </h2>
      <ShippingCostForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <ShippingCostList
        data={shippingCosts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
