import React from "react";
import { observer } from "mobx-react-lite";
import {
  CreateOrUpdatePostScreenVmProvider,
  useCreateOrUpdatePostScreenVm,
} from "./CreateOrUpdatePostScreenVm.tsx";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useParams } from "wouter";
import { TypographyH2 } from "@/components/typography.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { PageHeader } from "@/components/PageHeader.tsx";
import { HomeIcon, PlusIcon } from "@radix-ui/react-icons";
import { DeleteIcon } from "lucide-react";

interface IProps {}

export const CreatePostScreen: React.FC<IProps> = observer((props) => {
  return (
    <CreateOrUpdatePostScreenVmProvider postId={null}>
      <CreatePostScreenImpl {...props} />
    </CreateOrUpdatePostScreenVmProvider>
  );
});

export const UpdatePostScreen: React.FC<IProps & { postId: string }> = observer(
  (props) => {
    return (
      <CreateOrUpdatePostScreenVmProvider postId={props.postId}>
        <UpdatePostScreenImpl {...props} />
      </CreateOrUpdatePostScreenVmProvider>
    );
  },
);

const CreatePostScreenImpl: React.FC<IProps> = observer((props) => {
  const vm = useCreateOrUpdatePostScreenVm();
  return (
    <PageRoot>
      <PageHeader>Создание Поста</PageHeader>
      <div className="flex flex-col gap-3">
        <PostForm />
        <Button onClick={vm.submit}>Опубликовать</Button>
      </div>
    </PageRoot>
  );
});

const UpdatePostScreenImpl: React.FC<IProps> = observer((props) => {
  const vm = useCreateOrUpdatePostScreenVm();
  return (
    <PageRoot>
      <PageHeader>Update Post</PageHeader>
      {!vm.isLoading ? (
        <div className="flex flex-col gap-3">
          <PostForm />
          <Button onClick={vm.submit}>Update Post</Button>
        </div>
      ) : (
        <div>Загрузка...</div>
      )}
    </PageRoot>
  );
});

const PostForm = observer(() => {
  const vm = useCreateOrUpdatePostScreenVm();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <Label>Заголовок</Label>
        <Input value={vm.title} onChange={(e) => (vm.title = e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <Label>Текст</Label>
        <Textarea
          value={vm.content}
          onChange={(e) => (vm.content = e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center gap-3">
        <Label>Сделать пост публичным</Label>
        <Switch
          checked={vm.isPublic}
          onCheckedChange={(value) => (vm.isPublic = value)}
        />
      </div>
      <div className="flex flex-col items-start gap-3">
        <Label>Тэги</Label>
        <div className={"flex flex-row gap-4 w-full"}>
          <Input
            className={"flex-1"}
            value={vm.tagInProgress}
            onChange={(e) => (vm.tagInProgress = e.currentTarget.value)}
          />
          <Button
            className={"aspect-square"}
            variant={"outline"}
            onClick={vm.addTag}
          >
            <PlusIcon />
          </Button>
        </div>
        {[...vm.tags].map((tag) => (
          <div key={tag} className={"flex flex-row items-center gap-2"}>
            <div className={"font-semibold"}>#{tag}</div>
            <Button
              className={"aspect-square"}
              variant={"outline"}
              onClick={() => vm.removeTag(tag)}
            >
              <DeleteIcon />
            </Button>
          </div>
        ))}
      </div>
      {vm.error && <div className="text-red-500">{vm.error}</div>}
    </div>
  );
});
