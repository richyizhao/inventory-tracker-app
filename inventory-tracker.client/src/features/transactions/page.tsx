import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { hasPermission, permissionIds } from "@/config/permissions";
import {
  type Transaction,
  type TransactionInput,
} from "@/features/transactions/api/transactions-api";
import {
  createTransactionMutationOptions,
  deleteTransactionMutationOptions,
  updateTransactionMutationOptions,
} from "@/features/transactions/api/transaction-mutations";
import {
  emptyTransactionProductsQuery,
  emptyTransactionsQuery,
  getTransactionDetailQueryOptions,
  getTransactionProductsQueryOptions,
  getTransactionsQueryOptions,
  transactionKeys,
} from "@/features/transactions/api/transaction-queries";
import { DeleteTransactionDialog } from "@/features/transactions/components/delete-transaction-dialog";
import { EditTransactionDialog } from "@/features/transactions/components/edit-transaction-dialog";
import { RecordTransactionForm } from "@/features/transactions/components/record-transaction-form";
import { TransactionDetailSheet } from "@/features/transactions/components/transaction-detail-sheet";
import {
  createTransactionFormState,
  type TransactionFormState,
} from "@/features/transactions/types/transaction-form";
import { TransactionHistoryCard } from "@/features/transactions/components/transaction-history-card";
import { useAuth } from "@/lib/auth/auth-provider";

function buildTransactionInput(form: TransactionFormState): TransactionInput {
  return {
    productId: form.productId,
    type: form.type,
    quantity: Number(form.quantity),
    reason: form.reason,
    note: form.note,
    unitCost: form.unitCost.trim() ? Number(form.unitCost) : undefined,
    expenseAmount: form.type === "In" ? Number(form.expenseAmount || 0) : 0,
  };
}

export function TransactionsPage() {
  const transactionsPerPage = 10;
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [historyQuery, setHistoryQuery] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [historyPage, setHistoryPage] = useState(1);
  const deferredQuery = useDeferredValue(historyQuery);

  const [recordForm, setRecordForm] = useState<TransactionFormState>(
    createTransactionFormState(null),
  );
  const [activeTab, setActiveTab] = useState<"record" | "history">("history");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedTransactionPreview, setSelectedTransactionPreview] =
    useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState<TransactionFormState>(
    createTransactionFormState(null),
  );
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const canViewTransactionsPage = hasPermission(
    user?.permissions,
    permissionIds.transactionsView,
  );
  const canCreateTransactions = hasPermission(
    user?.permissions,
    permissionIds.transactionsCreate,
  );
  const canViewTransactionHistory = hasPermission(
    user?.permissions,
    permissionIds.transactionsHistoryView,
  );
  const canManageTransactions = hasPermission(
    user?.permissions,
    permissionIds.transactionsManage,
  );
  const canDeleteTransactions = hasPermission(
    user?.permissions,
    permissionIds.transactionsDelete,
  );

  const productsQuery = useQuery({
    ...(token
      ? getTransactionProductsQueryOptions(token)
      : {
          queryKey: transactionKeys.products(),
          queryFn: emptyTransactionProductsQuery,
        }),
    enabled: Boolean(token && canViewTransactionsPage),
  });
  const transactionsQuery = useQuery({
    ...(token
      ? getTransactionsQueryOptions(token)
      : {
          queryKey: transactionKeys.list(),
          queryFn: emptyTransactionsQuery,
        }),
    enabled: Boolean(
      token && canViewTransactionsPage && canViewTransactionHistory,
    ),
  });
  const transactionDetailQuery = useQuery({
    ...(token && selectedTransactionId
      ? getTransactionDetailQueryOptions(token, selectedTransactionId)
      : {
          queryKey: transactionKeys.detail(selectedTransactionId ?? "none"),
          queryFn: async () => selectedTransactionPreview as Transaction,
        }),
    enabled: Boolean(token && selectedTransactionId),
  });
  const createTransactionMutation = useMutation(
    token
      ? createTransactionMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to record a transaction.");
          },
        },
  );
  const updateTransactionMutation = useMutation(
    token
      ? updateTransactionMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update a transaction.");
          },
        },
  );
  const deleteTransactionMutation = useMutation(
    token
      ? deleteTransactionMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to delete a transaction.");
          },
        },
  );

  const products = useMemo(
    () => productsQuery.data ?? [],
    [productsQuery.data],
  );
  const transactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );
  const selectedTransaction =
    transactionDetailQuery.data ?? selectedTransactionPreview;
  const isLoadingProducts = productsQuery.isLoading;
  const isLoadingTransactions = transactionsQuery.isLoading;
  const isTransactionDetailLoading = transactionDetailQuery.isLoading;
  const error =
    (productsQuery.error instanceof Error && productsQuery.error.message) ||
    (transactionsQuery.error instanceof Error && transactionsQuery.error.message) ||
    null;
  const isSubmitting = createTransactionMutation.isPending;
  const isEditSaving = updateTransactionMutation.isPending;
  const isDeleteSaving = deleteTransactionMutation.isPending;
  const resolvedActiveTab = canCreateTransactions ? activeTab : "history";
  const resolvedRecordForm = useMemo(() => {
    if (recordForm.productId || products.length === 0) {
      return recordForm;
    }

    return {
      ...recordForm,
      productId: products[0]?.id ?? "",
      unitCost: recordForm.unitCost || String(products[0]?.unitCost ?? ""),
    };
  }, [products, recordForm]);

  const filteredTransactions = transactions.filter((transaction) => {
    const normalizedQuery = deferredQuery.toLowerCase();
    const matchesQuery =
      !deferredQuery.trim() ||
      transaction.productName.toLowerCase().includes(normalizedQuery) ||
      transaction.reason.toLowerCase().includes(normalizedQuery) ||
      transaction.userName.toLowerCase().includes(normalizedQuery) ||
      transaction.note.toLowerCase().includes(normalizedQuery);

    const matchesType =
      transactionTypeFilter === "all" ||
      transaction.type.toLowerCase() === transactionTypeFilter.toLowerCase();

    return matchesQuery && matchesType;
  });

  const totalHistoryPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / transactionsPerPage),
  );
  const currentHistoryPage = Math.min(historyPage, totalHistoryPages);
  const paginatedTransactions = filteredTransactions.slice(
    (currentHistoryPage - 1) * transactionsPerPage,
    currentHistoryPage * transactionsPerPage,
  );

  useEffect(() => {
    if (transactionDetailQuery.error instanceof Error) {
      toast.error(transactionDetailQuery.error.message);
    }
  }, [transactionDetailQuery.error]);

  usePageHeaderActions(
    <div className="flex gap-2">
      {canCreateTransactions ? (
        <Button
          onClick={() => setActiveTab("record")}
          variant={resolvedActiveTab === "record" ? "default" : "outline"}
        >
          Record movement
        </Button>
      ) : null}
      <Button
        onClick={() => setActiveTab("history")}
        variant={resolvedActiveTab === "history" ? "default" : "outline"}
      >
        History
      </Button>
    </div>,
    [canCreateTransactions, resolvedActiveTab],
  );

  async function refreshTransactions() {
    await queryClient.invalidateQueries({ queryKey: transactionKeys.all() });
  }

  async function handleCreateTransaction(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      await createTransactionMutation.mutateAsync(
        buildTransactionInput(resolvedRecordForm),
      );
      toast.success("Transaction recorded.");
      setRecordForm((current) => ({
        ...current,
        quantity: "1",
        expenseAmount: "0",
        reason: "Restock",
        note: "",
      }));

      if (canViewTransactionHistory) {
        await refreshTransactions();
      }
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to record transaction.",
      );
    }
  }

  async function openTransactionDetails(transactionId: string) {
    if (!token) {
      return;
    }

    setIsDetailOpen(true);
    setSelectedTransactionId(transactionId);
    setSelectedTransactionPreview(
      transactions.find((transaction) => transaction.id === transactionId) ?? null,
    );
  }

  function openEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setEditForm(createTransactionFormState(transaction));
  }

  async function handleUpdateTransaction(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !editingTransaction) {
      return;
    }

    try {
      const updatedTransaction = await updateTransactionMutation.mutateAsync({
        transactionId: editingTransaction.id,
        input: buildTransactionInput(editForm),
      });

      queryClient.setQueryData(
        transactionKeys.detail(updatedTransaction.id),
        updatedTransaction,
      );
      setSelectedTransactionPreview((current) =>
        current?.id === updatedTransaction.id ? updatedTransaction : current,
      );
      setEditingTransaction(null);
      setEditForm(createTransactionFormState(null));
      await refreshTransactions();
      toast.success("Transaction updated.");
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update transaction.",
      );
    }
  }

  async function handleDeleteTransaction() {
    if (!token || !deleteTarget) {
      return;
    }

    try {
      await deleteTransactionMutation.mutateAsync({
        transactionId: deleteTarget.id,
      });
      setDeleteTarget(null);
      if (selectedTransactionId === deleteTarget.id) {
        setSelectedTransactionId(null);
        setSelectedTransactionPreview(null);
      }
      await refreshTransactions();
      toast.success("Transaction deleted.");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete transaction.",
      );
    }
  }

  if (!canViewTransactionsPage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            This page is only available to roles with transaction access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h2 className="mb-1 text-2xl font-semibold max-md:text-center">
            Ledger
          </h2>
          <p className="text-sm text-muted-foreground max-md:text-center">
            Record inventory and view the ledger.
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Tabs value={resolvedActiveTab}>
          {canCreateTransactions ? (
            <TabsContent value="record">
              <RecordTransactionForm
                form={resolvedRecordForm}
                isLoadingProducts={isLoadingProducts}
                isSubmitting={isSubmitting}
                onChange={(updater) => setRecordForm(updater)}
                onSubmit={handleCreateTransaction}
                products={products}
              />
            </TabsContent>
          ) : null}

          <TabsContent value="history">
            <TransactionHistoryCard
              canDeleteTransactions={canDeleteTransactions}
              canManageTransactions={canManageTransactions}
              canViewTransactionHistory={canViewTransactionHistory}
              historyPage={currentHistoryPage}
              historyQuery={historyQuery}
              isLoadingTransactions={isLoadingTransactions}
              onDelete={setDeleteTarget}
              onEdit={openEditTransaction}
              onHistoryPageChange={setHistoryPage}
              onHistoryQueryChange={(value) => {
                setHistoryQuery(value);
                setHistoryPage(1);
              }}
              onOpenDetails={(transactionId) => {
                void openTransactionDetails(transactionId);
              }}
              onTransactionTypeFilterChange={(value) => {
                setTransactionTypeFilter(value);
                setHistoryPage(1);
              }}
              paginatedTransactions={paginatedTransactions}
              totalHistoryPages={totalHistoryPages}
              transactionTypeFilter={transactionTypeFilter}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionDetailSheet
        isLoading={isTransactionDetailLoading}
        onOpenChange={(open) => {
          setIsDetailOpen(open);

          if (!open) {
            setSelectedTransactionId(null);
            setSelectedTransactionPreview(null);
          }
        }}
        open={isDetailOpen}
        transaction={selectedTransaction}
      />

      <EditTransactionDialog
        form={editForm}
        isSaving={isEditSaving}
        onChange={(updater) => setEditForm(updater)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(null);
            setEditForm(createTransactionFormState(null));
          }
        }}
        onSubmit={handleUpdateTransaction}
        open={Boolean(editingTransaction)}
        products={products}
        transaction={editingTransaction}
      />

      <DeleteTransactionDialog
        isDeleting={isDeleteSaving}
        onConfirm={() => {
          void handleDeleteTransaction();
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        target={deleteTarget}
      />
    </>
  );
}
