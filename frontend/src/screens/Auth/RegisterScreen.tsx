import { Link } from "wouter";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { TypographyH2 } from "@/components/typography.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";

import React from "react";
import { observer } from "mobx-react-lite";
import {
  RegisterScreenVmProvider,
  useRegisterScreenVm,
} from "./RegisterScreenVm";
import { cn } from "@/lib/utils.ts";

interface IProps {}

export const RegisterScreen: React.FC<IProps> = observer((props) => {
  return (
    <RegisterScreenVmProvider>
      <RegisterScreenImpl {...props} />
    </RegisterScreenVmProvider>
  );
});

const RegisterScreenImpl: React.FC<IProps> = observer((props) => {
  const vm = useRegisterScreenVm();
  return (
    <PageRoot
      className={cn(
        "items-stretch justify-center",
        vm.isLoading && "pointer-events-none opacity-70",
      )}
    >
      <TypographyH2 className={"mb-3"}>Регистрация</TypographyH2>
      <div className={"flex flex-col gap-2"}>
        <Label htmlFor={"username-field"}>Никнейм</Label>
        <Input
          type={"email"}
          value={vm.username}
          onChange={(e) => (vm.username = e.target.value)}
          id={"username-field"}
          placeholder={"Введите Ваш никнейм"}
        />
      </div>
      <div className={"flex flex-col gap-2"}>
        <Label htmlFor={"password-field"}>Пароль</Label>
        <Input
          id={"password-field"}
          value={vm.password}
          onChange={(e) => (vm.password = e.target.value)}
          type={"password"}
          placeholder={"Введите Ваш пароль"}
        />
      </div>
      <div className={"flex flex-col gap-2"}>
        <Label htmlFor={"repeat-password-field"}>Повторите Пароль</Label>
        <Input
          id={"repeat-password-field"}
          value={vm.repeatPassword}
          onChange={(e) => (vm.repeatPassword = e.target.value)}
          autoComplete={"off"}
          type={"password"}
          placeholder={"Повторите Ваш пароль"}
        />
      </div>
      {vm.error != null && <Label className={"text-red-400"}>{vm.error}</Label>}
      <div className={"flex flex-col mt-4 gap-2"}>
        <Button
          disabled={vm.error != null}
          className={"bg-amber-300"}
          onClick={vm.submit}
          type={"submit"}
        >
          Зарегистрироваться
        </Button>
        <Link className={buttonVariants({ variant: "outline" })} to={"/login"}>
          К Авторизации
        </Link>
      </div>
    </PageRoot>
  );
});
