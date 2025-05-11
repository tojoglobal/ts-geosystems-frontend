import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import AuthorFrom from "./AuthorFrom";
import AuthorList from "./AuthorList";

export default function AuthorManager() {
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

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/taxes/${editing.id}`, data);
        setEditing(null);
      } else {
        await axiosPublicUrl.post("/api/taxes", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/taxes/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (tax) => {
    setEditing(tax);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editing ? "Edit Tax" : "Create New Tax"}
      </h2>
      <AuthorFrom
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <AuthorList data={taxes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
