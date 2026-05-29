import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import { mlmMemberApi } from "../../../services/mlm";
import {
  DollarLineIcon,
  GroupIcon,
  ShootingStarIcon,
  CalenderIcon,
} from "../../../icons";
import { unwrapList } from "./utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  to?: string;
}

function StatCard({ title, value, subtitle, icon, loading, to }: StatCardProps) {
  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {loading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          ) : (
            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
          {icon}
        </div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
}

export default function MlmDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [inactiveMembers, setInactiveMembers] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [allRes, activeRes, inactiveRes, withdrawalsRes] = await Promise.all([
          mlmMemberApi.list({ page: 1, limit: 1 }),
          mlmMemberApi.list({ page: 1, limit: 1, memberStatus: "active" }),
          mlmMemberApi.list({ page: 1, limit: 1, memberStatus: "inactive" }),
          mlmMemberApi.listWithdrawals({ status: "pending" }),
        ]);

        if (cancelled) return;

        const all = unwrapList(allRes.data.data);
        const active = unwrapList(activeRes.data.data);
        const inactive = unwrapList(inactiveRes.data.data);
        const withdrawals = unwrapList(withdrawalsRes.data.data);

        setTotalMembers(all.total);
        setActiveMembers(active.total);
        setInactiveMembers(inactive.total);
        setPendingWithdrawals(withdrawals.total);
      } catch {
        if (!cancelled) {
          setTotalMembers(0);
          setActiveMembers(0);
          setInactiveMembers(0);
          setPendingWithdrawals(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickActions = [
    {
      title: "Manage Members",
      description: "Search, filter, and view member profiles",
      to: "/admin/mlm/members",
      icon: <GroupIcon className="size-5" />,
    },
    {
      title: "Add Manual BV",
      description: "Credit offline billing business volume",
      to: "/admin/mlm/manual-bv",
      icon: <ShootingStarIcon className="size-5" />,
    },
    {
      title: "Run Monthly Closing",
      description: "Settle pending income for a period",
      to: "/admin/mlm/closing",
      icon: <CalenderIcon className="size-5" />,
    },
    {
      title: "Process Withdrawals",
      description: "Review and approve payout requests",
      to: "/admin/mlm/withdrawals",
      icon: <DollarLineIcon className="size-5" />,
    },
  ];

  return (
    <>
      <PageMeta
        title="MLM Dashboard | Admin"
        description="MLM admin control panel overview"
      />
      <MlmPageBreadCrumb pageTitle="MLM Dashboard" />

      <div className="mb-6 rounded-2xl border border-brand-200/60 bg-gradient-to-r from-brand-50 via-white to-white p-6 dark:border-brand-500/20 dark:from-brand-500/10 dark:via-gray-900 dark:to-gray-900">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          MLM Control Panel
        </p>
        <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
          Network operations at a glance
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Monitor member growth, process offline BV, run monthly closings, and
          manage withdrawal requests from one place.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Members"
          value={totalMembers}
          subtitle="All registered members"
          icon={<GroupIcon className="size-5" />}
          loading={loading}
          to="/admin/mlm/members"
        />
        <StatCard
          title="Active Members"
          value={activeMembers}
          subtitle="Activated accounts"
          icon={<GroupIcon className="size-5" />}
          loading={loading}
          to="/admin/mlm/members"
        />
        <StatCard
          title="Inactive Members"
          value={inactiveMembers}
          subtitle="Awaiting activation"
          icon={<GroupIcon className="size-5" />}
          loading={loading}
          to="/admin/mlm/members"
        />
        <StatCard
          title="Pending Withdrawals"
          value={pendingWithdrawals}
          subtitle="Needs admin action"
          icon={<DollarLineIcon className="size-5" />}
          loading={loading}
          to="/admin/mlm/withdrawals"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Quick Actions
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/40 dark:border-gray-800 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition group-hover:bg-brand-100 group-hover:text-brand-600 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400">
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {action.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
