import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { ComponentLoader } from "../../utils/Loader/ComponentLoader";

const UsedEquipmentBenefits = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["usedEquipmentContent"],
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get("/api/used-equipment-content");
      return data.data;
    },
  });

  if (isLoading)
    return <ComponentLoader componentName="UsedEquipmentBenefits" />;
  if (isError || !data) return <p>Error loading content.</p>;

  return (
    <section className="mt-12">
      {data.banner_image_show && data.banner_image && (
        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}${data.banner_image}`}
          alt="Used Equipment Banner"
        />
      )}
      <div className="space-y-6 text-center mt-5">
        <div
          className="text-sm font-normal"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        {data.benefits_box_show && (
          <div className="bg-gray-100 p-8 rounded-lg space-y-6">
            <h2 className="text-xl text-[#e62245] uppercase">
              {data?.benefits_box_title}
            </h2>
            <div
              className="space-y-2 text-sm font-normal"
              dangerouslySetInnerHTML={{
                __html: data.benefits_box_description,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default UsedEquipmentBenefits;
