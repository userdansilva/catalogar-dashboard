import { CreateCatalogForm } from "@/components/forms/create-catalog-form";
import { routes } from "@/routes";
import { getUser } from "@/services/get-user";
import { User } from "@/types/api-types";
import { redirect } from "next/navigation";

export default async function FirstCatalog() {
  const { data: user } = await getUser<User>();

  if (user.currentCatalog) {
    return redirect(routes.dashboard.home)
  }

  return (
    <div className="max-w-[32rem] space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl tracking-tight">
          Boas Vindas ao
          {" "}
          <span className="font-bold">Catalogar</span>
        </h2>

        <p className="text-muted-foreground">
          Obrigado por se cadastrar!
          Você deu um grande passo para melhorar a experiência
          de escolha para seus clientes.
          Que tal começar criando seu primeiro catálogo?
        </p>
      </div>

      <CreateCatalogForm />
    </div>
  )
}
