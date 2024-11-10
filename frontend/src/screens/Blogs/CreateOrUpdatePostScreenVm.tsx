import React, { useMemo, useEffect } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { useVm } from "@/lib/utils.ts";
import { SchemaPostDto, SchemaPutPostDto } from "@/gen/schema";
import { api } from "@/api.ts";
import { useLocation, useParams } from "wouter";
import { Navigate } from "wouter/memory-location";
import { useStores } from "@/screens/App.tsx";

export class CreateOrUpdatePostScreenVm {
  constructor(
    private postId: string | null,
    private navigate: Navigate,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this._init();
  }

  isLoading = false;
  title = "";
  content = "";
  isPublic = true;
  wasSubmitted = false;
  tags: Set<string> = new Set();
  tagInProgress = "";

  addTag() {
    this.tags.add(this.tagInProgress);
    this.tagInProgress = "";
  }

  removeTag(tag: string): void {
    this.tags.delete(tag);
  }

  get error(): string | null {
    if (!this.wasSubmitted) {
      return null;
    }
    if (!this.title) {
      return "Заголовок обязателен";
    }
    if (!this.content) {
      return "Текст обязателен";
    }
    return null;
  }

  submit = async () => {
    this.wasSubmitted = true;
    if (this.error) return;
    const post: SchemaPutPostDto = {
      title: this.title,
      content: this.content,
      is_public: this.isPublic,
      tags: Array.from(this.tags),
    };
    if (this.postId) {
      await api.PUT("/posts/{id}", {
        params: { path: { id: this.postId } },
        body: post,
      });
    } else {
      await api.POST("/posts/", { body: post });
    }
    this.navigate("/profile");
  };

  private _init = async () => {
    if (this.postId) {
      this.isLoading = true;
      const { data } = await api.GET("/posts/{id}", {
        params: {
          path: { id: this.postId },
        },
      });

      const post = data!;
      this.title = post.title;
      this.content = post.content;
      this.isPublic = post.is_public;
      this.tags = new Set(post.tags);
      this.isLoading = false;
    }
  };
}

const ctx = React.createContext<CreateOrUpdatePostScreenVm | null>(null);

export const CreateOrUpdatePostScreenVmProvider: React.FC<{
  children: React.ReactNode;
  postId: string | null;
}> = ({ children, postId }) => {
  const {} = useStores();
  const [_, navigate] = useLocation();
  const vm = useMemo(
    () => new CreateOrUpdatePostScreenVm(postId, navigate),
    [],
  );
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useCreateOrUpdatePostScreenVm = () => useVm(ctx);
