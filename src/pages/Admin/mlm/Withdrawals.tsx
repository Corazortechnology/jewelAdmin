import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/input/TextArea";
import Alert from "../../../components/ui/alert/Alert";
import {
  mlmMemberApi,
  type ProcessWithdrawalStatus,
  type WithdrawalRequest,
  type WithdrawalStatus,
} from "../../../services/mlm";
import { formatCurrency, formatDateTime, unwrapList } from "./utils";
import { WithdrawalStatusBadge } from "./components/StatusBadges";

const STATUS_TABS: { label: string; value: "" | WithdrawalStatus }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Paid", value: "paid" },
  { label: "Rejected", value: "rejected" },
];

export default function MlmWithdrawals() {
  const [items, setItems] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | WithdrawalStatus>("pending");
  const [selected, setSelected] = useState<WithdrawalRequest | null>(null);
  const [processStatus, setProcessStatus] =
    useState<ProcessWithdrawalStatus>("approved");
  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(() => {
    setLoading(true);
    mlmMemberApi
      .listWithdrawals({
        status: statusFilter || undefined,
      })
      .then((res) => {
        if (res.data.success) {
          const { items: list } = unwrapList(res.data.data);
          setItems(list);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const openProcessModal = (item: WithdrawalRequest) => {
    setSelected(item);
    setProcessStatus(
      item.status === "pending" ? "approved" : (item.status as ProcessWithdrawalStatus) ?? "approved"
    );
    setAdminNote(item.adminNote ?? "");
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    if (processing) return;
    setSelected(null);
    setError(null);
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setProcessing(true);
    setError(null);
    try {
      const res = await mlmMemberApi.processWithdrawal(selected._id, {
        status: processStatus,
        adminNote: adminNote.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess("Withdrawal processed successfully.");
        setSelected(null);
        fetchWithdrawals();
      } else {
        setError(res.data.message ?? "Failed to process withdrawal.");
      }
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ??
          "Failed to process withdrawal."
      );
    } finally {
      setProcessing(false);
    }
  };

  const memberUid = (item: WithdrawalRequest) =>
    item.memberUid ?? item.uid ?? "—";

  const memberName = (item: WithdrawalRequest) =>
    item.memberName ?? item.name ?? "—";

  return (
    <>
      <PageMeta
        title="Withdrawals | MLM Admin"
        description="Manage MLM withdrawal requests"
      />
      <MlmPageBreadCrumb pageTitle="Withdrawals" />

      {success && (
        <div className="mb-4">
          <Alert variant="success" title="Success" message={success} />
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Withdrawal Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review, approve, reject, or mark payouts as paid
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value || "all"}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  statusFilter === tab.value
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader className="border-y border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/40">
                <TableRow>
                  <TableCell isHeader className="px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Member
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Requested
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Net Payable
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Requested On
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2.5 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No withdrawal requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="px-4 py-3 align-middle">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {memberName(item)}
                        </div>
                        <div className="font-mono text-xs text-brand-600 dark:text-brand-400">
                          {memberUid(item)}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 align-middle text-gray-700 dark:text-gray-300">
                        {formatCurrency(item.requestedAmount)}
                      </TableCell>
                      <TableCell className="px-4 py-3 align-middle font-medium text-gray-800 dark:text-white/90">
                        {formatCurrency(item.netPayable)}
                      </TableCell>
                      <TableCell className="px-4 py-3 align-middle">
                        <WithdrawalStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="px-4 py-3 align-middle text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(item.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 py-3 align-middle text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openProcessModal(item)}
                        >
                          {item.status === "pending" ? "Process" : "Update"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selected}
        onClose={closeModal}
        className="max-w-lg p-6 shadow-xl"
      >
        {selected && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Process Withdrawal
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {memberName(selected)} ({memberUid(selected)})
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-800/40">
              <div>
                <p className="text-xs text-gray-400">Requested</p>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(selected.requestedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Net Payable</p>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(selected.netPayable)}
                </p>
              </div>
              {selected.adminCharge != null && (
                <div>
                  <p className="text-xs text-gray-400">Admin Charge</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatCurrency(selected.adminCharge)}
                  </p>
                </div>
              )}
              {selected.ugcCharge != null && (
                <div>
                  <p className="text-xs text-gray-400">UGC Charge</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatCurrency(selected.ugcCharge)}
                  </p>
                </div>
              )}
            </div>

            {selected.bankDetails && (
              <div className="mt-4 rounded-xl border border-gray-100 p-4 text-sm dark:border-gray-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Bank Details
                </p>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  {selected.bankDetails.accountName && (
                    <p>{selected.bankDetails.accountName}</p>
                  )}
                  {selected.bankDetails.accountNumber && (
                    <p className="font-mono">
                      {selected.bankDetails.accountNumber}
                    </p>
                  )}
                  {selected.bankDetails.ifscCode && (
                    <p>IFSC: {selected.bankDetails.ifscCode}</p>
                  )}
                  {selected.bankDetails.bankName && (
                    <p>{selected.bankDetails.bankName}</p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleProcess} className="mt-5 space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={processStatus}
                  onChange={(e) =>
                    setProcessStatus(e.target.value as ProcessWithdrawalStatus)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <Label>Admin Note</Label>
                <TextArea
                  rows={3}
                  placeholder="Transferred to bank"
                  value={adminNote}
                  onChange={setAdminNote}
                />
              </div>
              {error && <p className="text-sm text-error-500">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={processing}
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={processing}>
                  {processing ? "Saving…" : "Submit"}
                </Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}
