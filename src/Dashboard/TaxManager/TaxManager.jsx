import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import TaxForm from "./TaxForm";
import TaxList from "./TaxList";

export default function TaxManager() {
  const axiosPublicUrl = useAxiospublic();
  const [taxes, setTaxes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  useEffect(() => {
    axiosPublicUrl
      .get("/api/taxes")
      .then((res) => setTaxes(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await axiosPublicUrl.put(`/api/taxes/${editing.id}`, data);
        setTaxes((prev) =>
          prev.map((item) =>
            item.id === editing.id ? { ...item, ...data } : item
          )
        );
        setEditing(null);
      } else {
        const res = await axiosPublicUrl.post("/api/taxes", data);
        setTaxes((prev) => [...prev, { ...data, id: res.data.id }]);
        setResetFormTrigger((prev) => !prev);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/taxes/${id}`);
      setTaxes((prev) => prev.filter((item) => item.id !== id));
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
