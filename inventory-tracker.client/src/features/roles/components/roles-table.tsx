import { Pencil, Trash2 } from "lucide-react";

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
import { countEnabledPermissions } from "@/config/permissions";
import type { Role } from "@/features/roles/api/roles-api";

type RolesTableProps = {
  canDeleteRole: boolean;
  canManageRolePermissions: boolean;
  onDelete: (role: Role) => void;
  onEditPermissions: (role: Role) => void;
  roles: Role[];
};

export function RolesTable({
  canDeleteRole,
  canManageRolePermissions,
  onDelete,
  onEditPermissions,
  roles,
}: RolesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Assigned users</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Access summary</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell>{role.userCount}</TableCell>
            <TableCell>{countEnabledPermissions(role.permissions)}</TableCell>
            <TableCell>
              <Badge
                variant={role.permissions.length > 10 ? "default" : "secondary"}
              >
                {role.permissions.length > 10 ? "Broad access" : "Scoped access"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canManageRolePermissions ? (
                  <Button
                    onClick={() => onEditPermissions(role)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
                {canDeleteRole ? (
                  <Button
                    onClick={() => onDelete(role)}
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
