/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { toast } from "react-toastify";

const HomePageControl = () => {
  const axiosPublicUrl = useAxiospublic();
  const COMPONENTS = [
    "Banner",
    "ProductHighlights",
    "ExperienceCenter",
    "TotalStation",
    "WeProvide",
    "OurAchievements",
    "TopClients",
    "OurAdServices",
    "PopularBrands",
    "OurYoutube",
  ];

  const [enabledComponents, setEnabledComponents] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial component states
  useEffect(() => {
    const fetchComponentStates = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/homepage-control");
        if (res.data.success) {
          setEnabledComponents(res.data.components);
        } else {
          // If no data exists, set all to true by default for now, delete later after
          // adding into database
          setEnabledComponents(
            COMPONENTS.reduce((acc, component) => {
              acc[component] = true;
              return acc;
            }, {})
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load component settings");
      } finally {
        setLoading(false);
      }
    };

    fetchComponentStates();
  }, []);

  const handleToggle = (component) => {
    setEnabledComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await axiosPublicUrl.put("/api/homepage-control", {
        components: enabledComponents,
      });

      if (res.data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(res.data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving settings"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAll = () => {
    setEnabledComponents(
      COMPONENTS.reduce((acc, component) => {
        acc[component] = true;
        return acc;
      }, {})
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-7 mb-2">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold">Home Page Component Control</h2>{" "}
        <p className="text-gray-400 mt-1">
          Enable or disable sections on the home page. Changes will affect all
          visitors.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {COMPONENTS.map((component) => (
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
              checked={enabledComponents[component] || false}
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
        <button
          onClick={handleResetAll}
          className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default HomePageControl;
