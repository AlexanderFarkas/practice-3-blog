import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { UserProfileVmProvider, useUserProfileVm } from "./UserProfileVm";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { PageHeader } from "@/components/PageHeader.tsx";
import { SchemaUserDto, SchemaUserWithProfileDto } from "@/gen/schema";
import { PostCard } from "@/components/PostCard.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { DeleteIcon, EditIcon, ShareIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { api } from "@/api.ts";
import { TrashIcon } from "@radix-ui/react-icons";
import { Link, useLocation, useRouter } from "wouter";
import { cn } from "@/lib/utils.ts";

interface IProps {
  userId: string;
}

export const UserProfile: React.FC<IProps> = observer((props) => {
  return (
    <UserProfileVmProvider userId={props.userId}>
      <UserProfileImpl {...props} />
    </UserProfileVmProvider>
  );
});

const UserProfileImpl: React.FC<IProps> = observer((props) => {
  const vm = useUserProfileVm();
  return (
    <PageRoot>
      <PageHeader>
        <div className={"text-xl text-center truncate text-ellipsis"}>
          {vm.isLoading ? "..." : `${vm.user!.username} - Посты`}
        </div>
      </PageHeader>
      {vm.isLoading ? <div>Загрузка...</div> : <Content user={vm.user!} />}
    </PageRoot>
  );
});

const Content = observer(({ user }: { user: SchemaUserWithProfileDto }) => {
  const vm = useUserProfileVm();
  const [_, navigate] = useLocation();
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);
  const [sharingToUserId, setSharingToUserId] = useState<string | undefined>(
    undefined,
  );
  useEffect(() => {
    setSharingToUserId(undefined);
  }, [sharingPostId]);

  return (
    <div className={"flex flex-col gap-4"}>
      {!vm.isMyProfile && (
        <Button
          onClick={() => vm.setIsSubscribed(!vm.isSubscribed)}
          variant={"outline"}
        >
          {vm.isSubscribed ? "Отписаться" : "Подписаться"}
        </Button>
      )}
      {vm.posts.map((post) => (
        <PostCard
          post={post}
          trailing={
            <div className={"flex flex-row gap-1"}>
              {vm.isMyProfile &&
                !post.is_public &&
                user.subscribers.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={"aspect-square"}
                        variant={"outline"}
                        onClick={() => setSharingPostId(post.id)}
                      >
                        <ShareIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Поделиться с подписчиком</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Select
                            value={sharingToUserId}
                            onValueChange={setSharingToUserId}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Подписчик" />
                            </SelectTrigger>
                            <SelectContent>
                              {user.subscribers.map((subscriber) => (
                                <SelectItem value={subscriber.id}>
                                  {subscriber.username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button
                            disabled={sharingToUserId == null}
                            onClick={() =>
                              api.POST("/posts/{post_id}/share", {
                                params: {
                                  path: {
                                    post_id: sharingPostId!,
                                  },
                                },
                                body: {
                                  user_id: sharingToUserId!,
                                },
                              })
                            }
                            type="button"
                          >
                            Поделиться
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              {vm.isMyProfile && (
                <Button
                  className={"aspect-square"}
                  variant={"outline"}
                  onClick={() => vm.deletePost(post.id)}
                >
                  <TrashIcon />
                </Button>
              )}
              {vm.isMyProfile && (
                <Button
                  className={"aspect-square"}
                  variant={"outline"}
                  onClick={() => navigate("/edit_post/" + post.id)}
                >
                  <EditIcon />
                </Button>
              )}
            </div>
          }
        />
      ))}
    </div>
  );
});
