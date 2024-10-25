import { Link } from "wouter";

export const LoginScreen = () => {
  return (
    <div>
      <h1>Login</h1>
      <Link to={"/register"}>Register instead</Link>
    </div>
  );
};
