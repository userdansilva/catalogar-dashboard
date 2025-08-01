"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryForm } from "./category-form";
import { routes } from "@/routes";
import { categorySchema } from "@/actions/schema";
import { createCategoryAction } from "@/actions/create-category-action";

export function CreateCategoryForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();

  const { form, handleSubmitWithAction } = useHookFormAction(
    createCategoryAction,
    zodResolver(categorySchema),
    {
      formProps: {
        mode: "onChange",
        defaultValues: {
          name: "",
          textColor: "#FFFFFF",
          backgroundColor: "#000000",
          isDisabled: false,
        },
      },
      actionProps: {
        onSuccess: (res) => {
          toast.success(
            `Sucesso! ${!callbackUrl ? "Voltando para a lista..." : "Redirecionando..."}`,
            {
              description: res.data?.message,
            },
          );
          router.push(callbackUrl || routes.categories.url);
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
    <CategoryForm
      form={form}
      onSubmit={handleSubmitWithAction}
      submitButtonLabel="Criar Categoria"
    />
  );
}
