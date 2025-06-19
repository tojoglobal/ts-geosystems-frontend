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

    // Google Analytics
    if (settings.enable_google_analytics && settings.google_analytics_code) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_code}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${settings.google_analytics_code}');
  `;
      document.head.appendChild(inlineScript);
    }

    // Google Adsense
    if (settings.enable_google_adsense && settings.google_adsense_code) {
      const adsenseScript = document.createElement("script");
      adsenseScript.async = true;
      adsenseScript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      adsenseScript.setAttribute(
        "data-ad-client",
        settings.google_adsense_code
      );
      document.head.appendChild(adsenseScript);
    }

    // Facebook Pixel
    if (settings.display_facebook_pixel && settings.facebook_pixel_code) {
      const pixelScript = document.createElement("script");
      pixelScript.innerHTML = `
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
      n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${settings.facebook_pixel_code}');
    fbq('track', 'PageView');
  `;
      document.head.appendChild(pixelScript);
    }

    // Facebook Messenger
    if (
      settings.display_facebook_messenger &&
      settings.facebook_messenger_page_id
    ) {
      const messengerDiv = document.createElement("div");
      messengerDiv.id = "fb-root";
      document.body.appendChild(messengerDiv);

      const messengerScript = document.createElement("script");
      messengerScript.innerHTML = `
    window.fbAsyncInit = function() {
      FB.init({
        xfbml            : true,
        version          : 'v17.0'
      });
    };
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  `;
      document.body.appendChild(messengerScript);

      const chatPlugin = document.createElement("div");
      chatPlugin.className = "fb-customerchat";
      chatPlugin.setAttribute("attribution", "setup_tool");
      chatPlugin.setAttribute("page_id", settings.facebook_messenger_page_id);
      document.body.appendChild(chatPlugin);
    }

    // Google reCAPTCHA
    if (
      settings.display_google_recaptcha &&
      settings.google_recaptcha_site_key
    ) {
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${settings.google_recaptcha_site_key}`;
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);
    }

    // Disqus
    if (settings.display_disqus && settings.disqus_link) {
      const disqusScript = document.createElement("script");
      disqusScript.src = `https://${settings.disqus_link}.disqus.com/embed.js`;
      disqusScript.setAttribute("data-timestamp", +new Date());
      disqusScript.async = true;
      document.body.appendChild(disqusScript);
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
