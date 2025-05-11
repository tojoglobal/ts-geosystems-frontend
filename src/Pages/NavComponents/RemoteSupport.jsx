import { useState } from "react";

const RemoteSupport = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="max-w-md min-h-[60vh] mx-auto mt-20 p-4 relative">
      {/* Under Development Banner */}
      <div className="absolute -top-3 -right-3 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium transform rotate-6 shadow-md z-10">
        Under Development
      </div>

      <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-6xl font-bold text-yellow-400 rotate-45">
            NOT COMPLETED
          </span>
        </div>

        <h1 className="text-3xl text-center font-medium text-gray-800 mb-8 relative">
          Join a Session
        </h1>
        <div className="space-y-4 relative">
          <div className="relative">
            <input
              type="text"
              id="sessionCode"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-400 bg-white/80"
              placeholder={
                sessionCode || !isFocused ? "Enter Session Code" : ""
              }
              disabled
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
          <button
            className="w-full bg-gray-400 text-white py-3 rounded transition-colors cursor-not-allowed"
            disabled
          >
            Join (Disabled)
          </button>
        </div>

        <div className="mt-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-medium">Note:</p>
          <p>
            This feature is currently under development and not yet functional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoteSupport;

{/* <div className="max-w-md min-h-[70vh] mx-auto mt-20 p-4">
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
</div>; */}