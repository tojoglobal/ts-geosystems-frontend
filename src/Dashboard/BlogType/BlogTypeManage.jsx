import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import BlogTypeList from "./BlogTypeList";
import BlogTypeFrom from "./BlogTypeFrom";

export default function BlogTypeManage() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: blogTypes = [], refetch } = useQuery({
    queryKey: ["blogTypes"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/blog-types");
      return res.data?.blogTypes;
    },
  });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/blog-types/${editing.id}`, data);
        setEditing(null);
        Swal.fire("Success", "Blog type updated successfully!", "success");
      } else {
        await axiosPublicUrl.post("/api/blog-types", data);
        setResetFormTrigger((prev) => !prev);
        Swal.fire("Success", "Blog type added successfully!", "success");
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Failed to save blog type", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this blog type?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e62245",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await axiosPublicUrl.delete(`/api/blog-types/${id}`);
        refetch();
        Swal.fire("Deleted!", "Blog type has been deleted.", "success");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "Failed to delete blog type", "error");
    }
  };

  const handleEdit = (type) => {
    setEditing(type);
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {editing ? "Edit Blog Type" : "Create New Blog Type"}
      </h2>
      <BlogTypeFrom
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <BlogTypeList
        data={blogTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
