
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type {
  Category,
  SubCategory,
} from "@/features/categories/api/categories-api";

type CreateCategoryDialogProps = {
  isOpen: boolean;
  isSaving: boolean;
  name: string;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateCategoryDialog({
  isOpen,
  isSaving,
  name,
  onNameChange,
  onOpenChange,
  onSubmit,
}: CreateCategoryDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Add a new parent category to the hierarchy.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="new-category-name">Category name</Label>
            <Input
              id="new-category-name"
              onChange={(event) => onNameChange(event.target.value)}
              value={name}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Creating..." : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type CreateSubCategoryDialogProps = {
  categories: Category[];
  isOpen: boolean;
  isSaving: boolean;
  name: string;
  selectedCategoryId: string;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSelectedCategoryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateSubCategoryDialog({
  categories,
  isOpen,
  isSaving,
  name,
  selectedCategoryId,
  onNameChange,
  onOpenChange,
  onSelectedCategoryChange,
  onSubmit,
}: CreateSubCategoryDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create sub-category</DialogTitle>
          <DialogDescription>
            Add a new sub-category under an existing category.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              onValueChange={(value) =>
                onSelectedCategoryChange(String(value ?? ""))
              }
              value={selectedCategoryId}
            >
              <SelectTrigger className="w-full">
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
            <Label htmlFor="new-subcategory-name">Sub-category name</Label>
            <Input
              id="new-subcategory-name"
              onChange={(event) => onNameChange(event.target.value)}
              value={name}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Creating..." : "Create sub-category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteCategoryDialogProps = {
  isSaving: boolean;
  target: Category | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  isSaving,
  target,
  onConfirm,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(target)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Delete "${target.name}"? This only works after all of its sub-categories are removed.`
              : "Delete this category?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSaving}
            onClick={onConfirm}
            variant="destructive"
          >
            {isSaving ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DeleteSubCategoryDialogProps = {
  isSaving: boolean;
  target: SubCategory | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSubCategoryDialog({
  isSaving,
  target,
  onConfirm,
  onOpenChange,
}: DeleteSubCategoryDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(target)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete sub-category</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Delete "${target.name}"? The backend will block this if products still belong to it.`
              : "Delete this sub-category?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSaving}
            onClick={onConfirm}
            variant="destructive"
          >
            {isSaving ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
