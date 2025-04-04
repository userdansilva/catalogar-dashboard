import { z } from "zod";
import { zfd } from "zod-form-data";

/**
 * Catalog
 */
export const catalogSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  slug: z.string().min(1, "Campo obrigatório"),
  isPublished: z.boolean(),
  redirectTo: z.string().optional(),
});

/**
 * Category
 */
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Campo obrigatório"),
  slug: z.string().min(1, "Campo obrigatório"),
  textColor: z.string().min(1, "Campo obrigatório"),
  backgroundColor: z.string().min(1, "Campo obrigatório"),
  isDisabled: z.boolean(),
  redirectTo: z.string().optional(),
});

export const categoryStatusToggleSchema = z.object({
  id: z.string(),
  redirectTo: z.string().optional(),
});

/**
 * Product
 */
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Campo obrigatório"),
  slug: z.string().min(1, "Campo obrigatório"),
  isDisabled: z.boolean(),
  redirectTo: z.string().optional(),
});

export const productStatusToggleSchema = z.object({
  id: z.string(),
  redirectTo: z.string().optional(),
});

/**
 * Catalog Item
 */
export const catalogItemSchema = z.object({
  id: z.string().optional(),

  title: z.string().min(1, "Campo obrigatório"),
  caption: z.string().optional(),
  productId: z.string().min(1, "Campo obrigatório"),
  images: z.array(z.object({
    name: z.string(),
    position: z.number(),
    url: z.string(),
  })).min(1, "É necessário adicionar, no mínimo, uma imagem"),
  price: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  isDisabled: z.boolean(),
  redirectTo: z.string().optional(),
});

/**
 * Images
 */
export const imageSchema = zfd.formData({
  image: zfd.file(),
});
