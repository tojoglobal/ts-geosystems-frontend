/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PromoCodeForm from "./PromoCodeForm";
import PromoCodeList from "./PromoCodeList";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

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

  // Swal2 dark premium
  const showSwal = ({ icon, title, text }) =>
    Swal.fire({
      icon,
      title,
      text,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      timer: 4000,
    });

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/promocodes/${editing.id}`, data);
        setPromoCodes((prev) =>
          prev.map((promo) =>
            promo.id === editing.id ? { ...promo, ...data } : promo
          )
        );
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Updated!",
          text: "Promo code updated successfully.",
        });
      } else {
        const res = await axiosPublicUrl.post("/api/promocodes", data);
        setPromoCodes((prev) => [...prev, { ...data, id: res.data.id }]);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Created!",
          text: "Promo code created successfully.",
        });
      }
    } catch (err) {
      showSwal({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save promo code.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      reverseButtons: true,
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublicUrl.delete(`/api/promocodes/${id}`);
          setPromoCodes((prev) => prev.filter((promo) => promo.id !== id));
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Promo code has been deleted.",
          });
        } catch (err) {
          showSwal({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Error deleting promo code.",
          });
        }
      }
    });
  };

  const handleEdit = (promo) => {
    setEditing(promo);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
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
