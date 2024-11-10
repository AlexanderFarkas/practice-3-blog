import { makeAutoObservable } from "mobx";
import { SchemaLoginUserDto, SchemaUserDto } from "../../gen/schema";
import { api } from "../../api.ts";
import { useVm } from "@/lib/utils.ts";
import React from "react";
import { jwtDecode } from "jwt-decode";

export class AuthStore {
  static ACCESS_TOKEN = "accessToken";
  constructor() {
    makeAutoObservable(this);
    this.setAccessToken(localStorage.getItem(AuthStore.ACCESS_TOKEN));
    api.onUnauthorized = () => {
      this.setAccessToken(null);
    };
  }

  _accessToken: string | null = null;
  setAccessToken(token: string | null) {
    if (token == this._accessToken) return;
    this._accessToken = token;
    if (token == null) {
      localStorage.removeItem(AuthStore.ACCESS_TOKEN);
    } else {
      localStorage.setItem(AuthStore.ACCESS_TOKEN, token);
    }
    this._refreshUser();
  }

  get isLoggedIn() {
    return this._accessToken != null;
  }

  get userId() {
    if (!this._accessToken) {
      return null;
    }
    const decoded = jwtDecode<{
      user_id: string;
    }>(this._accessToken);
    return decoded.user_id;
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

  user: SchemaUserDto | null = null;
  isLoadingUser = false;
  _refreshUser = async () => {
    if (!this._accessToken) {
      this.user = null;
    }
    this.isLoadingUser = true;
    try {
      const { data } = await api.GET("/users/me");
      this.user = data!;
    } finally {
      this.isLoadingUser = false;
    }
  };
}
