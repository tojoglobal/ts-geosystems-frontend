const RelatedArticles = () => {
  const articles = [
    {
      id: 1,
      title: "GeoBusiness 2023 - Another Successful Exhibition",
      image:
        "https://dropinblog.net/34252524/files/featured/g2-survey-geobusiness-2023-stand.jpg",
      readTime: "1 minute read",
      date: "May 19th, 2023",
    },
    {
      id: 2,
      title: "G2 Survey at FutureBuild 2024 - Was Great!",
      image:
        "https://dropinblog.net/34252524/files/featured/FutureBuild2024.png",
      readTime: "3 minute read",
      date: "Mar 15th, 2024",
    },
    {
      id: 3,
      title: "See us at GEO Business 2024 on stand G37",
      image:
        "https://dropinblog.net/34252524/files/featured/geobusiness-2024.jpg",
      readTime: "1 minute read",
      date: "Apr 23rd, 2024",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#e62245] mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
            <div className="px-4 py-8 bg-[#fafdff]">
              <h3 className="text-xl text-center font-semibold mb-2 hover:text-[#e62245] transition-colors">
                {article.title}
              </h3>
              <div className="flex justify-center items-center text-xs text-gray-600 space-x-2">
                <span>{article.readTime}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
