import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminUpdateTopClients = () => {
  const axiosPublic = useAxiospublic();
  const queryClient = useQueryClient();

  // Fetch clients
  const { data, isLoading, isError } = useQuery({
    queryKey: ["top-clients"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/get-top-clients");
      return res?.data?.data;
    },
  });

  // Add clients mutation
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return axiosPublic.post("/api/top-clients", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["top-clients"] }),
  });

  // Delete client mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosPublic.delete(`/api/top-clients/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["top-clients"] }),
  });

  const fileRef = useRef();

  // Add multiple images
  const handleUpload = (e) => {
    e.preventDefault();
    const files = fileRef.current.files;
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    addMutation.mutate(formData);
    fileRef.current.value = ""; // reset input after upload
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Delete this client?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Top Clients</h2>
      <form onSubmit={handleUpload} className="space-y-3 border p-3 rounded">
        <input
          type="file"
          ref={fileRef}
          multiple
          accept="image/*"
          className="mb-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={addMutation.isPending}
        >
          Upload
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Failed to load clients</p>
        ) : (
          data?.map((client) => (
            <div key={client.id} className="p-3 border rounded shadow">
              <img
                src={import.meta.env.VITE_OPEN_APIURL + client.imageUrl}
                alt=""
                className="object-contain w-full h-24 mb-2"
              />
              <button
                onClick={() => handleDelete(client.id)}
                className="text-red-500 mt-2"
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUpdateTopClients;
