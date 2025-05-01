const OurYoutube = () => {
  return (
    <div className="py-6 md:py-16">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-9 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            OUR YOUTUBE CHANNEL
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          <div className="youtube-video aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-56"
              src="https://www.youtube.com/embed/Mt4ILldx420?si=V0S_DdPTtR0UTQNb"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="youtube-video aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-56"
              src="https://www.youtube.com/embed/-iDZRbGZ-1s?si=BfiabgXkh4hXjpZR"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="youtube-video aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-56"
              src="https://www.youtube.com/embed/P_ytAXVOpHQ?si=Ug4N5w4bYZ4txGDp"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurYoutube;
