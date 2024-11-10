import { Redirect, Route, Switch } from "wouter";
import { LoginScreen } from "./Auth/LoginScreen.tsx";
import { RegisterScreen } from "./Auth/RegisterScreen.tsx";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { MyFeedScreen } from "@/screens/Blogs/MyFeedScreen.tsx";
import {
  CreatePostScreen,
  UpdatePostScreen,
} from "@/screens/Blogs/CreatePostScreen+UpdatePostScreen.tsx";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";
import { useVm } from "@/lib/utils.ts";
import { UserProfile } from "@/screens/Blogs/UserProfile.tsx";

type Stores = {
  authStore: AuthStore;
};
const ctx = React.createContext<Stores | null>(null);
const StoresProvider = ({ children }: { children: React.ReactNode }) => {
  const stores = useMemo(() => {
    return {
      authStore: new AuthStore(),
    } satisfies Stores;
  }, []);

  return <ctx.Provider value={stores}>{children}</ctx.Provider>;
};
export const useStores = () => useVm(ctx);
export const App = () => {
  return (
    <StoresProvider>
      <AppImpl />
    </StoresProvider>
  );
};

export const AppImpl = observer(() => {
  const authStore = useStores().authStore;
  if (authStore.isLoadingUser) {
    return (
      <div className={"flex items-center justify-center w-full h-full"}>
        Загрузка...
      </div>
    );
  }
  return (
    <Switch
      children={
        authStore.isLoggedIn
          ? [
              <Route path={"/create_post"}>
                <CreatePostScreen />
              </Route>,
              <Route path={"/edit_post/:postId"}>
                {(params) => <UpdatePostScreen postId={params.postId} />}
              </Route>,
              <Route path={"/profile/:userId"}>
                {(params) => <UserProfile userId={params.userId} />}
              </Route>,
              <Route path={"/"}>
                <MyFeedScreen />
              </Route>,
              <Route>
                <Redirect to={"/"} />
              </Route>,
            ]
          : [
              <Route path={"/login"}>
                <LoginScreen />
              </Route>,
              <Route path={"/register"}>
                <RegisterScreen />
              </Route>,
              <Route>
                <Redirect to={"/login"} />
              </Route>,
            ]
      }
    ></Switch>
  );
});
