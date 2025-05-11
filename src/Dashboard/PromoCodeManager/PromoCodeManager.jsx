/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PromoCodeForm from "./PromoCodeForm";
import PromoCodeList from "./PromoCodeList";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

export default function PromoCodeManager() {
  const axiosPublicUrl = useAxiospublic();
  const [promoCodes, setPromoCodes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  useEffect(() => {
    axiosPublicUrl
      .get("/api/promocodes")
      .then((res) => setPromoCodes(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (editing === null) {
      setResetFormTrigger((prev) => !prev); // Only reset when edit mode ends
    }
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        console.log(editing);

        // Update API
        await axiosPublicUrl.put(`/api/promocodes/${editing.id}`, data);
        setPromoCodes((prev) =>
          prev.map((promo) =>
            promo.id === editing.id ? { ...promo, ...data } : promo
          )
        );
        setEditing(null);
      } else {
        // Create API
        const res = await axiosPublicUrl.post("/api/promocodes", data);
        setPromoCodes((prev) => [...prev, { ...data, id: res.data.id }]);
        // ✅ Trigger form reset after submission
        setResetFormTrigger((prev) => !prev);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/promocodes/${id}`);
      setPromoCodes((prev) => prev.filter((promo) => promo.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (promo) => {
    setEditing(promo);
  };

  console.log("promoCodes", promoCodes);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {editing ? "Edit Promo Code" : "Create Promo Code"}
      </h2>
      <PromoCodeForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <PromoCodeList
        data={promoCodes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
