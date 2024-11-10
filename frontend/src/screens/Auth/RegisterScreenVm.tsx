import React, { useMemo, useEffect } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";
import { useVm } from "@/lib/utils.ts";
import { ApiError } from "@/api.ts";
import { useStores } from "@/screens/App.tsx";

export class RegisterScreenVm {
  constructor(private authStore: AuthStore) {
    makeAutoObservable(this);
  }

  isLoading: boolean = false;
  username: string = "";
  password: string = "";
  repeatPassword: string = "";

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
    if (this.password !== this.repeatPassword) {
      return "Пароли должны совпадать";
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
      await this.authStore.register({
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

const ctx = React.createContext<RegisterScreenVm | null>(null);

export const RegisterScreenVmProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { authStore } = useStores();
  const vm = useMemo(() => new RegisterScreenVm(authStore), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useRegisterScreenVm = () => useVm(ctx);
