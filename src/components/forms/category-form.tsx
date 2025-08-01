import { FormEventHandler } from "react";
import { Control, UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "../inputs/button";
import { categorySchema } from "@/actions/schema";
import { Badge } from "@/shadcn/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";

export type CategoryFormValues = z.infer<typeof categorySchema>;

function CategoryBadgePreview({
  control,
}: {
  control: Control<CategoryFormValues>;
}) {
  const { name, textColor, backgroundColor } = useWatch({ control });

  return (
    <Badge style={{ color: textColor, background: backgroundColor }}>
      {(name || "Categoria").trim()}
    </Badge>
  );
}

export function CategoryForm({
  form,
  onSubmit,
  submitButtonLabel,
}: {
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitButtonLabel: string;
}) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>

              <FormControl>
                <Input
                  placeholder="Ex.: Dia dos namorados"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>

          <CardContent>
            <CategoryBadgePreview control={form.control} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-8">
          <FormField
            name="backgroundColor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de fundo</FormLabel>

                <FormControl>
                  <Input
                    type="color"
                    className="w-full max-w-48"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="textColor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do texto</FormLabel>

                <FormControl>
                  <Input
                    type="color"
                    className="w-full max-w-48"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
