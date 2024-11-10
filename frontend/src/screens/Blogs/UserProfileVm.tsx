import React, { useMemo, useEffect } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";
import { useStores } from "@/screens/App.tsx";
import { useVm } from "@/lib/utils.ts";
import { api } from "@/api.ts";
import {
  SchemaPostDto,
  SchemaUserDto,
  SchemaUserWithProfileDto,
} from "@/gen/schema";

export class UserProfileVm {
  constructor(
    private userId: string,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this._init();
  }

  user: SchemaUserWithProfileDto | null = null;
  posts: SchemaPostDto[] = [];
  isLoading = false;

  get isMyProfile() {
    return this.userId === this.authStore.userId;
  }

  _isSubscribed = false;

  get isSubscribed() {
    return this._isSubscribed;
  }

  setIsSubscribed(value: boolean) {
    this._isSubscribed = value;
    if (value) {
      api.POST("/users/{id}/subscribe", {
        params: {
          path: {
            id: this.userId,
          },
        },
      });
    } else {
      api.POST("/users/{id}/unsubscribe", {
        params: {
          path: {
            id: this.userId,
          },
        },
      });
    }
  }

  async deletePost(id: string) {
    this.posts = this.posts.filter((post) => post.id !== id);
    await api.DELETE("/posts/{id}", {
      params: {
        path: {
          id,
        },
      },
    });
  }

  _init = async () => {
    this.isLoading = true;
    try {
      await this._refreshUser();

      const { data: postsData } = await api.GET("/posts/user/{publisher_id}", {
        params: {
          path: {
            publisher_id: this.userId,
          },
        },
      });
      this.posts = postsData!;
    } finally {
      this.isLoading = false;
    }
  };

  _refreshUser = async () => {
    const { data: userData } = await api.GET("/users/{user_id}", {
      params: {
        path: {
          user_id: this.userId,
        },
      },
    });
    this.user = userData!;
    this._isSubscribed = this.user.subscribers
      .map(({ id }) => id)
      .includes(this.authStore.userId!);
  };
}

const ctx = React.createContext<UserProfileVm | null>(null);

export const UserProfileVmProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
}> = ({ children, userId }) => {
  const { authStore } = useStores();
  const vm = useMemo(() => new UserProfileVm(userId, authStore), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useUserProfileVm = () => useVm(ctx);
