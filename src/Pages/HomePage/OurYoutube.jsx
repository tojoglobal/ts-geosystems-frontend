import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const OurYoutube = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = {} } = useQuery({
    queryKey: ["youtubeVideos"],
    queryFn: async () => (await axiosPublicUrl.get("/api/our-youtube")).data,
  });

  const { section_title, items = [] } = data;

  return (
    <div className="py-6 md:py-16">
      <div className="max-w-[1370px] mx-auto px-3 md:px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-9 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            {section_title}
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {items?.map((item, idx) => (
            <div
              key={item.id || idx}
              className="youtube-video aspect-w-16 aspect-h-9"
            >
              <iframe
                className="w-full h-56 rounded-sm"
                src={item.link}
                title={`YouTube video ${idx + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurYoutube;
