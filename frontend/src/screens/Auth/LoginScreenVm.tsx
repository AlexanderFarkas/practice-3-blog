import React, { useMemo } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { useVm } from "@/lib/utils.ts";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";
import { ApiError } from "@/api.ts";
import { useStores } from "@/screens/App.tsx";

export class LoginScreenVm {
  constructor(private authStore: AuthStore) {
    makeAutoObservable(this);
  }

  isLoading: boolean = false;
  username: string = "";
  password: string = "";

  wasSubmitted: boolean = false;

  get error(): string | null {
    if (!this.wasSubmitted) {
      return null;
    }
    if (this.username.length === 0) {
      return "Никнейм обязателен";
    }
    if (this.password.length === 0) {
      return "Пароль обязателен";
    }

    return null;
  }

  submit = async () => {
    this.wasSubmitted = true;
    if (this.error) {
      return;
    }
    this.isLoading = true;
    try {
      await this.authStore.login({
        username: this.username,
        password: this.password,
      });
    } catch (e) {
      if (e instanceof ApiError) {
        alert(e.message);
      }
    } finally {
      this.isLoading = false;
    }
  };
}

const ctx = React.createContext<LoginScreenVm | null>(null);

export const LoginScreenVmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authStore } = useStores();
  const vm = useMemo(() => new LoginScreenVm(authStore), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useLoginScreenVm = () => useVm(ctx);
