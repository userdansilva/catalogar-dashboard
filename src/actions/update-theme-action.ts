"use server";

import { revalidateTag } from "next/cache";
import { ApiResponse } from "@/types/api-response";
import { tags } from "@/tags";
import { redirect } from "next/navigation";
import { Theme } from "@/types/api-types";
import { authActionClient } from "./safe-action";
import { api } from "./api";
import { returnValidationErrorsIfExists } from "./return-validation-errors-if-exists";
import { themeSchema } from "./schema";

export const updateThemeAction = authActionClient
  .schema(themeSchema)
  .metadata({
    actionName: "update-theme",
  })
  .action(async ({
    parsedInput: {
      primaryColor, secondaryColor, logo, redirectTo,
    },
    ctx: { accessToken },
  }) => {
    try {
      const res = await api.put<ApiResponse<Theme>>("/v1/themes", {
        primaryColor,
        secondaryColor,
        logo: (logo && logo.name && logo.width > 0 && logo.height > 0)
          ? { name: logo.name, width: logo.width, height: logo.height }
          : undefined,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      revalidateTag(tags.users.me);

      if (redirectTo) {
        redirect(redirectTo);
      }

      return { theme: res.data.data, message: res.data.meta?.message };
    } catch (e) {
      returnValidationErrorsIfExists(e, themeSchema);
      throw e;
    }
  });
