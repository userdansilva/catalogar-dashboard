import { UpdateCatalogItemForm } from "@/components/forms/update-catalog-item-form";
import { Section, SectionContent, SectionHeader } from "@/components/page-layout/section";
import { routes } from "@/routes";
import { getCatalogItemById } from "@/services/get-catalog-item-by-id";
import { getCategories } from "@/services/get-categories";
import { getProducts } from "@/services/get-products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: routes.catalogItems.sub.edit.title,
};

type EditCatalogItemProps = {
  params: {
    id: string
  }
}

export default async function EditCatalogItem(props: EditCatalogItemProps) {
  const { data: catalogItem } = await getCatalogItemById(props.params.id);
  const { data: products } = await getProducts();
  const { data: categories } = await getCategories();

  return (
    <Section>
      <SectionHeader
        title="Editar item"
        description="This is how others will see you on the site."
      />

      <SectionContent>
        <UpdateCatalogItemForm
          catalogItem={catalogItem}
          products={products}
          categories={categories}
        />
      </SectionContent>
    </Section>
  );
}
