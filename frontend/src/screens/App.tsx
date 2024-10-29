import { Redirect, Route, Router, Switch } from "wouter";
import { LoginScreen } from "./Auth/LoginScreen.tsx";
import { RegisterScreen } from "./Auth/RegisterScreen.tsx";
import { observer } from "mobx-react-lite";
import { useStores } from "@/main.tsx";
import React from "react";
import { Label } from "@/components/ui/label.tsx";
import { MyFeedScreen } from "@/screens/Blogs/MyFeedScreen.tsx";

export const App = observer(() => {
  const authStore = useStores().authStore;
  console.log("IS LOGGED IN", authStore.isLoggedIn);
  return (
    <Router>
      <Switch>
        {authStore.isLoggedIn ? (
          <>
            <Route path={"/"}>
              <MyFeedScreen />
            </Route>
            <Route>
              <Redirect to={"/"} />
            </Route>
          </>
        ) : (
          <>
            <Route path={"/login"}>
              <LoginScreen />
            </Route>
            <Route path={"/register"}>
              <RegisterScreen />
            </Route>
            <Route>
              <Redirect to={"/login"} />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
});
