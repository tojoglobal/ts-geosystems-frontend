import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import TaxForm from "./TaxForm";
import TaxList from "./TaxList";
import Swal from "sweetalert2";

export default function TaxManager() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: taxes = [], refetch } = useQuery({
    queryKey: ["taxes"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/taxes");
      return res.data;
    },
  });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  // SweetAlert2 dark theme
  const showSwal = ({ icon, title, text }) =>
    Swal.fire({
      icon,
      title,
      text,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
    });

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/taxes/${editing.id}`, data);
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Updated!",
          text: "Tax updated successfully.",
        });
      } else {
        await axiosPublicUrl.post("/api/taxes", data);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Created!",
          text: "Tax created successfully.",
        });
      }
      refetch();
    } catch (err) {
      showSwal({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save tax.",
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
          await axiosPublicUrl.delete(`/api/taxes/${id}`);
          refetch();
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Tax has been deleted.",
          });
        } catch (err) {
          showSwal({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Error deleting tax.",
          });
        }
      }
    });
  };

  const handleEdit = (tax) => {
    setEditing(tax);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
        {editing ? "Edit Tax" : "Create New Tax"}
      </h2>
      <TaxForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <TaxList data={taxes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
