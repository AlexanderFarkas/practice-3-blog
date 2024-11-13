import { TypographyH2 } from "@/components/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ExitIcon, HomeIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { useLocation, useRoute } from "wouter";
import { useStores } from "@/screens/App.tsx";

export const PageHeader = ({ children }: { children?: React.ReactNode }) => {
  const [_, navigate] = useLocation();
  const authStore = useStores().authStore;
  const [match] = useRoute("/feed");
  return (
    <div className={"flex flex-row justify-between items-center w-full gap-2"}>
      {!match && (
        <Button variant={"outline"} onClick={() => navigate("/")}>
          <HomeIcon />
        </Button>
      )}
      {children}
      <Button variant={"outline"} onClick={authStore.logout}>
        <ExitIcon />
      </Button>
    </div>
  );
};
