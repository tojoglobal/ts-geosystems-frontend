import { useState } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { usePasswordToggle } from "../../utils/usePasswordToggle";

const AdminChangePassword = () => {
  const axiosPublicUrl = useAxiospublic();
  const [oldType, OldToggle] = usePasswordToggle();
  const [newType, NewToggle] = usePasswordToggle();
  const [confirmType, ConfirmToggle] = usePasswordToggle();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Fill all password fields.",
        timer: 4000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password mismatch",
        text: "New passwords do not match.",
        timer: 4000,
      });
      return;
    }
    // if (newPassword.length < 6) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Weak password",
    //     text: "New password must be at least 6 characters.",
    //   });
    //   return;
    // }
    if (oldPassword === newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Same as old",
        text: "New password cannot be the same as old password.",
        timer: 4000,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axiosPublicUrl.put("/api/admin/change-password", {
        oldPassword,
        newPassword,
      });
      setLoading(false);
      if (res.status === 200) {
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        Swal.fire({
          icon: "success",
          title: "Password changed!",
          text: "Your password was updated successfully.",
          timer: 4000,
        });
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.error || "Could not update password.",
        timer: 4000,
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center md:p-4">
      <form
        className="w-full max-w-md mx-auto bg-black/60 border-2 border-[#0ea5e9] shadow-xl rounded-3xl px-4 md:px-8 py-6 md:py-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
          Change Password
        </h2>
        <div className="mb-6">
          <label className="block text-gray-300 mb-1 font-medium">
            Old Password
          </label>
          <div className="relative">
            <input
              type={oldType}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg border border-[#232946] bg-[#1e213a] text-white focus:border-[#0ea5e9] focus:ring-[#0ea5e9] shadow"
              placeholder="Enter old password"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
              {OldToggle}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-1 font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              type={newType}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-[#232946] bg-[#1e213a] text-white focus:border-[#0ea5e9] focus:ring-[#0ea5e9] shadow"
              placeholder="Enter new password"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
              {NewToggle}
            </span>
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-gray-300 mb-1 font-medium">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={confirmType}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-[#232946] bg-[#1e213a] text-white focus:border-[#0ea5e9] focus:ring-[#0ea5e9] shadow"
              placeholder="Re-enter new password"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
              {ConfirmToggle}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] hover:from-[#22d3ee] hover:to-[#0ea5e9] text-white py-2 rounded-lg font-semibold text-lg shadow-lg transition-all duration-200"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
