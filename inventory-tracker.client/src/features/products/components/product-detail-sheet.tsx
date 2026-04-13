import { PackagePlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Product, Transaction } from "@/features/products/api/products-api";
import { ProductImage } from "@/features/products/components/product-image";
import { TRANSACTION_REASONS } from "@/features/transactions/types/transaction-form";
import { formatDateTime } from "@/utils/format";

function transactionVariant(type: string) {
  return type.toLowerCase() === "out"
    ? "destructive"
    : type.toLowerCase() === "in"
      ? "default"
      : "secondary";
}

type ProductDetailSheetProps = {
  canCreateTransactions: boolean;
  isDetailLoading: boolean;
  isStockSaving: boolean;
  open: boolean;
  productTransactions: Transaction[];
  selectedProduct: Product | null;
  stockExpenseAmount: string;
  stockNote: string;
  stockQuantity: string;
  stockReason: string;
  stockType: "In" | "Out" | "Adjustment";
  stockUnitCost: string;
  onOpenChange: (open: boolean) => void;
  onStockExpenseAmountChange: (value: string) => void;
  onStockNoteChange: (value: string) => void;
  onStockQuantityChange: (value: string) => void;
  onStockReasonChange: (value: string) => void;
  onStockTypeChange: (value: "In" | "Out" | "Adjustment") => void;
  onStockUnitCostChange: (value: string) => void;
  onSubmitStock: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ProductDetailSheet({
  canCreateTransactions,
  isDetailLoading,
  isStockSaving,
  open,
  productTransactions,
  selectedProduct,
  stockExpenseAmount,
  stockNote,
  stockQuantity,
  stockReason,
  stockType,
  stockUnitCost,
  onOpenChange,
  onStockExpenseAmountChange,
  onStockNoteChange,
  onStockQuantityChange,
  onStockReasonChange,
  onStockTypeChange,
  onStockUnitCostChange,
  onSubmitStock,
}: ProductDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{selectedProduct?.name ?? "Product details"}</SheetTitle>
          <SheetDescription>
            Overview, transaction history, and stock movement.
          </SheetDescription>
        </SheetHeader>
        {selectedProduct ? (
          <Tabs className="p-4 pt-0" defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              {canCreateTransactions ? (
                <TabsTrigger value="stock">Stock</TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent className="space-y-4 pt-4" value="overview">
              <Card>
                <CardHeader>
                  <ProductImage
                    alt={selectedProduct.name}
                    className="aspect-4/3 w-full rounded-xl border object-cover"
                    imageUrl={selectedProduct.imageUrl}
                    version={selectedProduct.updatedAt}
                  />
                  <CardTitle>{selectedProduct.name}</CardTitle>
                  <CardDescription>{selectedProduct.sku}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {selectedProduct.category.name}
                    </Badge>
                    <Badge variant="outline">
                      {selectedProduct.subCategory.name}
                    </Badge>
                    <Badge
                      variant={
                        selectedProduct.quantity <= 3
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {selectedProduct.quantity} units
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedProduct.description || "No description provided."}
                  </p>
                  <div className="rounded-2xl border bg-muted/40 p-4 text-muted-foreground">
                    <p>Unit cost: ${selectedProduct.unitCost.toFixed(2)}</p>
                    <p>
                      Selling price: ${selectedProduct.sellingPrice.toFixed(2)}
                    </p>
                    <p>
                      Inventory value: $
                      {selectedProduct.inventoryValue.toFixed(2)}
                    </p>
                    <p>Created: {formatDateTime(selectedProduct.createdAt)}</p>
                    <p>Updated: {formatDateTime(selectedProduct.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="pt-4" value="history">
              {isDetailLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading transaction history...
                </p>
              ) : productTransactions.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Total cost</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge variant={transactionVariant(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>${transaction.totalCost.toFixed(2)}</TableCell>
                        <TableCell>{transaction.userEmail}</TableCell>
                        <TableCell>
                          {formatDateTime(transaction.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No transactions for this product yet.
                </p>
              )}
            </TabsContent>

            {canCreateTransactions ? (
              <TabsContent className="pt-4" value="stock">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PackagePlus className="size-4" />
                      Record stock movement
                    </CardTitle>
                    <CardDescription>
                      Add inventory in, out, or set a new adjusted quantity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={onSubmitStock}>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={stockType}
                          onValueChange={(value) =>
                            onStockTypeChange(value as "In" | "Out" | "Adjustment")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In">In</SelectItem>
                            <SelectItem value="Out">Out</SelectItem>
                            <SelectItem value="Adjustment">Adjustment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock-quantity">Quantity</Label>
                        <Input
                          id="stock-quantity"
                          min="1"
                          onChange={(event) =>
                            onStockQuantityChange(event.target.value)
                          }
                          type="number"
                          value={stockQuantity}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock-note">Note</Label>
                        <Textarea
                          id="stock-note"
                          onChange={(event) => onStockNoteChange(event.target.value)}
                          value={stockNote}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select
                          value={stockReason}
                          onValueChange={(value) =>
                            onStockReasonChange(String(value ?? "Restock"))
                          }
                        >
                          <SelectTrigger className="w-full" id="stock-reason">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRANSACTION_REASONS.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {stockType === "In" ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="stock-unit-cost">Unit cost</Label>
                            <Input
                              id="stock-unit-cost"
                              min="0"
                              onChange={(event) =>
                                onStockUnitCostChange(event.target.value)
                              }
                              placeholder={selectedProduct.unitCost.toFixed(2)}
                              step="0.01"
                              type="number"
                              value={stockUnitCost}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stock-expense-amount">
                              Restock expense
                            </Label>
                            <Input
                              id="stock-expense-amount"
                              min="0"
                              onChange={(event) =>
                                onStockExpenseAmountChange(event.target.value)
                              }
                              step="0.01"
                              type="number"
                              value={stockExpenseAmount}
                            />
                          </div>
                        </>
                      ) : null}
                      <Button disabled={isStockSaving} type="submit">
                        {isStockSaving ? "Saving..." : "Record movement"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            ) : null}
          </Tabs>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
