import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import useToastSwal from "../../Hooks/useToastSwal";

// Chip input component
function TagInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = (v) => {
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
  };
  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800">
      {value.map((tag, idx) => (
        <span
          key={tag}
          className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-xs font-semibold"
        >
          {tag}
          <button
            type="button"
            aria-label="Remove"
            className="ml-1 cursor-pointer text-blue-600 hover:text-red-500"
            onClick={() => {
              const t = value.slice();
              t.splice(idx, 1);
              onChange(t);
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            add(input.trim());
            setInput("");
          } else if (e.key === "Backspace" && !input && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
    </div>
  );
}

const sidebarItems = [
  { key: "basic", label: "Basic Information" },
  { key: "media", label: "Media" },
  { key: "seo", label: "SEO" },
  { key: "script", label: "Script" }, // new tab
];

const defaultValues = {
  appName: "",
  homeTitle: "",
  mainLogo: "",
  favicon: "",
  metaKeywords: [],
  metaDescription: "",

  // New fields for extra features
  decimalSeparatorEnable: false,
  decimalSeparator: "off",
  currencyDirectionEnable: false,
  currencyDirection: "left",
  decimalSeparatorSelectorEnable: false,
  decimalSeparatorSelector: "dot",
  thousandSeparatorEnable: false,
  thousandSeparator: "dot",

  // Script tab
  enableGoogleAnalytics: false,
  googleAnalyticsCode: "",
  enableGoogleAdsense: false,
  googleAdsenseCode: "",
  displayGoogleRecaptcha: false,
  googleRecaptchaSiteKey: "",
  googleRecaptchaSecretKey: "",
  displayFacebookPixel: false,
  facebookPixelCode: "",
  displayFacebookMessenger: false,
  facebookMessengerPageId: "",
  displayDisqus: false,
  disqusLink: "",
};

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/settings`;

const SettingsPage = () => {
  const showToast = useToastSwal();
  const [activeTab, setActiveTab] = useState("basic");
  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ defaultValues });

  // Fetch current settings on mount

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        const d = res.data;
        // Helper to ensure boolean
        const toBool = (v) => v === true || v === 1 || v === "1";

        reset({
          appName: d.app_name || "",
          homeTitle: d.home_title || "",
          mainLogo: d.main_logo || "",
          favicon: d.favicon || "",
          metaKeywords: Array.isArray(d.meta_keywords) ? d.meta_keywords : [],
          metaDescription: d.meta_description || "",

          // Extra fields, all checkbox fields use toBool
          decimalSeparatorEnable: toBool(d.decimal_separator_enable),
          decimalSeparator: d.decimal_separator || "off",
          currencyDirectionEnable: toBool(d.currency_direction_enable),
          currencyDirection: d.currency_direction || "left",
          decimalSeparatorSelectorEnable: toBool(
            d.decimal_separator_selector_enable
          ),
          decimalSeparatorSelector: d.decimal_separator_selector || "dot",
          thousandSeparatorEnable: toBool(d.thousand_separator_enable),
          thousandSeparator: d.thousand_separator || "dot",

          // Script tab
          enableGoogleAnalytics: toBool(d.enable_google_analytics),
          googleAnalyticsCode: d.google_analytics_code || "",
          enableGoogleAdsense: toBool(d.enable_google_adsense),
          googleAdsenseCode: d.google_adsense_code || "",
          displayGoogleRecaptcha: toBool(d.display_google_recaptcha),
          googleRecaptchaSiteKey: d.google_recaptcha_site_key || "",
          googleRecaptchaSecretKey: d.google_recaptcha_secret_key || "",
          displayFacebookPixel: toBool(d.display_facebook_pixel),
          facebookPixelCode: d.facebook_pixel_code || "",
          displayFacebookMessenger: toBool(d.display_facebook_messenger),
          facebookMessengerPageId: d.facebook_messenger_page_id || "",
          displayDisqus: toBool(d.display_disqus),
          disqusLink: d.disqus_link || "",
        });
        setLogoPreview(d.main_logo || "");
        setFaviconPreview(d.favicon || "");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // Handle logo file selection and preview
  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle favicon file selection and preview
  const handleFaviconFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFaviconPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // File upload logic, returns uploaded path or existing path
  const uploadFile = async (file, type) => {
    if (!file) return getValues(type === "mainLogo" ? "mainLogo" : "favicon");
    const formData = new FormData();
    formData.append(type, file);
    const url = `${API_URL}/upload/${type}`;
    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  // Save handler
  const onSubmit = async (data) => {
    try {
      // Upload files first if new are selected
      let mainLogoUrl = await uploadFile(logoFile, "mainLogo");
      let faviconUrl = await uploadFile(faviconFile, "favicon");

      // Save settings (text fields + file paths + new fields)
      const res = await axios.put(API_URL, {
        appName: data.appName,
        homeTitle: data.homeTitle,
        mainLogo: mainLogoUrl,
        favicon: faviconUrl,
        metaKeywords: data.metaKeywords,
        metaDescription: data.metaDescription,
        decimalSeparatorEnable: data.decimalSeparatorEnable,
        decimalSeparator: data.decimalSeparator,
        currencyDirectionEnable: data.currencyDirectionEnable,
        currencyDirection: data.currencyDirection,
        decimalSeparatorSelectorEnable: data.decimalSeparatorSelectorEnable,
        decimalSeparatorSelector: data.decimalSeparatorSelector,
        thousandSeparatorEnable: data.thousandSeparatorEnable,
        thousandSeparator: data.thousandSeparator,

        // Script tab fields
        enableGoogleAnalytics: data.enableGoogleAnalytics,
        googleAnalyticsCode: data.googleAnalyticsCode,
        enableGoogleAdsense: data.enableGoogleAdsense,
        googleAdsenseCode: data.googleAdsenseCode,
        displayGoogleRecaptcha: data.displayGoogleRecaptcha,
        googleRecaptchaSiteKey: data.googleRecaptchaSiteKey,
        googleRecaptchaSecretKey: data.googleRecaptchaSecretKey,
        displayFacebookPixel: data.displayFacebookPixel,
        facebookPixelCode: data.facebookPixelCode,
        displayFacebookMessenger: data.displayFacebookMessenger,
        facebookMessengerPageId: data.facebookMessengerPageId,
        displayDisqus: data.displayDisqus,
        disqusLink: data.disqusLink,
      });

      if (res.status === 200) {
        showToast("success", "Success!", "Settings saved!");
      }
    } catch (err) {
      console.error(err);
      window.alert("Failed to save settings.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="md:w-64 w-full  bg-gradient-to-br from-[#181c2a] via-[#22223b] to-[#151825] shadow-md border-r border-gray-200 dark:border-gray-700">
        <div className="py-8 px-6">
          <h2 className="text-xl font-bold mb-6 text-gray-100 ">Settings</h2>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 rounded-lg transition font-semibold
                  ${
                    activeTab === item.key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-100 hover:bg-blue-100  hover:text-blue-700 "
                  }
                `}
              >
                {item.label}
                {activeTab === item.key && <FaChevronRight />}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      {/* Right Section - Editable Form */}
      <main className="flex-1 p-4 md:p-10 flex flex-col items-center bg-gradient-to-br from-[#181c2a] via-[#22223b] to-[#151825] transition">
        {loading ? (
          <div className="text-white text-lg py-32">Loading...</div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-2xl space-y-10"
            encType="multipart/form-data"
          >
            {/* BASIC INFO */}
            {activeTab === "basic" && (
              <section>
                <h3 className="text-lg font-semibold mb-6 text-gray-100">
                  Basic Information
                </h3>
                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    App Name
                  </label>
                  <input
                    {...register("appName", {
                      required: "App name is required",
                    })}
                    type="text"
                    className={`input w-full border rounded-lg px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.appName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.appName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.appName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    Home Page Title
                  </label>
                  <input
                    {...register("homeTitle", {
                      required: "Home title is required",
                    })}
                    type="text"
                    className={`input w-full border rounded-lg px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.homeTitle ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.homeTitle && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.homeTitle.message}
                    </p>
                  )}
                </div>

                {/* ----------- EXTRA BASIC INFO FIELDS ----------- */}
                <div className="mt-8 grid gap-4">
                  {/* Decimal Separator enable */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      {...register("decimalSeparatorEnable")}
                      id="decimalSeparatorEnable"
                      className="mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor="decimalSeparatorEnable"
                      className="block cursor-pointer text-sm font-bold text-gray-100"
                    >
                      Enable Decimal Separator Selection
                    </label>
                    {watch("decimalSeparatorEnable") && (
                      <select
                        {...register("decimalSeparator")}
                        className="ml-4 border cursor-pointer px-2 py-1 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <option value="off">Off</option>
                        <option value="on">On</option>
                      </select>
                    )}
                  </div>
                  {/* Currency Direction */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      {...register("currencyDirectionEnable")}
                      id="currencyDirectionEnable"
                      className="mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor="currencyDirectionEnable"
                      className="block text-sm cursor-pointer font-bold text-gray-100"
                    >
                      Enable Currency Direction
                    </label>
                    {watch("currencyDirectionEnable") && (
                      <select
                        {...register("currencyDirection")}
                        className="ml-4 border cursor-pointer px-2 py-1 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    )}
                  </div>
                  {/* Decimal Separator selector */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      {...register("decimalSeparatorSelectorEnable")}
                      id="decimalSeparatorSelectorEnable"
                      className="mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor="decimalSeparatorSelectorEnable"
                      className="block text-sm cursor-pointer font-bold text-gray-100"
                    >
                      Enable Decimal Separator Selector
                    </label>
                    {watch("decimalSeparatorSelectorEnable") && (
                      <select
                        {...register("decimalSeparatorSelector")}
                        className="ml-4 border px-2 cursor-pointer py-1 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <option value="dot">Dot (.)</option>
                        <option value="comma">Comma (,)</option>
                      </select>
                    )}
                  </div>
                  {/* Thousand Separator selector */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      {...register("thousandSeparatorEnable")}
                      id="thousandSeparatorEnable"
                      className="mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor="thousandSeparatorEnable"
                      className="block text-sm font-bold cursor-pointer text-gray-100"
                    >
                      Enable Thousand Separator Selector
                    </label>
                    {watch("thousandSeparatorEnable") && (
                      <select
                        {...register("thousandSeparator")}
                        className="ml-4 border cursor-pointer px-2 py-1 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <option value="dot">Dot (.)</option>
                        <option value="comma">Comma (,)</option>
                      </select>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* MEDIA */}
            {activeTab === "media" && (
              <section>
                <h3 className="text-lg font-semibold mb-6 text-gray-100">
                  Media
                </h3>
                <div className="max-w-2xl h-40 mb-3">
                  <p>Current logo </p>
                  <div className="w-full">
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}${logoPreview}`}
                      alt="Logo Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    App Main Logo (140x140)
                  </label>
                  <div className="flex items-center gap-5">
                    <div className="w-23 h-20 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {logoPreview ? (
                        <img
                          src={`${
                            import.meta.env.VITE_OPEN_APIURL
                          }${logoPreview}`}
                          alt="Logo Preview"
                          className="object-cover w-full h-full"
                          style={{ width: 80, height: 80 }}
                        />
                      ) : (
                        <FiImage className="text-3xl text-blue-300" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFile}
                      className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a 140x140px logo. 1MB max.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    Favicon (16x16)
                  </label>
                  <div className="flex items-center gap-5">
                    <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {faviconPreview ? (
                        <img
                          src={`${
                            import.meta.env.VITE_OPEN_APIURL
                          }${faviconPreview}`}
                          alt="Favicon Preview"
                          className="object-cover w-full h-full"
                          style={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <FiUploadCloud className="text-lg text-blue-300" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconFile}
                      className="block w-full text-sm cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a 16x16px favicon. 256KB max.
                  </p>
                </div>
              </section>
            )}

            {/* SEO */}
            {activeTab === "seo" && (
              <section>
                <h3 className="text-lg font-semibold mb-6 text-gray-100">
                  SEO
                </h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    Site Meta Keywords
                  </label>
                  <Controller
                    control={control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press enter"
                      />
                    )}
                  />
                  <p className="text-xs text-gray-300 mt-1">
                    Enter keywords and press <b>Enter</b> or comma.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-100 mb-2">
                    Site Meta Description
                  </label>
                  <textarea
                    {...register("metaDescription", {
                      required: "Meta description is required",
                    })}
                    rows={4}
                    className={`input w-full border rounded-lg px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.metaDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter meta description..."
                  />
                  {errors.metaDescription && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.metaDescription.message}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* SCRIPT TAB */}
            {activeTab === "script" && (
              <section>
                <h3 className="text-lg font-semibold mb-6 text-gray-100">
                  Script
                </h3>
                <div className="space-y-5">
                  {/* Google Analytics */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("enableGoogleAnalytics")}
                        id="enableGoogleAnalytics"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="enableGoogleAnalytics"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Enable Google Analytics
                      </label>
                    </div>
                    {watch("enableGoogleAnalytics") && (
                      <textarea
                        {...register("googleAnalyticsCode")}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Paste Google Analytics code here"
                      />
                    )}
                  </div>
                  {/* Google Adsense */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("enableGoogleAdsense")}
                        id="enableGoogleAdsense"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="enableGoogleAdsense"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Enable Google Adsense Code
                      </label>
                    </div>
                    {watch("enableGoogleAdsense") && (
                      <textarea
                        {...register("googleAdsenseCode")}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Paste Google Adsense code here"
                      />
                    )}
                  </div>
                  {/* Google Recaptcha */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("displayGoogleRecaptcha")}
                        id="displayGoogleRecaptcha"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="displayGoogleRecaptcha"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Display Google Recaptcha
                      </label>
                    </div>
                    {watch("displayGoogleRecaptcha") && (
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          {...register("googleRecaptchaSiteKey", {
                            required: watch("displayGoogleRecaptcha"),
                          })}
                          placeholder="Google Recaptcha Site Key *"
                          className="w-full border cursor-pointer rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          {...register("googleRecaptchaSecretKey", {
                            required: watch("displayGoogleRecaptcha"),
                          })}
                          placeholder="Google Recaptcha Secret Key"
                          className="w-full border cursor-pointer rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                  {/* Facebook Pixel */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("displayFacebookPixel")}
                        id="displayFacebookPixel"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="displayFacebookPixel"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Display Facebook Pixel
                      </label>
                    </div>
                    {watch("displayFacebookPixel") && (
                      <textarea
                        {...register("facebookPixelCode")}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Paste Facebook Pixel code here"
                      />
                    )}
                  </div>
                  {/* Facebook Messenger */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("displayFacebookMessenger")}
                        id="displayFacebookMessenger"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="displayFacebookMessenger"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Display Facebook Messenger
                      </label>
                    </div>
                    {watch("displayFacebookMessenger") && (
                      <input
                        {...register("facebookMessengerPageId", {
                          required: watch("displayFacebookMessenger"),
                        })}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Facebook Messenger Page Id *"
                      />
                    )}
                  </div>
                  {/* Disqus */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <input
                        type="checkbox"
                        {...register("displayDisqus")}
                        id="displayDisqus"
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor="displayDisqus"
                        className="block text-sm cursor-pointer font-bold text-gray-100"
                      >
                        Display Disqus
                      </label>
                    </div>
                    {watch("displayDisqus") && (
                      <input
                        {...register("disqusLink", {
                          required: watch("displayDisqus"),
                        })}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Disqus Link *"
                      />
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold text-lg shadow transition-all duration-200"
                disabled={loading}
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
