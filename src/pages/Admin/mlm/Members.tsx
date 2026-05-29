import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import { mlmMemberApi, type MemberStatus, type MlmMember } from "../../../services/mlm";
import { formatDate, formatPhone, unwrapList } from "./utils";
import { MemberStatusBadge } from "./components/StatusBadges";
import { EyeIcon } from "../../../icons";

const LIMIT = 20;

export default function MlmMembers() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MlmMember[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | MemberStatus>("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = useCallback(() => {
    setLoading(true);
    mlmMemberApi
      .list({
        page,
        limit: LIMIT,
        search: search || undefined,
        memberStatus: statusFilter || undefined,
      })
      .then((res) => {
        if (res.data.success) {
          const {
            items: list,
            total: count,
            totalPages: pages,
          } = unwrapList(res.data.data);
          setItems(list);
          setTotal(count);
          setTotalPages(pages ?? (Math.ceil(count / LIMIT) || 1));
        } else {
          setItems([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <>
      <PageMeta title="MLM Members | Admin" description="Manage MLM members" />
      <MlmPageBreadCrumb pageTitle="Members" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              All Members
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Search by UID, name, email, or phone
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as "" | MemberStatus);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                placeholder="Search members..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <Table className="w-full table-fixed">
              <TableHeader className="border-y border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/40">
                <TableRow>
                  <TableCell
                    isHeader
                    className="w-[14%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    UID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-[22%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-[24%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-[16%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-[12%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-[12%] px-4 py-2.5 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Joined
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
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((member) => (
                    <TableRow
                      key={member.uid}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                      onClick={() =>
                        navigate(`/admin/mlm/members/${member.uid}`)
                      }
                    >
                      <TableCell className="px-4 py-2.5 align-middle font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
                        {member.uid}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 align-middle font-medium text-gray-800 dark:text-white/90">
                        {member.name ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 align-middle text-gray-500 dark:text-gray-400">
                        {member.email ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 align-middle text-gray-500 dark:text-gray-400">
                        {formatPhone(
                          member.phone,
                          member.countryCode,
                          member.contactNo
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 align-middle">
                        <MemberStatusBadge status={member.memberStatus} />
                      </TableCell>
                      <TableCell className="px-4 py-2.5 align-middle text-gray-500 dark:text-gray-400">
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            {formatDate(member.dateOfJoining ?? member.createdAt)}
                          </span>
                          <EyeIcon className="size-4 shrink-0 text-gray-400" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
            <span className="text-sm text-gray-500">
              Showing {items.length} of {total} members
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
