import React from "react";
import { Helmet } from "react-helmet-async";

export default function ScriptInjector({ settings }) {
  if (!settings) return null;

  // Google Analytics
  const gaEnabled = settings.enable_google_analytics;
  const gaCode = settings.google_analytics_code;

  // Google Adsense
  const adsenseEnabled = settings.enable_google_adsense;
  const adsenseCode = settings.google_adsense_code;

  // Google Recaptcha
  const recaptchaEnabled = settings.display_google_recaptcha;
  const recaptchaSiteKey = settings.google_recaptcha_site_key;

  // Facebook Pixel
  const fbPixelEnabled = settings.display_facebook_pixel;
  const fbPixelCode = settings.facebook_pixel_code;

  // Facebook Messenger
  const fbMessengerEnabled = settings.display_facebook_messenger;
  const fbMessengerPageId = settings.facebook_messenger_page_id;

  // Disqus
  const disqusEnabled = settings.display_disqus;
  const disqusLink = settings.disqus_link;

  return (
    <Helmet>
      {/* Google Analytics */}
      {gaEnabled && gaCode && <script type="text/javascript">{gaCode}</script>}
      {/* Google Adsense */}
      {adsenseEnabled && adsenseCode && (
        <script type="text/javascript">{adsenseCode}</script>
      )}
      {/* Google Recaptcha */}
      {recaptchaEnabled && recaptchaSiteKey && (
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
        />
      )}
      {/* Facebook Pixel */}
      {fbPixelEnabled && fbPixelCode && (
        <script type="text/javascript">{fbPixelCode}</script>
      )}
      {/* Facebook Messenger */}
      {fbMessengerEnabled && fbMessengerPageId && (
        <script type="text/javascript">{`
          window.fbAsyncInit = function() {
            FB.init({
              xfbml            : true,
              version          : 'v11.0'
            });
          };
          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
        `}</script>
      )}
      {fbMessengerEnabled && fbMessengerPageId && (
        <div
          className="fb-customerchat"
          attribution="setup_tool"
          page_id={fbMessengerPageId}
        ></div>
      )}

      {/* Disqus */}
      {disqusEnabled && disqusLink && (
        <script type="text/javascript">{`
          var disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = window.location.pathname;
          };
          (function() {
            var d = document, s = d.createElement('script');
            s.src = '${disqusLink}';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
          })();
        `}</script>
      )}
    </Helmet>
  );
}
