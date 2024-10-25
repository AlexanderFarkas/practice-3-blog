import { Link } from "wouter";

export const RegisterScreen = () => {
  return (
    <div>
      <h1>Register</h1>
      <Link to={"/login"}>Login instead</Link>
    </div>
  );
};
