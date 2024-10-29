import React, { useMemo, useEffect } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { useStores } from "@/main.tsx";
import { useVm } from "@/lib/utils.ts";
import { api } from "@/api.ts";
import { SchemaPostDto } from "@/gen/schema";

export type FeedType = "all" | "subscriptions";
export class MyFeedScreenVm {
  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  isLoading = false;
  posts = Array<SchemaPostDto>();

  private _type: FeedType = "all";
  setType(value: FeedType) {
    this._type = value;
    this.refresh();
  }
  get type() {
    return this._type;
  }

  async refresh() {
    this.isLoading = true;
    if (this.type === "all") {
      const { data } = await api.GET("/posts/all_feed");
      this.posts = data!;
    } else {
      const { data } = await api.GET("/posts/subscriptions_feed");
      this.posts = data!;
    }

    this.isLoading = false;
  }
}

const ctx = React.createContext<MyFeedScreenVm | null>(null);

export const MyFeedScreenVmProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {} = useStores();
  const vm = useMemo(() => new MyFeedScreenVm(), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useMyFeedScreenVm = () => useVm(ctx);
