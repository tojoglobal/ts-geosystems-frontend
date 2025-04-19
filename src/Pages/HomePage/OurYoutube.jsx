const OurYoutube = () => {
    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex-1 h-0.5 bg-[#e62245]"></div>
                    <h2 className="text-center text-4xl font-bold text-[#e62245]">
                        OUR YOUTUBE CHANNEL
                    </h2>
                    <div className="flex-1 h-0.5 bg-[#e62245]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="youtube-video">
                        <iframe
                            width="490"
                            height="250"
                            src="https://www.youtube.com/embed/Mt4ILldx420?si=V0S_DdPTtR0UTQNb"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <div className="youtube-video">
                        <iframe
                            width="490"
                            height="250"
                            src="https://www.youtube.com/embed/-iDZRbGZ-1s?si=BfiabgXkh4hXjpZR"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <div className="youtube-video">
                        <iframe
                            width="490"
                            height="250"
                            src="https://www.youtube.com/embed/P_ytAXVOpHQ?si=Ug4N5w4bYZ4txGDp"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurYoutube;