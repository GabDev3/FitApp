import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import "../styles/Form.css"

function RegisterForm({route, method}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [intake, setIntake] = useState("");
    const [age, setAge] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, email, password, age,
            dailyIntake: parseFloat(intake), });
            if (method === "register") {
                navigate("/login")
            }
        } catch (error){
            alert(error)
        } finally {
            setLoading(false)
            }
    };

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{ name }</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />

        <input
            className="form-input"
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
        />

        <input
            className="form-input"
            type="text"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            placeholder="Daily Calories Intake"
        />

        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>

}

export default RegisterForm