/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  show_in_footer: true,
  show_in_header: false,
};

const AdminUpdateFooterRoute = () => {
  const axiosPublic = useAxiospublic();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axiosPublic.get("/api/dynamic-links");
      setLinks(res.data.data || []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to fetch links", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setForm({
      name: link.name,
      slug: link.slug,
      description: link.description,
      show_in_footer: !!link.show_in_footer,
      show_in_header: !!link.show_in_header,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    await axiosPublic.delete(`/api/dynamic-links/${id}`);
    fetchLinks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axiosPublic.put(`/api/dynamic-links/${editingId}`, form);
        Swal.fire("Updated!", "Link updated", "success");
      } else {
        await axiosPublic.post("/api/dynamic-links", form);
        Swal.fire("Added!", "Link created", "success");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchLinks();
    } catch (e) {
      Swal.fire("Error", e?.response?.data?.message || "Failed", "error");
    }
    setSaving(false);
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-7 text-white">
        Manage Dynamic Footer/Header Links
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Link Name (e.g. Privacy Policy)"
                className="px-2 py-1 rounded text-black"
                required
              />
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Slug (e.g. privacy-policy)"
                className="px-2 py-1 rounded text-black"
                required
                pattern="^[a-z0-9\-]+$"
                title="lowercase letters, numbers, and hyphens only"
                disabled={!!editingId} // don't allow slug change on edit
              />
              <label>
                <input
                  type="checkbox"
                  name="show_in_footer"
                  checked={form.show_in_footer}
                  onChange={handleChange}
                />{" "}
                Footer
              </label>
              <label>
                <input
                  type="checkbox"
                  name="show_in_header"
                  checked={form.show_in_header}
                  onChange={handleChange}
                />{" "}
                Header
              </label>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded px-2 py-1 text-black"
              placeholder="Page Content/Description (supports HTML/Markdown if you want)"
              required
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded"
              disabled={saving}
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="ml-3 px-3 py-2 rounded bg-gray-400 text-white"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </form>
          <table className="w-full bg-neutral-900 text-white">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Footer</th>
                <th>Header</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>{link.name}</td>
                  <td>{link.slug}</td>
                  <td>{link.show_in_footer ? "✅" : ""}</td>
                  <td>{link.show_in_header ? "✅" : ""}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(link)}
                      className="px-2 py-1 bg-blue-700 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="px-2 py-1 bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminUpdateFooterRoute;
