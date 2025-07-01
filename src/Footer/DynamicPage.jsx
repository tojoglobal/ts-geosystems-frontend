import { Link, useParams } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";
import RichTextRenderer from "../utils/RichTextRenderer";

const DynamicPage = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useDataQuery(
    ["dynamicLink", slug],
    `/api/dynamic-links/${slug}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !data?.data) return <div>Not found</div>;
  const { name, description } = data.data;

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
      <RichTextRenderer html={description} />
    </div>
  );
};

export default DynamicPage;
