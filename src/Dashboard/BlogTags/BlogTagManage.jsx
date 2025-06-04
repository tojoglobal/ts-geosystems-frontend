import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import BlogTagList from "./BlogTagList";
import BlogTagForm from "./BlogTagForm";

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
      } else {
        await axiosPublicUrl.post("/api/tags", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/tags/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
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
