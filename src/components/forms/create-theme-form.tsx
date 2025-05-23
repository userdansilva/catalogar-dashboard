"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import { routes } from "@/routes";
import { themeSchema } from "@/actions/schema";
import { createThemeAction } from "@/actions/create-theme-action";
import { ThemeForm } from "./theme-form";

export type ThemeFormValues = z.infer<typeof themeSchema>

export function CreateThemeForm() {
  const { form, handleSubmitWithAction } = useHookFormAction(
    createThemeAction,
    zodResolver(themeSchema),
    {
      formProps: {
        defaultValues: {
          primaryColor: "#390080",
          secondaryColor: "#70FF94",
          logo: {
            name: "", height: 0, width: 0, url: "",
          },
          redirectTo: routes.dashboard.url,
        },
      },
      actionProps: {
        onSuccess: (res) => {
          toast.success("Sucesso! Redirecionando para tela inicial...", {
            description: res.data?.message,
          });
        },
        onError: (e) => {
          const { serverError } = e.error;

          if (serverError) {
            toast.error("Ops! Algo deu errado", {
              description: serverError.message,
            });
          }
        },
      },
    },
  );

  return (
    <ThemeForm
      form={form}
      onSubmit={handleSubmitWithAction}
      submitButtonLabel="Cadastrar tema"
    />
  );
}
