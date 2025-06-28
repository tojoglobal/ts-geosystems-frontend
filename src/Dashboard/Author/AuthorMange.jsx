import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import AuthorForm from "./AuthorFrom";
import AuthorList from "./AuthorList";
import Swal from "sweetalert2";

export default function AuthorManager() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: authors = [], refetch } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/authors");
      return res.data?.author;
    },
  });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  // SweetAlert2 dark premium
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
        await axiosPublicUrl.put(`/api/authors/${editing.id}`, data);
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Updated!",
          text: "Author updated successfully.",
        });
      } else {
        await axiosPublicUrl.post("/api/authors", data);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Created!",
          text: "Author created successfully.",
        });
      }
      refetch();
    } catch (err) {
      showSwal({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save author.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This author will be permanently deleted.",
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
          await axiosPublicUrl.delete(`/api/authors/${id}`);
          refetch();
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Author deleted successfully.",
          });
        } catch (err) {
          showSwal({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Failed to delete author.",
          });
        }
      }
    });
  };

  const handleEdit = (author) => {
    setEditing(author);
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
        {editing ? "Edit Author" : "Create New Author"}
      </h2>
      <AuthorForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <AuthorList data={authors} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}