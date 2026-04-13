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
import type { Product } from "@/features/products/api/products-api";

type ProductDeleteDialogProps = {
  isSaving: boolean;
  target: Product | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ProductDeleteDialog({
  isSaving,
  target,
  onConfirm,
  onOpenChange,
}: ProductDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(target)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Delete ${target.name}? This removes the product record.`
              : "Delete this product?"}
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
