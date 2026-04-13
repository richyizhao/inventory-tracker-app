import { ScrollText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/features/dashboard/api/dashboard-api";
import { formatDateTime } from "@/utils/format";

function transactionVariant(type: string) {
  switch (type.toLowerCase()) {
    case "in":
      return "default" as const;
    case "out":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

type RecentActivityCardProps = {
  isLoading: boolean;
  transactions: Transaction[];
};

export function RecentActivityCard({
  isLoading,
  transactions,
}: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="size-4" />
          Recent activity
        </CardTitle>
        <CardDescription>
          The latest inventory movements captured by the backend summary
          endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading recent activity...
          </p>
        ) : transactions.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Handled by</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.productName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transactionVariant(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.userEmail}</TableCell>
                  <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent transactions have been recorded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
