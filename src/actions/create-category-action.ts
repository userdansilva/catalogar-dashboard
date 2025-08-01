"use server";

import { revalidateTag } from "next/cache";
import slugify from "slugify";
import { authActionClient } from "./safe-action";
import { categorySchema } from "./schema";
import { api } from "./api";
import { returnValidationErrorsIfExists } from "./return-validation-errors-if-exists";
import { tags } from "@/tags";
import { Category } from "@/types/api-types";
import { ApiResponse } from "@/types/api-response";

export const createCategoryAction = authActionClient
  .schema(categorySchema)
  .metadata({
    actionName: "create-category",
  })
  .action(
    async ({
      parsedInput: { name, textColor, backgroundColor, isDisabled },
      ctx: { Authorization, user },
    }) => {
      try {
        const res = await api.post<ApiResponse<Category>>(
          "/v1/categories",
          {
            name,
            slug: slugify(name, { lower: true }),
            textColor,
            backgroundColor,
            isDisabled,
          },
          {
            headers: {
              Authorization,
            },
          },
        );

        revalidateTag(tags.categories.getAll);

        if (user.currentCatalog.isPublished && user.currentCatalog.slug) {
          revalidateTag(tags.publicCatalog.getBySlug(user.currentCatalog.slug));
        }

        return { category: res.data.data, message: res.data.meta?.message };
      } catch (e) {
        returnValidationErrorsIfExists(e, categorySchema);
        throw e;
      }
    },
  );
