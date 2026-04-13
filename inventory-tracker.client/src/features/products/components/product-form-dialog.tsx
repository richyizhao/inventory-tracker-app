
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/features/products/api/products-api";
import { ProductImage } from "@/features/products/components/product-image";
import type { ProductForm } from "@/features/products/types";

type ProductFormDialogProps = {
  availableSubCategories: Category["subCategories"];
  categories: Category[];
  dialogMode: "create" | "edit" | null;
  form: ProductForm;
  isSaving: boolean;
  productImagePreviewUrl: string | null;
  onDialogOpenChange: (open: boolean) => void;
  onFormChange: (nextForm: ProductForm) => void;
  onProductImageFileChange: (file: File | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ProductFormDialog({
  availableSubCategories,
  categories,
  dialogMode,
  form,
  isSaving,
  productImagePreviewUrl,
  onDialogOpenChange,
  onFormChange,
  onProductImageFileChange,
  onSubmit,
}: ProductFormDialogProps) {
  return (
    <Dialog open={dialogMode !== null} onOpenChange={onDialogOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {dialogMode === "edit" ? "Edit product" : "Create product"}
          </DialogTitle>
          <DialogDescription>
            Save a product record to the backend catalog.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                onChange={(event) =>
                  onFormChange({ ...form, name: event.target.value })
                }
                value={form.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                onChange={(event) =>
                  onFormChange({ ...form, sku: event.target.value })
                }
                value={form.sku}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  categoryId: String(value),
                  subCategoryId:
                    categories.find((category) => category.id === String(value))
                      ?.subCategories[0]?.id ?? "",
                })
              }
            >
              <SelectTrigger className="w-full" id="product-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sub-category</Label>
            <Select
              value={form.subCategoryId}
              onValueChange={(value) =>
                onFormChange({ ...form, subCategoryId: String(value) })
              }
            >
              <SelectTrigger className="w-full" id="product-subcategory">
                <SelectValue placeholder="Select a sub-category" />
              </SelectTrigger>
              <SelectContent>
                {availableSubCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-unit-cost">Unit cost</Label>
              <Input
                id="product-unit-cost"
                min="0"
                onChange={(event) =>
                  onFormChange({ ...form, unitCost: event.target.value })
                }
                step="0.01"
                type="number"
                value={form.unitCost}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-selling-price">Selling price</Label>
              <Input
                id="product-selling-price"
                min="0"
                onChange={(event) =>
                  onFormChange({ ...form, sellingPrice: event.target.value })
                }
                step="0.01"
                type="number"
                value={form.sellingPrice}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              onChange={(event) =>
                onFormChange({ ...form, description: event.target.value })
              }
              value={form.description}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-image-upload">Product image</Label>
            <div className="space-y-3">
              <ProductImage
                alt={form.name || "Product preview"}
                className="h-32 w-32 rounded-xl border object-cover"
                imageUrl={productImagePreviewUrl ?? form.imageUrl}
                version={form.imageUrl}
              />
              <Input
                accept="image/png,image/jpeg,image/webp,image/gif"
                id="product-image-upload"
                onChange={(event) =>
                  onProductImageFileChange(event.target.files?.[0] ?? null)
                }
                type="file"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload an image file. If none is selected, the placeholder image
              will be used.
            </p>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
