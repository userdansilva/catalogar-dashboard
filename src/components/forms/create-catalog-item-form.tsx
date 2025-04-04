"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { routes } from "@/routes";
import { createCatalogItemAction } from "@/actions/create-catalog-item-action";
import { catalogItemSchema } from "@/actions/schema";
import { Category, Product } from "@/types/api-types";
import { CatalogItemForm } from "./catalog-item-form";

type CreateCatalogItemFormProps = {
  categories: Category[];
  products: Product[];
}

export function CreateCatalogItemForm({
  categories, products,
}: CreateCatalogItemFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    createCatalogItemAction,
    zodResolver(catalogItemSchema),
    {
      formProps: {
        defaultValues: {
          title: "",
          caption: "",
          productId: "",
          images: [],
          price: "",
          categoryIds: [],
          isDisabled: false,
          redirectTo: routes.catalogItems.url,
        },
      },
      actionProps: {
        onSuccess: (res) => {
          toast.success("Sucesso! Voltando para a lista...", {
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
    <CatalogItemForm
      form={form}
      onSubmit={handleSubmitWithAction}
      submitButtonLabel="Criar item"
      categories={categories}
      products={products}
    />
  );
}
