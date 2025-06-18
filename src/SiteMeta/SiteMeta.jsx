import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function SiteMeta({ settings }) {
  // Declare the hook unconditionally
  useEffect(() => {
    if (!settings) return;
    const { home_title, app_name, favicon, meta_keywords, meta_description } =
      settings;
    const faviconUrl = favicon
      ? favicon.startsWith("http")
        ? favicon
        : `${import.meta.env.VITE_OPEN_APIURL || ""}${favicon}`
      : "/favicon.png";
    const title = home_title || app_name || "TS Geosystems Bangladesh";
    const description =
      meta_description || "Leading Survey Equipment Supplier in Bangladesh";
    const keywords =
      Array.isArray(meta_keywords) && meta_keywords.length
        ? meta_keywords.join(",")
        : "Kolida,Sokkia,Topcon,Hi-Target,Leica,Total Station,Auto Level,Theodolite,RTK GNSS";

    if (faviconUrl) {
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/png";
      link.rel = "icon";
      link.href = faviconUrl;

      // Remove old favicons
      const head = document.getElementsByTagName("head")[0];
      const oldLinks = head.querySelectorAll("link[rel='icon']");
      oldLinks.forEach((el) => head.removeChild(el));

      head.appendChild(link);
    }

    if (title) {
      document.title = home_title || app_name || "TS Geosystems Bangladesh";
    }
    if (description) {
      document.description =
        meta_description || "Leading Survey Equipment Supplier in Bangladesh";
    }
    if (keywords) {
      document.keywords = keywords;
    }
  }, [settings]);

  // Early return is now safe
  if (!settings) return null;

  const { home_title, app_name, meta_keywords, meta_description, main_logo } =
    settings;

  const title = home_title || app_name || "TS Geosystems Bangladesh";
  const description =
    meta_description || "Leading Survey Equipment Supplier in Bangladesh";
  const keywords =
    Array.isArray(meta_keywords) && meta_keywords.length
      ? meta_keywords.join(",")
      : "Kolida,Sokkia,Topcon,Hi-Target,Leica,Total Station,Auto Level,Theodolite,RTK GNSS";

  const logoUrl =
    main_logo && (main_logo.startsWith("/") || main_logo.startsWith("http"))
      ? `${import.meta.env.VITE_OPEN_APIURL || ""}${main_logo}`
      : "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta name="author" content={app_name || "TS Geosystems Bangladesh"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:site_name"
        content={app_name || "TS Geosystems Bangladesh"}
      />
      {logoUrl && <meta property="og:image" content={logoUrl} />}
    </Helmet>
  );
}
