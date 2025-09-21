"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // se tiver
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", code: "P001", name: "Notebook Dell Inspiron", price: 2499.99 },
    { id: "3", code: "P002", name: "Teclado Mecânico RGB", price: 459.0 },
    { id: "4", code: "P003", name: 'Monitor 24" Full HD', price: 899.99 },
    { id: "5", code: "P004", name: "Webcam HD 1080p", price: 189.9 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | string>("");
  const [newCode, setNewCode] = useState("");

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const resetDialogFields = () => {
    setNewName("");
    setNewPrice("");
    setNewCode("");
  };

  const handleAddProduct = () => {
    if (!newName.trim()) {
      // pode mostrar mensagem de erro ou validar
      return;
    }
    const priceNumber = typeof newPrice === "string" ? parseFloat(newPrice.replace(",", ".")) : newPrice;
    if (isNaN(priceNumber) || priceNumber < 0) {
      // validar preço
      return;
    }

    // gerar id automaticamente — aqui uso timestamp; você pode usar uuid ou outra estratégia
    const newId = Date.now().toString();

    // gerar código, se quiser automático, ou usar o campo code
    const code = newCode.trim() !== "" ? newCode.trim() : `P${String(products.length + 1).padStart(3, "0")}`;

    const newProduct: Product = {
      id: newId,
      code,
      name: newName.trim(),
      price: priceNumber,
    };

    setProducts((prev) => [...prev, newProduct]);
    resetDialogFields();
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Tabela de Produtos</CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar novo produto</DialogTitle>
                <DialogDescription>
                  Preencha o nome e o preço do produto.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Código
                  </Label>
                  <Input
                    id="code"
                    className="col-span-3"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Opcional — será gerado se não preenchido"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome do produto"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Preço
                  </Label>
                  <Input
                    id="price"
                    className="col-span-3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => { resetDialogFields(); setIsDialogOpen(false); }}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct}>Adicionar Produto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground">Código</th>
                  <th className="text-left p-4 font-semibold text-foreground">Nome do Produto</th>
                  <th className="text-left p-4 font-semibold text-foreground">Preço</th>
                  <th className="text-center p-4 font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 text-foreground font-mono">{product.code}</td>
                    <td className="p-4 text-foreground">{product.name}</td>
                    <td className="p-4 text-foreground font-semibold">{formatPrice(product.price)}</td>
                    <td className="p-4 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Nenhum produto encontrado.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
