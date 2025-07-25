"use server";

import { revalidateTag } from "next/cache";
import { returnValidationErrorsIfExists } from "./return-validation-errors-if-exists";
import { api } from "./api";
import { authActionClient } from "./safe-action";
import { categoryStatusToggleSchema } from "./schema";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/api-types";
import { tags } from "@/tags";
import { getCategoryById } from "@/services/get-category-by-id";

export const toggleCategoryStatusAction = authActionClient
  .schema(categoryStatusToggleSchema)
  .metadata({
    actionName: "toggle-status-category",
  })
  .action(async ({ parsedInput: { id }, ctx: { Authorization, user } }) => {
    try {
      const { data: category } = await getCategoryById(id);

      const res = await api.put<ApiResponse<Category>>(
        `/v1/categories/${id}`,
        {
          ...category,
          isDisabled: !category.isDisabled,
        },
        {
          headers: {
            Authorization,
          },
        },
      );

      revalidateTag(tags.categories.getAll);
      if (id) {
        revalidateTag(tags.categories.getById(id));
      }

      if (user.currentCatalog.isPublished && user.currentCatalog.slug) {
        revalidateTag(tags.publicCatalog.getBySlug(user.currentCatalog.slug));
      }

      return { category: res.data.data, message: res.data.meta?.message };
    } catch (e) {
      returnValidationErrorsIfExists(e, categoryStatusToggleSchema);
      throw e;
    }
  });
