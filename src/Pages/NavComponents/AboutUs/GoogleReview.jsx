import { useEffect } from "react";

const GoogleReview = () => {
  useEffect(() => {
    // Load the Elfsight platform script only once
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // clean up when component unmounts
    };
  }, []);

  return (
    <section className="pb-10">
      <div className="flex items-center justify-center gap-4 my-12">
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        <h2 className="text-xl md:text-2xl font-bold text-[#e62245] text-center">
          WHAT OUR CLIENTS SAY
        </h2>
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
      </div>

      {/* Elfsight Google Reviews Widget */}
      <div className="max-w-6xl mx-auto mt-10">
        <div
          className="elfsight-app-1462e729-0744-469a-9b50-a939b862f195"
          data-elfsight-app-lazy
        ></div>
      </div>
    </section>
  );
};

export default GoogleReview;
