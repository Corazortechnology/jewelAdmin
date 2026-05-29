import type { MemberStatus, WithdrawalStatus } from "../../../../services/mlm";
import Badge from "../../../../components/ui/badge/Badge";

const memberStatusColor: Record<
  MemberStatus,
  "success" | "warning" | "error" | "info"
> = {
  active: "success",
  inactive: "warning",
};

const withdrawalStatusColor: Record<
  WithdrawalStatus,
  "success" | "warning" | "error" | "info"
> = {
  pending: "warning",
  approved: "info",
  rejected: "error",
  paid: "success",
};

export function MemberStatusBadge({ status }: { status?: MemberStatus }) {
  if (!status) return <span className="text-gray-400">—</span>;
  return (
    <Badge color={memberStatusColor[status]} size="sm">
      {status}
    </Badge>
  );
}

export function WithdrawalStatusBadge({ status }: { status?: WithdrawalStatus }) {
  if (!status) return <span className="text-gray-400">—</span>;
  return (
    <Badge color={withdrawalStatusColor[status]} size="sm">
      {status}
    </Badge>
  );
}
