import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import { ACCESS_TOKEN } from "../constants";

function ProductCreateForm() {
    const [formData, setFormData] = useState({
        name: "",
        complex_carbs: "",
        simple_carbs: "",
        fiber: "",
        saturated_fat: "",
        unsaturated_fat: "",
        protein: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const name = "Create Product";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const res = await api.post("api/product/create/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/"); // or navigate to product list page
        } catch (error) {
            alert("Failed to create product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {["name", "complex_carbs", "simple_carbs", "fiber", "saturated_fat", "unsaturated_fat", "protein"].map((field) => (
                <input
                    key={field}
                    className="form-input"
                    type={field === "name" ? "text" : "number"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    step="any"
                />
            ))}
            <button className="form-button" type="submit" disabled={loading}>
                {loading ? "Submitting..." : name}
            </button>
        </form>
    );
}

export default ProductCreateForm;
