import LoginForm from "../components/LoginForm"

function Login() {
    return < LoginForm route="/api/user/login/" method="login" />
}

export default Login