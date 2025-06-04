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
        Swal.fire("Success", "Tag updated successfully!", "success");
      } else {
        await axiosPublicUrl.post("/api/tags", data);
        setResetFormTrigger((prev) => !prev);
        Swal.fire("Success", "Tag added successfully!", "success");
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Failed to save tag", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this tag?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e62245",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await axiosPublicUrl.delete(`/api/tags/${id}`);
        refetch();
        Swal.fire("Deleted!", "Tag has been deleted.", "success");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "Failed to delete tag", "error");
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
