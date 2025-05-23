import { filterCatalogItems } from "@/utils/filter-catalog-items";
import { paginate } from "@/utils/paginate";
import { getCatalogItems } from "@/services/get-catalog-items";
import { CatalogItem } from "./catalog-item";
import { CatalogPagination } from "./catalog-pagination";

export async function CatalogItems({
  query,
  productSlug,
  categorySlug,
  currentPage,
  perPage,
  withActions,
  hideIfProductIsDisabled,
}: {
  query: string
  productSlug: string
  categorySlug: string
  currentPage: number
  perPage: number
  withActions?: boolean
  hideIfProductIsDisabled?: boolean
}) {
  const { data: catalogItems } = await getCatalogItems();

  const filteredCatalogItems = filterCatalogItems(catalogItems, {
    query,
    productSlug,
    categorySlug,
    currentPage,
    perPage,
  }, {
    hideIfProductIsDisabled,
  });

  const catalogItemsTotal = filteredCatalogItems.length;

  const paginatedCatalogItems = paginate(filteredCatalogItems, {
    currentPage,
    perPage,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-x-4 gap-y-8">
        {paginatedCatalogItems.map((catalogItem) => (
          <CatalogItem
            key={catalogItem.id}
            catalogItem={catalogItem}
            withActions={withActions}
          />
        ))}
      </div>

      {catalogItemsTotal > perPage && (
        <CatalogPagination
          totalItems={catalogItemsTotal}
          itemsPerPage={perPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
