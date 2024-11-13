import { SchemaCommentDto, SchemaPostDto } from "@/gen/schema";
import { observer } from "mobx-react-lite";
import { Card } from "@/components/ui/card.tsx";
import { TypographyH2 } from "@/components/typography.tsx";
import { Link } from "wouter";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShareIcon } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { api } from "@/api.ts";
import { Input } from "@/components/ui/input.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import TimeAgo from "timeago-react";

export const PostCard = observer(
  ({ post, trailing }: { post: SchemaPostDto; trailing?: React.ReactNode }) => {
    return (
      <Card>
        <div>
          <TypographyH2 className={"p-2"}>
            {
              <div className={"flex flex-row gap-2 justify-between"}>
                <div className={"flex items-start flex-col"}>
                  <div>{post.title}</div>
                  <Link
                    to={`/profile/${post.user_id}`}
                    className={"text-xs underline"}
                  >
                    <div className={"text-xs underline"}>
                      Автор: {post.user.username}
                    </div>
                  </Link>
                </div>
                {trailing}
              </div>
            }
          </TypographyH2>
          <div className={"p-2"}>{post.content}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className={"aspect-square m-2"} variant={"outline"}>
                Комментировать
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Комментарии</DialogTitle>
              </DialogHeader>

              <CommentsSection post={post} />
            </DialogContent>
          </Dialog>
          {post.tags.length > 0 && (
            <>
              <Separator />
              <div className={"flex flex-row flex-wrap gap-2 p-2"}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    className={"font-bold"}
                    to={`/feed?tag=${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    );
  },
);

const CommentsSection = observer(({ post }: { post: SchemaPostDto }) => {
  const [content, setContent] = useState("");
  return (
    <div className={"flex flex-col gap-3"}>
      <div className={"max-h-[400px] overflow-y-scroll"}>
        {post.comments.map((comment) => (
          <div>
            <div className={"flex flex-row gap-3"}>
              <div className={"underline"}>{comment.user.username}</div>

              <TimeAgo datetime={comment.created_at} locale="ru_RU" />
            </div>
            <div>{comment.content}</div>
          </div>
        ))}
      </div>

      <div className={"flex flex-row gap-3"}>
        <Input
          className={"flex-1"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          onClick={async () => {
            const { data } = await api.POST("/posts/{post_id}/comment", {
              params: {
                path: {
                  post_id: post.id,
                },
              },
              body: {
                content,
              },
            });
            setContent("");
            post.comments = data!.comments;
          }}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
});
