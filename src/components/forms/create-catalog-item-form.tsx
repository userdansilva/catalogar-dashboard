"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CatalogItemForm } from "./catalog-item-form";
import { routes } from "@/routes";
import { createCatalogItemAction } from "@/actions/create-catalog-item-action";
import { catalogItemSchema } from "@/actions/schema";
import { Category, ProductType } from "@/types/api-types";

type CreateCatalogItemFormProps = {
  categories: Category[];
  productTypes: ProductType[];
  callbackUrl?: string;
};

export function CreateCatalogItemForm({
  categories,
  productTypes,
  callbackUrl,
}: CreateCatalogItemFormProps) {
  const router = useRouter();

  const { form, handleSubmitWithAction } = useHookFormAction(
    createCatalogItemAction,
    zodResolver(catalogItemSchema),
    {
      formProps: {
        mode: "onChange",
        defaultValues: {
          title: "",
          caption: "",
          productTypeId: "",
          images: [],
          price: "",
          categoryIds: [],
          isDisabled: false,
        },
      },
      actionProps: {
        onSuccess: (res) => {
          toast.success(
            `Sucesso!${!callbackUrl ? " Voltando para a lista..." : ""}`,
            {
              description: res.data?.message,
            },
          );
          router.push(callbackUrl || routes.catalogItems.url);
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
      submitButtonLabel="Criar Item de Catálogo"
      categories={categories}
      productTypes={productTypes}
    />
  );
}
