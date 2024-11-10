import { SchemaPostDto } from "@/gen/schema";
import { observer } from "mobx-react-lite";
import { Card } from "@/components/ui/card.tsx";
import { TypographyH2 } from "@/components/typography.tsx";
import { Link } from "wouter";
import React from "react";

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
        </div>
      </Card>
    );
  },
);
