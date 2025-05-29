import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminUpdateFooter = () => {
  const axiosPublic = useAxiospublic();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    mailing_title: "",
    mailing_text: "",
    bg_color: "#585c5d",
    iso_image_url: "",
    old_iso_image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch current footer data
  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true);
      try {
        const res = await axiosPublic.get("/api/footer");
        if (res.data?.data) {
          setFormData({
            address1: res.data.data.address1 || "",
            address2: res.data.data.address2 || "",
            mailing_title: res.data.data.mailing_title || "",
            mailing_text: res.data.data.mailing_text || "",
            bg_color: res.data.data.bg_color || "#585c5d",
            iso_image_url: res.data.data.iso_image_url || "",
            old_iso_image_url: res.data.data.iso_image_url || "",
          });
          setImagePreview(
            res.data.data.iso_image_url
              ? `${import.meta.env.VITE_OPEN_APIURL || ""}${
                  res.data.data.iso_image_url
                }`
              : ""
          );
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          "Error",
          error.message || "Failed to fetch footer data",
          "error"
        );
      }
      setLoading(false);
    };
    fetchFooter();
    // eslint-disable-next-line
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("address1", formData.address1);
      fd.append("address2", formData.address2);
      fd.append("mailing_title", formData.mailing_title);
      fd.append("mailing_text", formData.mailing_text);
      fd.append("bg_color", formData.bg_color);
      fd.append("iso_image_url", formData.iso_image_url || "");
      fd.append("old_iso_image_url", formData.old_iso_image_url || "");
      if (imageFile) fd.append("iso_image", imageFile);

      const res = await axiosPublic.put("/api/footer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        Swal.fire("Success", "Footer updated successfully!", "success");
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || error.message || "Update failed",
        "error"
      );
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Update Footer</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-2">Address Line 1</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Address Line 2</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">ISO Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="ISO Preview"
                className="h-16 mb-2 rounded"
              />
            )}
          </div>
          <div>
            <label className="block font-medium mb-2">Mailing Title</label>
            <input
              type="text"
              name="mailing_title"
              value={formData.mailing_title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">
              Mailing Description
            </label>
            <textarea
              name="mailing_text"
              value={formData.mailing_text}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">
              Footer Background Color
            </label>
            <input
              type="color"
              name="bg_color"
              value={formData.bg_color}
              onChange={handleChange}
              className="h-8 w-20 border rounded"
            />
            <span className="ml-3">{formData.bg_color}</span>
          </div>
          <button
            type="submit"
            className="bg-[#e62245] text-white px-6 py-2 rounded font-semibold hover:bg-[#c81e3c] disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminUpdateFooter;
