import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Info.css";

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

    if (loading) return <div className="info-container"><p>Loading...</p></div>;
    if (error) return <div className="info-container"><p>{error}</p></div>;

    return (
        <div className="info-container">
            <div className="info-card">
                <h1 className="info-title">{product.name}</h1>
                <div className="info-fields">
                    <div className="info-field"><span className="info-label">Name:</span> {product.name}</div>
                    <div className="info-field"><span className="info-label">Carbohydrates:</span> {product.carbohydrates}</div>
                    <div className="info-field"><span className="info-label">Complex Carbs:</span> {product.complex_carbs}</div>
                    <div className="info-field"><span className="info-label">Simple Carbs:</span> {product.simple_carbs}</div>
                    <div className="info-field"><span className="info-label">Fiber:</span> {product.fiber}</div>
                    <div className="info-field"><span className="info-label">Fats:</span> {product.fats}</div>
                    <div className="info-field"><span className="info-label">Unsaturated Fats:</span> {product.unsaturated_fat}</div>
                    <div className="info-field"><span className="info-label">Saturated Fats:</span> {product.saturated_fat}</div>
                    <div className="info-field"><span className="info-label">Protein:</span> {product.protein}</div>
                    <div className="info-field"><span className="info-label">Calories:</span> {product.kcal}</div>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;
