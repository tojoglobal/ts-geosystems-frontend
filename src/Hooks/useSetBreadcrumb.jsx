import { useDispatch } from "react-redux";
import { setBreadcrumb } from "./breadcrumbSlice";

export const useSetBreadcrumb = () => {
  const dispatch = useDispatch();
  return (product) => {
    let catData = product.category ? JSON.parse(product.category) : null;
    let subcatData = product.sub_category
      ? JSON.parse(product.sub_category)
      : null;
    dispatch(
      setBreadcrumb({
        category: catData
          ? { slug: catData.cat, name: catData.cat.replace(/-/g, " ") }
          : null,
        subcategory: subcatData
          ? { slug: subcatData.slug, name: subcatData.slug.replace(/-/g, " ") }
          : null,
        product: { id: product.id, name: product.product_name },
      })
    );
  };
};
