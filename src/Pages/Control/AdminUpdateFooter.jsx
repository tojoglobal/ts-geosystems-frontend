import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";
import { FaCloudUploadAlt } from "react-icons/fa";

const AdminUpdateFooter = () => {
  const axiosPublic = useAxiospublic();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    mailing_title: "",
    mailing_text: "",
    bg_color: "#16181a",
    iso_image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Track old image separately
  const [oldImageUrl, setOldImageUrl] = useState("");

  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true);
      try {
        const res = await axiosPublic.get("/api/footer");
        if (res.data?.data) {
          const { iso_image_url, ...rest } = res.data.data;
          setFormData({
            ...rest,
            bg_color: res.data.data.bg_color || "#16181a",
            iso_image_url: iso_image_url || "",
          });
          setOldImageUrl(iso_image_url || "");
          setImagePreview(
            iso_image_url
              ? `${import.meta.env.VITE_OPEN_APIURL || ""}${iso_image_url}`
              : ""
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.message || "Failed to fetch footer data",
          "error"
        );
      }
      setLoading(false);
    };
    fetchFooter();
  }, [axiosPublic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Only update imageFile if a new image is selected
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear the current image URL when new file is selected
      setFormData((prev) => ({ ...prev, iso_image_url: "" }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, iso_image_url: "" }));
    // Restore old image if exists
    if (oldImageUrl) {
      setImagePreview(
        `${import.meta.env.VITE_OPEN_APIURL || ""}${oldImageUrl}`
      );
    }
  };

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

      // Only append image if new file was selected
      if (imageFile) {
        fd.append("iso_image", imageFile);
      }

      // Always send the old image URL for reference
      fd.append("old_iso_image_url", oldImageUrl);

      const res = await axiosPublic.put("/api/footer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire("Success", "Footer updated successfully!", "success");
        // Update both URLs if a new image was uploaded
        if (res.data.iso_image_url) {
          setFormData((prev) => ({
            ...prev,
            iso_image_url: res.data.iso_image_url,
          }));
          setOldImageUrl(res.data.iso_image_url);
        }
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Admin Update Footer
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block font-medium mb-2">Address Line 1</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white"
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
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white"
              required
            />
          </div>
          {/* ISO Image Upload */}
          <div className="relative flex items-center gap-4">
            <label className="flex flex-col items-center p-4 bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 transition">
              <FaCloudUploadAlt size={32} className="mb-2 text-teal-500" />
              <span className="text-sm text-gray-300 mb-1">
                {imageFile ? "Replace image" : "Click to upload ISO image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {(imagePreview || oldImageUrl) && (
                <img
                  src={
                    imagePreview ||
                    `${import.meta.env.VITE_OPEN_APIURL || ""}${oldImageUrl}`
                  }
                  alt="ISO Preview"
                  className="h-16 mb-1 mt-2 rounded shadow border border-gray-600"
                />
              )}
            </label>
            {(imageFile || formData.iso_image_url) && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 border border-red-900"
              >
                Remove
              </button>
            )}
          </div>
          {!imageFile && oldImageUrl && (
            <div className="text-xs text-gray-400 mt-2">
              Current image will be kept unless replaced
            </div>
          )}
          {/* Mailing */}
          <div>
            <label className="block font-medium mb-2">Mailing Title</label>
            <input
              type="text"
              name="mailing_title"
              value={formData.mailing_title}
              onChange={handleChange}
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white"
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
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white"
              required
            />
          </div>
          {/* Color controls */}
          <div>
            <label className="block font-medium mb-2">
              Footer Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="bg_color"
                value={formData.bg_color}
                onChange={handleChange}
                className="border border-neutral-700 bg-neutral-900 px-2 py-1 rounded text-white"
                placeholder="#HEX or rgb()"
                style={{ width: 140 }}
              />
              <input
                type="color"
                name="bg_color"
                value={formData.bg_color}
                onChange={handleChange}
                className="h-10 w-14 border cursor-pointer rounded bg-neutral-900"
                style={{ backgroundColor: "transparent" }}
              />
              <span
                className="w-7 h-7 rounded-full border border-neutral-700"
                style={{
                  backgroundColor: formData.bg_color,
                  display: "inline-block",
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded font-semibold transition disabled:opacity-50 mt-4 w-full"
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
