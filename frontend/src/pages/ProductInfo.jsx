import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import ProductInfoComp from "../components/ProductInfoComp";

function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/get/${id}/`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product info");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return <ProductInfoComp product={product} loading={loading} error={error} />;
}

export default ProductInfo;
