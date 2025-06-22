import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import BlogTypeList from "./BlogTypeList";
import BlogTypeFrom from "./BlogTypeFrom";
import { MdEdit, MdDelete } from "react-icons/md";

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

  // SweetAlert2 dark premium
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
        await axiosPublicUrl.put(`/api/blog-types/${editing.id}`, data);
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Success",
          text: "Blog type updated successfully!",
        });
      } else {
        await axiosPublicUrl.post("/api/blog-types", data);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Success",
          text: "Blog type added successfully!",
        });
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Failed to save blog type",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this blog type?",
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
      try {
        await axiosPublicUrl.delete(`/api/blog-types/${id}`);
        refetch();
        showSwal({
          icon: "success",
          title: "Deleted!",
          text: "Blog type has been deleted.",
        });
      } catch (err) {
        console.error("Delete error:", err);
        showSwal({
          icon: "error",
          title: "Error",
          text: "Failed to delete blog type",
        });
      }
    }
  };

  const handleEdit = (type) => {
    setEditing(type);
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
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
