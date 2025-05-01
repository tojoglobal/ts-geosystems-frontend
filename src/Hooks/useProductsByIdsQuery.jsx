import { useEffect, useState } from "react";
import axios from "axios";
import { useAxiospublic } from "./useAxiospublic";

const useProductsByIdsQuery = (ids) => {
  const axiosUrlPublic = useAxiospublic();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ids || ids.length === 0) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = ids.join(",");
        const res = await axiosUrlPublic.get(`/api/productsids?ids=${query}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [ids.join(",")]);

  return { products, loading, error };
};

export default useProductsByIdsQuery;
