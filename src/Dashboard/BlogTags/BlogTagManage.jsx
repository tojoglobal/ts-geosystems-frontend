import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import BlogTagList from "./BlogTagList";
import BlogTagForm from "./BlogTagForm";
import Swal from "sweetalert2";

export default function BlogTagManage() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: tags = [], refetch } = useQuery({
    queryKey: ["blogTags"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/tags");
      return res.data?.tags || [];
    },
  });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/tags/${editing.id}`, data);
        setEditing(null);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Tag updated successfully!",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      } else {
        await axiosPublicUrl.post("/api/tags", data);
        setResetFormTrigger((prev) => !prev);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Tag added successfully!",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save tag",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this tag?",
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
      });
      if (result.isConfirmed) {
        await axiosPublicUrl.delete(`/api/tags/${id}`);
        refetch();
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Tag has been deleted.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete tag",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const handleEdit = (tag) => {
    setEditing(tag);
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {editing ? "Edit Tag" : "Create New Tag"}
      </h2>
      <BlogTagForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <BlogTagList data={tags} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
