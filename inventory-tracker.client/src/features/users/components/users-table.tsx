import { Mail, Pencil, Shield, Shuffle, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Role, UserRecord } from "@/features/users/api/users-api";
import { formatDate } from "@/utils/format";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type UsersTableProps = {
  canDeleteUser: boolean;
  canEditUserEmail: boolean;
  canEditUserName: boolean;
  canManageUserPasswords: boolean;
  canSwitchUserRole: boolean;
  roles: Role[];
  users: UserRecord[];
  onDelete: (user: UserRecord) => void;
  onEditEmail: (user: UserRecord) => void;
  onEditName: (user: UserRecord) => void;
  onManagePassword: (user: UserRecord) => void;
  onSwitchRole: (user: UserRecord, defaultRole: string) => void;
};

export function UsersTable({
  canDeleteUser,
  canEditUserEmail,
  canEditUserName,
  canManageUserPasswords,
  canSwitchUserRole,
  roles,
  users,
  onDelete,
  onEditEmail,
  onEditName,
  onManagePassword,
  onSwitchRole,
}: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-48">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(record.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{record.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {record.roles.map((roleName) => (
                  <Badge key={roleName} variant="secondary">
                    {roleName}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{formatDate(record.createdAt)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canEditUserName ? (
                  <Button
                    onClick={() => onEditName(record)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
                {canEditUserEmail ? (
                  <Button
                    onClick={() => onEditEmail(record)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Mail className="size-4" />
                  </Button>
                ) : null}
                {canManageUserPasswords ? (
                  <Button
                    onClick={() => onManagePassword(record)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Shield className="size-4" />
                  </Button>
                ) : null}
                {canSwitchUserRole ? (
                  <Button
                    onClick={() =>
                      onSwitchRole(record, record.roles[0] ?? roles[0]?.name ?? "")
                    }
                    size="icon-sm"
                    variant="outline"
                  >
                    <Shuffle className="size-4" />
                  </Button>
                ) : null}
                {canDeleteUser ? (
                  <Button
                    onClick={() => onDelete(record)}
                    size="icon-sm"
                    variant="outline"
                  >
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
