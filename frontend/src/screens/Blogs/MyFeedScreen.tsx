import React from "react";
import { observer } from "mobx-react-lite";
import {
  FeedType,
  MyFeedScreenVmProvider,
  useMyFeedScreenVm,
} from "./MyFeedScreenVm.tsx";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useStores } from "@/main.tsx";
import { ExitIcon, PlusIcon } from "@radix-ui/react-icons";
import { TypographyH2 } from "@/components/typography.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";

interface IProps {}

export const MyFeedScreen: React.FC<IProps> = observer((props) => {
  return (
    <MyFeedScreenVmProvider>
      <MyFeedScreenImpl {...props} />
    </MyFeedScreenVmProvider>
  );
});

const MyFeedScreenImpl: React.FC<IProps> = observer((props) => {
  const authStore = useStores().authStore;
  const vm = useMyFeedScreenVm();
  return (
    <PageRoot>
      <div className={"flex flex-row justify-between w-full"}>
        <div className={"flex flex-row gap-3"}>
          <TypographyH2 className={"border-0"}>Feed</TypographyH2>
          <Button
            className={"aspect-square"}
            variant={"outline"}
            onClick={authStore.logout}
          >
            <PlusIcon />
          </Button>
        </div>
        <Button variant={"outline"} onClick={authStore.logout}>
          <ExitIcon />
        </Button>
      </div>
      <Separator />

      <Tabs
        className={"w-full"}
        value={vm.type}
        onValueChange={(value) => vm.setType(value as FeedType)}
      >
        <TabsList className={"grid w-full grid-cols-2"}>
          <TabsTrigger value={"all" satisfies FeedType}>All</TabsTrigger>
          <TabsTrigger value={"subscriptions" satisfies FeedType}>
            Subscriptions
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {vm.isLoading ? (
        <div className={"w-full text-center"}>Loading...</div>
      ) : (
        <div>
          {vm.posts.length === 0 && (
            <div className={"w-full text-center"}>No posts found</div>
          )}
          {vm.posts.map((post) => (
            <Card>
              <div>
                <TypographyH2>{post.title}</TypographyH2>
                <TypographyH2>{post.content}</TypographyH2>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageRoot>
  );
});
