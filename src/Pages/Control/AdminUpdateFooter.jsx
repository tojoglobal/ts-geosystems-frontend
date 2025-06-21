import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";
import { FaCloudUploadAlt, FaTimesCircle } from "react-icons/fa";
import AdminUpdateFooterRoute from "./AdminUpdateFooterRoute";

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
    iso_image_urls: ["", "", ""],
    payment_method_image_url: "",
  });

  // ISO images (3)
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState(["", "", ""]);
  const [oldImageUrls, setOldImageUrls] = useState(["", "", ""]);
  const [shouldRemoveImage, setShouldRemoveImage] = useState([
    false,
    false,
    false,
  ]);

  // Payment method image (single)
  const [paymentImageFile, setPaymentImageFile] = useState(null);
  const [paymentImagePreview, setPaymentImagePreview] = useState("");
  const [oldPaymentImageUrl, setOldPaymentImageUrl] = useState("");
  const [shouldRemovePaymentImage, setShouldRemovePaymentImage] =
    useState(false);

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
            ...fetchedData,
            bg_color: fetchedData.bg_color || "#16181a",
            iso_image_urls: urls,
            payment_method_image_url:
              fetchedData.payment_method_image_url || "",
          }));
          setOldImageUrls(urls);
          setImagePreviews(
            urls.map((url) =>
              url ? `${import.meta.env.VITE_OPEN_APIURL || ""}${url}` : ""
            )
          );
          setOldPaymentImageUrl(fetchedData.payment_method_image_url || "");
          setPaymentImagePreview(
            fetchedData.payment_method_image_url
              ? `${import.meta.env.VITE_OPEN_APIURL || ""}${
                  fetchedData.payment_method_image_url
                }`
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
        newRemoveFlags[index] = false;
        return newRemoveFlags;
      });

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
      newUrls[index] = "";
      return { ...prev, iso_image_urls: newUrls };
    });

    setShouldRemoveImage((prev) => {
      const newRemoveFlags = [...prev];
      newRemoveFlags[index] = true;
      return newRemoveFlags;
    });
  };

  // Payment method image handlers
  const handlePaymentImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentImageFile(file);
      setPaymentImagePreview(URL.createObjectURL(file));
      setShouldRemovePaymentImage(false);
      setFormData((prev) => ({ ...prev, payment_method_image_url: "" }));
    }
  };

  const handleRemovePaymentImage = () => {
    setPaymentImageFile(null);
    setPaymentImagePreview("");
    setFormData((prev) => ({ ...prev, payment_method_image_url: "" }));
    setShouldRemovePaymentImage(true);
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

      // ISO images (3)
      for (let i = 0; i < 3; i++) {
        if (imageFiles[i]) {
          fd.append(`iso_image_${i + 1}`, imageFiles[i]);
          fd.append(`old_iso_image_url_${i + 1}`, oldImageUrls[i] || "");
        } else if (shouldRemoveImage[i]) {
          fd.append(`remove_iso_image_${i + 1}`, "true");
          fd.append(`old_iso_image_url_${i + 1}`, oldImageUrls[i] || "");
        } else {
          fd.append(`iso_image_url_${i + 1}`, oldImageUrls[i] || "");
        }
      }

      // Payment method image logic (single file)
      if (paymentImageFile) {
        fd.append("payment_method_image", paymentImageFile);
        fd.append("old_payment_method_image_url", oldPaymentImageUrl || "");
      } else if (shouldRemovePaymentImage) {
        fd.append("remove_payment_method_image", "true");
        fd.append("old_payment_method_image_url", oldPaymentImageUrl || "");
      } else {
        fd.append("payment_method_image_url", oldPaymentImageUrl || "");
      }

      const res = await axiosPublic.put("/api/footer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire("Success", "Footer updated successfully!", "success");

        // Update ISO images state
        const newUrls = [
          res.data.iso_image_url_1 || "",
          res.data.iso_image_url_2 || "",
          res.data.iso_image_url_3 || "",
        ];
        setOldImageUrls(newUrls);
        setFormData((prev) => ({
          ...prev,
          iso_image_urls: newUrls,
        }));
        setImagePreviews(
          newUrls.map((url) =>
            url ? `${import.meta.env.VITE_OPEN_APIURL || ""}${url}` : ""
          )
        );
        setImageFiles([null, null, null]);
        setShouldRemoveImage([false, false, false]);

        // Update Payment Method image state
        const newPaymentMethodImageUrl =
          res.data.payment_method_image_url || "";
        setOldPaymentImageUrl(newPaymentMethodImageUrl);
        setFormData((prev) => ({
          ...prev,
          payment_method_image_url: newPaymentMethodImageUrl,
        }));
        setPaymentImagePreview(
          newPaymentMethodImageUrl
            ? `${
                import.meta.env.VITE_OPEN_APIURL || ""
              }${newPaymentMethodImageUrl}`
            : ""
        );
        setPaymentImageFile(null);
        setShouldRemovePaymentImage(false);
      }
    } catch (error) {
      console.error("Update error:", error);
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
      <h2 className="text-2xl font-bold mb-7 text-white">
        Admin Update Footer
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <form className="space-y-7" onSubmit={handleSubmit} autoComplete="off">
          {/* Color controls */}
          <div>
            <label className="block font-medium mb-1 text-gray-200">
              Footer Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="bg_color"
                value={formData.bg_color}
                onChange={handleChange}
                className="border border-neutral-700 bg-neutral-900 px-2 py-1 rounded text-white text-sm"
                placeholder="#HEX or rgb()"
                style={{ width: 120 }}
              />
              <input
                type="color"
                name="bg_color"
                value={formData.bg_color}
                onChange={handleChange}
                className="h-8 w-10 border cursor-pointer rounded bg-neutral-900"
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
              <label className="block font-medium mb-1 text-gray-200">
                Address Line 1
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white text-sm"
                required
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block font-medium mb-1 text-gray-200">
                Address Line 2
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white text-sm"
                required
              />
            </div>
          </div>
          {/* ISO Images */}
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-100">
            ISO Images (Max 3)
          </h3>
          <div className="flex w-full gap-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="relative flex flex-col items-center gap-1"
                style={{ minWidth: 120, maxWidth: 160 }}
              >
                <label className="flex flex-col items-center p-3 bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 transition w-full">
                  <FaCloudUploadAlt size={28} className="mb-1 text-teal-500" />
                  <span className="text-xs text-gray-300 mb-1 text-center">
                    {imageFiles[index]
                      ? `Replace image ${index + 1}`
                      : imagePreviews[index]
                      ? `Change image ${index + 1}`
                      : `Upload ISO image ${index + 1}`}
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
                      className="h-14 mb-1 mt-2 rounded shadow border border-gray-600"
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
                    <FaTimesCircle size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Payment Method Image (ISO) */}
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-100">
            Payment Method Image
          </h3>
          <div className="flex w-full gap-3">
            <div
              className="relative flex flex-col items-center gap-1"
              // style={{ minWidth: 120, maxWidth: 160 }}
            >
              <label className="flex flex-col items-center p-3 bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 transition w-full">
                <FaCloudUploadAlt size={28} className="mb-1 text-teal-500" />
                <span className="text-xs text-gray-300 mb-1 text-center">
                  {paymentImageFile
                    ? "Replace Payment Method Image"
                    : paymentImagePreview
                    ? "Change Payment Method Image"
                    : "Upload Payment Method Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentImageChange}
                  className="hidden"
                />
                {paymentImagePreview && (
                  <img
                    src={paymentImagePreview}
                    alt="Payment Method Preview"
                    className="h-14 mb-1 mt-2 rounded shadow border border-gray-600"
                  />
                )}
              </label>
              {(paymentImageFile || oldPaymentImageUrl) && (
                <button
                  type="button"
                  onClick={handleRemovePaymentImage}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
                  title="Remove Payment Method Image"
                >
                  <FaTimesCircle size={18} />
                </button>
              )}
            </div>
          </div>
          {/* Mailing */}
          <div>
            <label className="block font-medium mb-1 text-gray-200">
              Mailing Title
            </label>
            <input
              type="text"
              name="mailing_title"
              value={formData.mailing_title}
              onChange={handleChange}
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white text-sm"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-200">
              Mailing Description
            </label>
            <textarea
              name="mailing_text"
              value={formData.mailing_text}
              onChange={handleChange}
              rows={5}
              className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 rounded text-white text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-8 py-2 rounded font-semibold transition disabled:opacity-50 w-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
      <AdminUpdateFooterRoute />
    </div>
  );
};

export default AdminUpdateFooter;
