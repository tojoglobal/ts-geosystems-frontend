import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";
import { FaCloudUploadAlt, FaTimesCircle } from "react-icons/fa"; // Added FaTimesCircle for remove button

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
    // Array to hold the image URLs from the backend
    iso_image_urls: ["", "", ""], // Initialize with 3 empty strings
  });

  // State to hold new image files selected by the user, indexed 0 to 2
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  // State to hold image previews (data URLs or fetched URLs)
  const [imagePreviews, setImagePreviews] = useState(["", "", ""]);
  // Track old image URLs loaded from the database
  const [oldImageUrls, setOldImageUrls] = useState(["", "", ""]);
  // State to signal if an image at a specific index should be removed
  const [shouldRemoveImage, setShouldRemoveImage] = useState([
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true);
      try {
        const res = await axiosPublic.get("/api/footer");
        if (res.data?.data) {
          const fetchedData = res.data.data;
          const urls = [
            fetchedData.iso_image_url_1 || "",
            fetchedData.iso_image_url_2 || "",
            fetchedData.iso_image_url_3 || "",
          ];

          setFormData((prev) => ({
            ...prev,
            ...fetchedData, // Copy all other fields
            bg_color: fetchedData.bg_color || "#16181a",
            iso_image_urls: urls,
          }));
          setOldImageUrls(urls); // Store original URLs
          // Create previews from fetched URLs
          setImagePreviews(
            urls.map((url) =>
              url ? `${import.meta.env.VITE_OPEN_APIURL || ""}${url}` : ""
            )
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

  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setImagePreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });

      setShouldRemoveImage((prev) => {
        const newRemoveFlags = [...prev];
        newRemoveFlags[index] = false; // If a new image is selected, don't remove it
        return newRemoveFlags;
      });

      // Clear the current image URL in formData for this specific index if a new file is selected
      setFormData((prev) => {
        const newUrls = [...prev.iso_image_urls];
        newUrls[index] = "";
        return { ...prev, iso_image_urls: newUrls };
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = "";
      return newPreviews;
    });

    setFormData((prev) => {
      const newUrls = [...prev.iso_image_urls];
      newUrls[index] = ""; // Clear the URL in form data for this index
      return { ...prev, iso_image_urls: newUrls };
    });

    setShouldRemoveImage((prev) => {
      const newRemoveFlags = [...prev];
      newRemoveFlags[index] = true; // Signal that this image should be removed
      return newRemoveFlags;
    });
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

      // Loop through each potential image slot (0, 1, 2)
      for (let i = 0; i < 3; i++) {
        // Scenario 1: A new image file is selected for this slot
        if (imageFiles[i]) {
          fd.append(`iso_image_${i + 1}`, imageFiles[i]);
          fd.append(`old_iso_image_url_${i + 1}`, oldImageUrls[i] || ""); // Send old for deletion on backend
        }
        // Scenario 2: User explicitly clicked "Remove" for this slot
        else if (shouldRemoveImage[i]) {
          fd.append(`remove_iso_image_${i + 1}`, "true"); // Signal removal
          fd.append(`old_iso_image_url_${i + 1}`, oldImageUrls[i] || ""); // Send old URL to delete
        }
        // Scenario 3: No new image, and not explicitly removed (keep existing)
        else {
          // If no new file and not marked for removal, send the existing URL back
          fd.append(
            `iso_image_url_${i + 1}`,
            oldImageUrls[i] || "" // Send the original URL if no change
          );
        }
      }

      const res = await axiosPublic.put("/api/footer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire("Success", "Footer updated successfully!", "success");
        // Update states with the new URLs returned from the backend
        const newUrls = [
          res.data.iso_image_url_1 || "",
          res.data.iso_image_url_2 || "",
          res.data.iso_image_url_3 || "",
        ];
        setOldImageUrls(newUrls); // Update original URLs for next edit
        setFormData((prev) => ({
          ...prev,
          iso_image_urls: newUrls,
        }));
        setImagePreviews(
          newUrls.map((url) =>
            url ? `${import.meta.env.VITE_OPEN_APIURL || ""}${url}` : ""
          )
        );
        setImageFiles([null, null, null]); // Clear new files after successful upload
        setShouldRemoveImage([false, false, false]); // Reset remove flags
      }
    } catch (error) {
      console.error("Update error:", error); // Log the full error for debugging
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
      <h2 className="text-2xl font-bold mb-6">Admin Update Footer</h2>
      {loading ? (
        <Loader />
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
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
          <div className="w-full flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2">
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
          </div>
          {/* Multiple ISO Image Uploads */}
          <h3 className="text-xl font-semibold mt-8 mb-4">
            ISO Images (Max 3)
          </h3>
          <div className="flex w-full gap-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="relative flex items-center gap-4 mb-4"
              >
                <label className="flex flex-col items-center p-4 bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 transition w-full">
                  <FaCloudUploadAlt size={32} className="mb-2 text-teal-500" />
                  <span className="text-sm text-gray-300 mb-1">
                    {imageFiles[index]
                      ? `Replace image ${index + 1}`
                      : imagePreviews[index]
                      ? `Change image ${index + 1}`
                      : `Click to upload ISO image ${index + 1}`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="hidden"
                  />
                  {imagePreviews[index] && (
                    <img
                      src={imagePreviews[index]}
                      alt={`ISO Preview ${index + 1}`}
                      className="h-16 mb-1 mt-2 rounded shadow border border-gray-600"
                    />
                  )}
                </label>
                {(imageFiles[index] || oldImageUrls[index]) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
                    title={`Remove image ${index + 1}`}
                  >
                    <FaTimesCircle size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
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
