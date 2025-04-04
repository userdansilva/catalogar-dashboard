import { auth } from "@/auth";
import { ApiError } from "@/types/api-error";
import { AxiosError } from "axios";
import { createMiddleware, createSafeActionClient } from "next-safe-action";
import { z } from "zod";

const authMiddleware = createMiddleware<{
  ctx: { accessToken: string }
  metada: { actionName: string }
}>().define(async ({ ctx, next }) => next({
  ctx: {
    accessToken: ctx.accessToken,
  },
}));

export const authActionClient = createSafeActionClient({
  defineMetadataSchema: () => z.object({
    actionName: z.string(),
  }),
  handleServerError(e) {
    if (e instanceof AxiosError) {
      return (e as AxiosError<ApiError>).response?.data;
    }

    return {
      message: "Ops! Algo deu errado. Por favor, tente novamente",
      errors: [],
    };
  },
})
  .use(async ({ next }) => {
    const session = await auth();

    if (!session) {
      throw new Error("Session not found!");
    }

    const { accessToken } = session;

    return next({ ctx: { accessToken } });
  })
  .use(authMiddleware);
