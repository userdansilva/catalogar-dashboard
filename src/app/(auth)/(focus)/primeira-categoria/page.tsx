import { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateCategoryForm } from "@/components/forms/create-category-form";
import { PrevButton } from "@/components/inputs/prev-button";
import { routes } from "@/routes";
import { getCategories } from "@/services/get-categories";

export const metadata: Metadata = {
  title: routes.categories.sub.createFirst.title,
};

export default async function CreateFirstCategory({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const { data: categories } = await getCategories();

  if (categories.length >= 1) {
    return redirect(routes.categories.url);
  }

  return (
    <div className="max-w-lg space-y-8">
      <PrevButton fallbackUrl={routes.dashboard.url} />

      <div className="space-y-2">
        <h2 className="text-2xl tracking-tight">
          Vamos cadastrar sua <span className="font-bold">Categoria</span>
        </h2>

        <p className="text-muted-foreground">
          Como você categoriza seus produtos? Em temas, datas comemorativas,
          tipo de público, tamanho?
        </p>
      </div>

      <CreateCategoryForm callbackUrl={callbackUrl} />
    </div>
  );
}
