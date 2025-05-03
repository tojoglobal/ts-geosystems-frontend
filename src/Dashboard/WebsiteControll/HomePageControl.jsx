import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { toast } from "react-toastify";

const HomePageControl = () => {
  const axiosPublicUrl = useAxiospublic();
  const [enabledComponents, setEnabledComponents] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepageControl"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/homepage-control");
      return res?.data?.components;
    },
  });
  // Set fetched data to local state
  useEffect(() => {
    if (data) {
      setEnabledComponents(data);
    }
  }, [data]);

  // Toggle individual component on checkbox change
  const handleToggle = (component) => {
    setEnabledComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  // Handle save manually using PUT request
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axiosPublicUrl.put("/api/homepage-control", {
        components: enabledComponents,
      });
      if (res.data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load settings.
      </div>
    );
  }

  const componentKeys = Object.keys(enabledComponents);

  return (
    <div className="max-w-5xl mx-auto px-4 mt-7 mb-2">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold">Home Page Component Control</h2>
        <p className="text-gray-400 mt-1">
          Enable or disable sections on the home page. Changes will affect all
          visitors.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {componentKeys.map((component) => (
          <label
            key={component}
            className={`flex items-center space-x-3 cursor-pointer select-none border rounded-md p-3 transition-all duration-200 ${
              enabledComponents[component]
                ? "border-[#0b6d7f] bg-[#0b6d7f]/10"
                : "border-gray-500"
            }`}
          >
            <input
              type="checkbox"
              checked={enabledComponents[component]}
              onChange={() => handleToggle(component)}
              className="w-4 h-4 accent-[#0b6d7f]"
            />
            <span className="text-base">{component}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-[#0b6d7f] text-white font-bold rounded transition hover:bg-[#095666] disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default HomePageControl;
