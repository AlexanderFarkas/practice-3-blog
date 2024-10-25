import { Redirect, Route, Router, Switch } from "wouter";
import { LoginScreen } from "./Auth/LoginScreen.tsx";
import { RegisterScreen } from "./Auth/RegisterScreen.tsx";

export const App = () => {
  return (
    <div>
      Hello, world
      <Router>
        <Switch>
          <Route path={"/login"}>
            <LoginScreen />
          </Route>
          <Route path={"/register"}>
            <RegisterScreen />
          </Route>
          <Route path={"/"}>
            <Redirect to={"/login"} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
