import { Link, useParams } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";

// Utility: split description into paragraphs at every 90 words, at nearest "."
function splitDescriptionIntoParagraphs(description, wordsPerPara = 90) {
  if (!description) return [];
  const words = description.split(/\s+/);

  let paras = [];
  let curr = [];
  for (let i = 0; i < words.length; i++) {
    curr.push(words[i]);
    // If we reached the word limit, try to find the next period
    if (curr.length >= wordsPerPara) {
      // Look ahead for a period in next 8 words
      for (let j = 0; j < 8 && i + j < words.length; j++) {
        if (words[i + j].endsWith(".")) {
          // Include up to and including this word
          for (let k = 0; k <= j; k++) curr.push(words[i + k]);
          i += j; // Move i forward
          break;
        }
      }
      paras.push(curr.join(" "));
      curr = [];
    }
  }
  if (curr.length) paras.push(curr.join(" "));
  return paras;
}

const DynamicPage = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useDataQuery(
    ["dynamicLink", slug],
    `/api/dynamic-links/${slug}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !data?.data) return <div>Not found</div>;
  const { name, description } = data.data;

  // Strip HTML tags for smart paragraph splitting
  const asText = description.replace(/<[^>]*>/g, "");
  const paragraphs = splitDescriptionIntoParagraphs(asText, 90);

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-3">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <p className="capitalize text-[#e62245]">{name}</p>
      </div>
      <h1 className="text-[28px] font-light text-[#e62245] mb-6">{name}</h1>
      {/* Render each paragraph with margin */}
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-6 text-[15px] leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
};

export default DynamicPage;
