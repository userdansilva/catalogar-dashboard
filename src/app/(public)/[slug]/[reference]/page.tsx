import { notFound } from "next/navigation";
import { PrevButton } from "@/components/inputs/prev-button";
import { PublicCatalogItemDetail } from "@/components/catalog/public-catalog-item-detail";
import { routes } from "@/routes";
import { getPublicCatalogBySlug } from "@/services/get-public-catalog-by-slug";
import { filterCatalogItems } from "@/utils/filter-catalog-items";
import { paginate } from "@/utils/paginate";

const ASCIIforAt = "%40"; // @

export default async function Page({
  params,
}: {
  params: Promise<{
    reference: string;
    slug: string;
  }>;
}) {
  const { slug: slugWithAt, reference } = await params;

  if (!slugWithAt.startsWith(ASCIIforAt)) {
    return notFound();
  }

  const slug = slugWithAt.replace(ASCIIforAt, "");

  const { data: catalog } = await getPublicCatalogBySlug(slug);

  const catalogItem = catalog.catalogItems.find(
    (item) => item.reference === Number(reference),
  );

  if (!catalogItem) {
    notFound();
  }

  const relatedCatalogItems = filterCatalogItems(
    catalog.catalogItems,
    {
      query: `${catalogItem.categories.map((category) => category.name).toString()}, ${catalogItem.productType.name}`,
    },
    {
      hideIfProductTypeIsDisabled: true,
    },
  );

  const paginatedCatalogItems = paginate(relatedCatalogItems, {
    perPage: 6,
    currentPage: 1,
  });

  return (
    <div className="max-w-7xl space-y-6 md:container">
      <PrevButton fallbackUrl={routes.public.url(slug)} />

      <PublicCatalogItemDetail
        baseUrl={routes.public.url(slug)}
        catalogItem={catalogItem}
        company={catalog.company}
        relatedCatalogItems={paginatedCatalogItems}
      />
    </div>
  );
}
