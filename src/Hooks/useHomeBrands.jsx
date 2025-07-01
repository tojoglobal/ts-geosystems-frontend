import useDataQuery from "../utils/useDataQuery";
export function useHomeBrands() {
  const {
    data = {},
    isLoading,
    isError,
  } = useDataQuery(["popularBrands"], "/api/brand/home");
  const brands = Array.isArray(data.brands) ? data.brands : [];
  return { brands, isLoading, isError };
}
