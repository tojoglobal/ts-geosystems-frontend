import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import Loader from "../../utils/Loader";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useDataQuery from "../../utils/useDataQuery";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  show_in_footer: true,
  show_in_header: false,
};

const AdminUpdateFooterRoute = () => {
  const axiosPublic = useAxiospublic();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [successButton, setSuccessButton] = useState(false);
  const successTimeout = useRef(null);

  // Fetch links using useDataQuery
  const {
    data: linksData,
    isLoading,
    refetch: fetchLinks,
  } = useDataQuery(["dynamicLinks"], "/api/dynamic-links");
  const links = linksData?.data || [];

  useEffect(() => {
    // Cleanup success timeout on unmount
    return () => {
      if (successTimeout.current) clearTimeout(successTimeout.current);
    };
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
    document
      .getElementById("link-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete link with SweetAlert confirmation
  const handleDeleteClick = (link) => {
    Swal.fire({
      title: "Are you absolutely sure?",
      text: `This action cannot be undone. This will permanently delete the "${link.name}" link.`,
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublic.delete(`/api/dynamic-links/${link.id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Link has been deleted.",
            icon: "success",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            timer: 4000,
          });
          fetchLinks();
        } catch (e) {
          Swal.fire({
            title: "Error",
            text: e?.response?.data?.message || "Failed to delete link",
            icon: "error",
            timer: 4000,
          });
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axiosPublic.put(`/api/dynamic-links/${editingId}`, form);
        Swal.fire({
          title: "Updated!",
          text: "Link has been updated.",
          icon: "success",
          timer: 4000,
        });
      } else {
        await axiosPublic.post("/api/dynamic-links", form);
        Swal.fire({
          title: "Created!",
          text: "New link has been created.",
          icon: "success",
          timer: 4000,
        });
      }
      setSuccessButton(true);
      if (successTimeout.current) clearTimeout(successTimeout.current);
      successTimeout.current = setTimeout(() => setSuccessButton(false), 1500);
      setForm(emptyForm);
      setEditingId(null);
      fetchLinks();
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e?.response?.data?.message || "Operation failed",
        icon: "error",
        timer: 4000,
      });
    }
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const editorRef = useRef(null);

  return (
    <div className="mt-7">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Manage Dynamic Links</h2>
        <p className="text-gray-400 mb-6">
          Add, edit or remove links that appear in your website's header or
          footer
        </p>
        <div>
          {isLoading ? (
            <Loader className="my-12" />
          ) : (
            <div className="space-y-8">
              <div id="link-form">
                <h3 className="text-lg font-semibold mb-2">
                  {editingId ? "Edit Link" : "Create New Link"}
                </h3>
                <div className="py-6 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Link Name
                        </label>
                        <input
                          className="w-full rounded-md bg-gray-800 border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Privacy Policy"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Slug
                        </label>
                        <input
                          className="w-full rounded-md bg-gray-800 border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          name="slug"
                          value={form.slug}
                          onChange={handleChange}
                          placeholder="e.g. privacy-policy"
                          required
                          pattern="^[a-z0-9\-]+$"
                          title="Lowercase letters, numbers, and hyphens only"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="show_in_footer"
                          name="show_in_footer"
                          checked={form.show_in_footer}
                          onChange={handleChange}
                          className="h-4 w-4 cursor-pointer rounded border-gray-600 text-teal-600 focus:ring-teal-500"
                        />
                        <label
                          htmlFor="show_in_footer"
                          className="text-sm text-gray-300"
                        >
                          Show in Footer
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="show_in_header"
                          name="show_in_header"
                          checked={form.show_in_header}
                          onChange={handleChange}
                          className="h-4 w-4 cursor-pointer rounded border-gray-600 text-teal-600 focus:ring-teal-500"
                        />
                        <label
                          htmlFor="show_in_header"
                          className="text-sm text-gray-300"
                        >
                          Show in Header
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Content
                      </label>
                      <div className="border border-gray-800 rounded-md bg-gray-900">
                        <Editor
                          apiKey={import.meta.env.VITE_TINY_APIKEY}
                          value={form.description}
                          onEditorChange={(val) =>
                            setForm((prev) => ({
                              ...prev,
                              description: val,
                            }))
                          }
                          onInit={(_, editor) => {
                            editorRef.current = editor;
                          }}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | fontselect fontsizeselect | " +
                              "bold italic underline removeformat | forecolor backcolor | " +
                              "alignleft aligncenter alignright alignjustify | " +
                              "bullist numlist outdent indent | link image media table | " +
                              "preview fullscreen | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className={
                          "inline-flex items-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none cursor-pointer disabled:opacity-50" +
                          (successButton
                            ? " border-2 border-green-500 shadow-green-400"
                            : "")
                        }
                        style={
                          successButton
                            ? {
                                borderColor: "#22c55e",
                                boxShadow:
                                  "0 0 0 2px #22c55e66, 0 2px 4px 0 #22c55e33",
                                transition:
                                  "border-color 0.2s, box-shadow 0.2s",
                              }
                            : {}
                        }
                      >
                        {saving ? (
                          <Loader2 className="mr-2 animate-spin" />
                        ) : editingId ? (
                          <Pencil className="mr-2 h-4 w-4" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {editingId ? "Update Link" : "Add Link"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-600 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Existing Links</h3>
                <p className="text-gray-400 mb-3">
                  {links.length} link{links.length !== 1 ? "s" : ""} found
                </p>
                <div className="py-6 pt-0">
                  <div className="rounded-md border border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                            Slug
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                            Location
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {links.length > 0 ? (
                          links.map((link) => (
                            <tr key={link.id} className="hover:bg-gray-800/50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                {link.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                                <code className="bg-gray-800 rounded px-2 py-1">
                                  {link.slug}
                                </code>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                                <div className="flex gap-2">
                                  {link.show_in_footer && (
                                    <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                                      Footer
                                    </span>
                                  )}
                                  {link.show_in_header && (
                                    <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                                      Header
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEdit(link)}
                                    className="inline-flex cursor-pointer items-center rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700 text-gray-300"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(link)}
                                    className="inline-flex items-center cursor-pointer rounded-md border border-red-600 bg-red-900/30 p-2 hover:bg-red-800/50 text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-sm text-gray-400"
                            >
                              No links found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateFooterRoute;
