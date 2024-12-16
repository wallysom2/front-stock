import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createSale } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { getProducts } from "@/lib/api";

const saleSchema = z.object({
  customerName: z.string().min(1, "Nome do cliente é obrigatório"),
  customerEmail: z.string().email("Email inválido").optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PIX", "CASH"]),
  products: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })),
  notes: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormProps {
  onSuccess?: () => void;
}

export function SaleForm({ onSuccess }: SaleFormProps) {
  const [products, setProducts] = useState<any[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      products: [{ productId: 0, quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: SaleFormData) => {
    try {
      const totalAmount = data.products.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );

      await createSale({
        ...data,
        totalAmount,
      });

      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a venda.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nome do Cliente</Label>
          <Input id="customerName" {...register("customerName")} />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" type="email" {...register("customerEmail")} />
          {errors.customerEmail && (
            <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">Telefone</Label>
          <Input id="customerPhone" {...register("customerPhone")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Método de Pagamento</Label>
          <Select {...register("paymentMethod")}>
            <option value="CREDIT_CARD">Cartão de Crédito</option>
            <option value="DEBIT_CARD">Cartão de Débito</option>
            <option value="PIX">PIX</option>
            <option value="CASH">Dinheiro</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Produtos</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ productId: 0, quantity: 1, unitPrice: 0 })
            }
          >
            Adicionar Produto
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-2 col-span-2">
              <Label>Produto</Label>
              <Select
                {...register(`products.${index}.productId` as const)}
                onChange={(e) => {
                  const product = products.find(
                    (p) => p.id === Number(e.target.value)
                  );
                  if (product) {
                    setValue(
                      `products.${index}.unitPrice` as const,
                      product.price
                    );
                  }
                }}
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - R$ {product.price}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                {...register(`products.${index}.quantity` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <textarea
          id="notes"
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Criar Venda"}
        </Button>
      </div>
    </form>
  );
} 