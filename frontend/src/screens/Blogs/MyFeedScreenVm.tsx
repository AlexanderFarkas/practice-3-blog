import React, { useMemo, useEffect, useLayoutEffect } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { useVm } from "@/lib/utils.ts";
import { api } from "@/api.ts";
import { SchemaPostDto } from "@/gen/schema";
import { useStores } from "@/screens/App.tsx";
import { useLocation, useSearch } from "wouter";
import { data } from "autoprefixer";
import { Navigate } from "wouter/memory-location";

export type FeedType = "all" | "subscriptions";
export class MyFeedScreenVm {
  constructor(
    tag: string | null,
    private navigate: Navigate,
  ) {
    makeAutoObservable(this);
    this.refresh();
    this._tag = tag;
  }

  isLoading = false;
  posts = Array<SchemaPostDto>();

  get tag(): string | null {
    return this._tag;
  }

  set tag(value: string | null) {
    this._tag = value;
    if (value == null) {
      this.navigate("/feed");
    }
    this.refresh();
  }
  private _tag: string | null;

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
    const query = {
      params: {
        query: {
          tag: this.tag,
        },
      },
    };
    if (this.type === "all") {
      const { data } = await api.GET("/posts/all_feed", query);
      this.posts = data!;
    } else {
      const { data } = await api.GET("/posts/subscriptions_feed", query);
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
  const [_, navigate] = useLocation();
  const tag = new URLSearchParams(useSearch()).get("tag");
  const vm = useMemo(() => new MyFeedScreenVm(tag, navigate), []);
  useLayoutEffect(() => {
    vm.tag = tag;
  }, [tag]);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useMyFeedScreenVm = () => useVm(ctx);
