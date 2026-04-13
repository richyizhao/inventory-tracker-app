import { Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/features/products/api/products-api";
import { formatDate } from "@/utils/format";

type ProductsTableProps = {
  canDeleteProducts: boolean;
  canManageProducts: boolean;
  products: Product[];
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  onSelect: (product: Product) => void;
};

export function ProductsTable({
  canDeleteProducts,
  canManageProducts,
  products,
  onDelete,
  onEdit,
  onSelect,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Sub-category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Unit cost</TableHead>
          <TableHead>Selling price</TableHead>
          <TableHead>Inventory value</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-36">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell>{product.subCategory.name}</TableCell>
            <TableCell>
              <Badge
                variant={product.quantity <= 3 ? "destructive" : "secondary"}
              >
                {product.quantity} units
              </Badge>
            </TableCell>
            <TableCell>${product.unitCost.toFixed(2)}</TableCell>
            <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
            <TableCell>${product.inventoryValue.toFixed(2)}</TableCell>
            <TableCell>{formatDate(product.updatedAt)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button onClick={() => onSelect(product)} size="icon-sm" variant="outline">
                  <Eye className="size-4" />
                </Button>
                {canManageProducts ? (
                  <Button onClick={() => onEdit(product)} size="icon-sm" variant="outline">
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
                {canDeleteProducts ? (
                  <Button onClick={() => onDelete(product)} size="icon-sm" variant="outline">
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
