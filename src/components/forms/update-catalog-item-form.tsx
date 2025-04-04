"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/routes";
import { toast } from "sonner";
import { CatalogItem, Category, Product } from "@/types/api-types";
import { updateCatalogItemAction } from "@/actions/update-catalog-item-action";
import { catalogItemSchema } from "@/actions/schema";
import { CatalogItemForm } from "./catalog-item-form";

type UpdateCatalogItemFormProps = {
  catalogItem: CatalogItem;
  categories: Category[];
  products: Product[];
}

export function UpdateCatalogItemForm({
  catalogItem, categories, products,
}: UpdateCatalogItemFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    updateCatalogItemAction,
    zodResolver(catalogItemSchema),
    {
      formProps: {
        defaultValues: {
          ...catalogItem,
          images: catalogItem.images.map((image) => ({
            name: image.name,
            position: image.position,
            url: image.url,
          })),
          productId: catalogItem.product.id,
          categoryIds: catalogItem.categories.map((category) => category.id),
          price: catalogItem.price?.toString(),
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
      submitButtonLabel="Salvar alterações"
      categories={categories}
      products={products}
    />
  );
}
