import useDataQuery from "../utils/useDataQuery";
export function usePopularBrands() {
  const {
    data = {},
    isLoading,
    isError,
  } = useDataQuery(["popularBrands"], "/api/brand/home");
  // Support for { success: true, brands: [...] }
  const brands = Array.isArray(data.brands) ? data.brands : [];
  return { brands, isLoading, isError };
}
