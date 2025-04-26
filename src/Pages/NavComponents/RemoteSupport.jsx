import { useState } from "react";

const RemoteSupport = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // console.log(sessionCode);

  return (
    <div className="max-w-md min-h-[70vh] mx-auto mt-20 p-4">
      <h1 className="text-3xl text-center font-medium text-gray-800 mb-8">
        Join a Session
      </h1>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            id="sessionCode"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-400"
            placeholder={sessionCode || !isFocused ? "Enter Session Code" : ""}
          />
          {(sessionCode || isFocused) && (
            <label
              htmlFor="sessionCode"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600"
            >
              Enter Session Code
            </label>
          )}
        </div>
        <button className="w-full bg-[#bad632] text-white py-3 rounded hover:bg-opacity-90 transition-colors">
          Join
        </button>
      </div>
    </div>
  );
};

export default RemoteSupport;
