import { useState } from "react";
import { Lock } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import axios from "axios";

// Optional: Add a subtle animated gradient background
const AnimatedBackground = () => (
  <div
    className="fixed inset-0 z-[900] pointer-events-none"
    style={{
      background:
        "linear-gradient(120deg, #0ea5e9 0%, #232946 40%, #12131a 100%)",
      opacity: 0.6,
      animation: "bg-pan 10s infinite linear",
      backgroundSize: "400% 400%",
    }}
  />
);

export default function ScreenLockOverlay({ userEmail }) {
  const { locked, unlockScreen } = useAppContext();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!locked) return null;

  const handleUnlock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_OPEN_APIURL}/api/admin/unlock`,
        { password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setPassword("");
        unlockScreen();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Incorrect password!");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-all duration-300">
      {/* Animated subtle gradient background */}
      <AnimatedBackground />
      {/* Glassmorphic card */}
      <div className="relative bg-white/10 z-[1002] backdrop-blur-2xl border-2 border-[#0ea5e9] rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center w-full max-w-md animate-fade-in">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center bg-gradient-to-tr from-[#0ea5e9] to-[#22d3ee] rounded-full p-4 shadow-xl">
          <Lock size={48} className="text-white drop-shadow-xl" />
        </div>
        <div className="mt-8 text-2xl font-extrabold text-white text-center tracking-wide drop-shadow">
          Screen Locked
        </div>
        <div className="text-base font-medium text-[#bae6fd] mb-4 text-center">
          {userEmail ? userEmail : "Enter your password to unlock."}
        </div>
        <form
          onSubmit={handleUnlock}
          className="w-full flex flex-col gap-4 mt-4"
        >
          <input
            type="password"
            autoFocus
            placeholder="Password"
            disabled={submitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#0ea5e9] bg-[#181c2a]/80 text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] placeholder:text-[#82aaff] shadow"
          />
          {error && (
            <div className="text-red-400 text-sm text-center font-semibold">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] hover:from-[#22d3ee] hover:to-[#0ea5e9] text-white py-3 px-8 rounded-xl font-bold text-lg shadow-xl transition-all duration-200 tracking-wider"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-50"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fff"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="#0ea5e9"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Unlocking...
              </span>
            ) : (
              "Unlock"
            )}
          </button>
        </form>
        <div className="mt-6 text-xs text-[#82aaff] text-center opacity-80 select-none">
          Tip: For your security, the app is locked. Please enter your password
          to continue.
        </div>
      </div>
      <style>{`
        @keyframes bg-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
