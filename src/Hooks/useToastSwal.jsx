import Swal from "sweetalert2";

const TOAST_CONFIGS = {
  success: {
    icon: "success",
    background: "#f7fff9",
    position: "top-end",
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    customClass: { popup: "swal2-border-radius" },
    didOpen: (toast) => {
      toast.style.boxShadow = "0 4px 20px rgba(39,174,96,0.15)";
    },
  },
  error: {
    icon: "error",
    background: "#fff6f6",
    position: "top-end",
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    customClass: { popup: "swal2-border-radius" },
    didOpen: (toast) => {
      toast.style.boxShadow = "0 4px 20px rgba(192,57,43,0.13)";
    },
  },
};

export default function useToastSwal() {
  /**
   * Show a SweetAlert2 toast
   * @param {"success"|"error"} type Toast type
   * @param {string} title Main title (HTML allowed)
   * @param {string} [message] Optional message (HTML allowed)
   * @param {object} [options] Optional extra Swal options
   */
  const showToast = (type, title, message = "", options = {}) => {
    const config = TOAST_CONFIGS[type] || TOAST_CONFIGS.success;
    Swal.fire({
      title: `<span style="font-weight:bold; color:${
        type === "success" ? "#27ae60" : "#c0392b"
      };">${title}</span>`,
      html: message,
      ...config,
      ...options,
    });
  };

  return showToast;
}
