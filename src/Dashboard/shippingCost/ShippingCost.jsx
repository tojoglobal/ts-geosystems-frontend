import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import ShippingCostForm from "./ShippingCostForm";
import ShippingCostList from "./ShippingCostList";
import Swal from "sweetalert2";

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
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Shipping cost updated successfully.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      } else {
        await axiosPublicUrl.post("/api/shipping-costs", data);
        setResetFormTrigger((prev) => !prev);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Shipping cost created successfully.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save shipping cost.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const handleDelete = async (id) => {
    const swalOptions = {
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
      customClass: {
        popup: "rounded-lg",
        confirmButton: "swal2-confirm !rounded-md !px-4 !py-2",
        cancelButton: "swal2-cancel !rounded-md !px-4 !py-2",
      },
    };

    Swal.fire(swalOptions).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await axiosPublicUrl.delete(`/api/shipping-costs/${id}`);
          refetch();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Shipping cost has been deleted.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            customClass: { popup: "rounded-lg" },
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err?.response?.data?.message || "Error deleting shipping cost.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            customClass: { popup: "rounded-lg" },
          });
        }
      }
    });
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
