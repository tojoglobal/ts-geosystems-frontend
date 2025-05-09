import React from "react";
function Button({ text }) {
  return (
    <button
      type="submit"
      className="w-full bg-teal-600 text-white py-2 px-4 rounded-sm hover:bg-teal-700 transition"
    >
      {text}
    </button>
  );
}

export default Button;
