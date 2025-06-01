import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import AuthorForm from "./AuthorFrom";
import AuthorList from "./AuthorList";

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

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/authors/${editing.id}`, data);
        setEditing(null);
      } else {
        await axiosPublicUrl.post("/api/authors", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/authors/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (author) => {
    setEditing(author);
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
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
