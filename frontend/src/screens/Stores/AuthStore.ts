import { makeAutoObservable } from "mobx";
import { SchemaLoginUserDto } from "../../gen/schema";
import { api } from "../../api.ts";
import { useVm } from "@/lib/utils.ts";
import React from "react";

export class AuthStore {
  static ACCESS_TOKEN = "accessToken";
  constructor() {
    makeAutoObservable(this);
    this._accessToken = localStorage.getItem(AuthStore.ACCESS_TOKEN);
    api.onUnauthorized = () => {
      this.setAccessToken(null);
    };
  }

  _accessToken: string | null = null;
  setAccessToken(token: string | null) {
    this._accessToken = token;
    if (token == null) {
      localStorage.removeItem(AuthStore.ACCESS_TOKEN);
    } else {
      localStorage.setItem(AuthStore.ACCESS_TOKEN, token);
    }
  }

  get isLoggedIn() {
    return this._accessToken != null;
  }

  login = async (dto: SchemaLoginUserDto) => {
    const { data } = await api.POST("/auth/login", {
      body: dto,
    });
    this.setAccessToken(data!.token);
  };

  logout = () => {
    this.setAccessToken(null);
  };

  register = async (dto: SchemaLoginUserDto) => {
    const { data } = await api.POST("/auth/register", {
      body: dto,
    });
    this.setAccessToken(data!.token);
  };
}
