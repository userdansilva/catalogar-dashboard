import { Metadata } from "next";
import { CatalogItems } from "@/components/catalog/catalog-items";
import { CategoriesFilter } from "@/components/filters/categories-filter";
import { ProductTypesFilter } from "@/components/filters/product-types-filter";
import { QueryFilter } from "@/components/filters/query-filter";
import { routes } from "@/routes";
import { getCatalogItems } from "@/services/get-catalog-items";
import { getCategories } from "@/services/get-categories";
import { getProductTypes } from "@/services/get-product-types";
import { getUser } from "@/services/get-user";
import { SearchParams } from "@/types/system";
import { defineSearchParamNames } from "@/utils/define-search-param-names";

export const metadata: Metadata = {
  title: routes.preview.title,
};

const ITEMS_PER_PAGE = 16;

const SEARCH_PARAM_NAMES = defineSearchParamNames({
  page: "p",
  query: "busca",
  categorySlug: "categoria",
  productSlug: "produto",
});

export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<SearchParams<typeof SEARCH_PARAM_NAMES>>;
}) {
  const { data: user } = await getUser();
  const { data: catalogItems } = await getCatalogItems();
  const { data: productTypes } = await getProductTypes();
  const { data: categories } = await getCategories();

  const { busca, p, categoria, produto } = await searchParams;

  const query = busca || "";
  const productTypeSlug = produto || "";
  const categorySlug = categoria || "";
  const currentPage = Number(p) || 1;

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full sm:w-2/3">
          <QueryFilter
            mode="preview"
            currentQuery={query}
            primaryColor={user.currentCatalog.theme?.primaryColor}
            secondaryColor={user.currentCatalog.theme?.secondaryColor}
            searchParamNames={SEARCH_PARAM_NAMES}
          />
        </div>

        {productTypes.length >= 2 && (
          <ProductTypesFilter
            mode="preview"
            productTypes={productTypes}
            currentProductTypeSlug={productTypeSlug}
            searchParamNames={SEARCH_PARAM_NAMES}
          />
        )}

        {categories.length >= 2 && (
          <CategoriesFilter
            mode="preview"
            categories={categories}
            currentCategorySlug={categorySlug}
            searchParamNames={SEARCH_PARAM_NAMES}
          />
        )}
      </div>

      <CatalogItems
        query={query}
        catalogItems={catalogItems}
        productTypeSlug={productTypeSlug}
        categorySlug={categorySlug}
        currentPage={currentPage}
        perPage={ITEMS_PER_PAGE}
        isPublic
        unoptimized
        searchParamNames={SEARCH_PARAM_NAMES}
      />
    </div>
  );
}
