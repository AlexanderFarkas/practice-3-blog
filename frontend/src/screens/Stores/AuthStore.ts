import { makeAutoObservable } from "mobx";
import { SchemaLoginUserDto } from "../../gen/schema";
import { api } from "../../api.ts";

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  // login(dto: SchemaLoginUserDto) {}

  async register(dto: SchemaLoginUserDto) {
    const { data } = await api.POST("/auth/register", {
      body: dto,
    });
    data;
  }
}
