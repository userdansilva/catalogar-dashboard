"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Company } from "@/types/api-types";
import { updateCompanyAction } from "@/actions/update-company-action";
import { companySchema } from "@/actions/schema";
import { CompanyForm } from "./company-form";

type UpdateCompanyFormProps = {
  company: Company
}

export function UpdateCompanyForm({
  company,
}: UpdateCompanyFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    updateCompanyAction,
    zodResolver(companySchema),
    {
      formProps: {
        defaultValues: {
          name: company.name,
          description: company.description,
          mainSiteUrl: company.mainSiteUrl,
          businessTypeDescription: company.businessTypeDescription,
          phoneNumber: company.phoneNumber,
        },
      },
      actionProps: {
        onSuccess: (res) => {
          toast.success("Sucesso!", {
            description: res.data?.message,
          });
        },
        onError: (e) => {
          const { serverError } = e.error;

          if (serverError) {
            toast.error("Ops! Algo deu errado", {
              description: serverError.message,
            });
          }
        },
      },
    },
  );

  return (
    <CompanyForm
      form={form}
      onSubmit={handleSubmitWithAction}
      submitButtonLabel="Salvar alterações"
    />
  );
}
