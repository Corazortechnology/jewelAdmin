import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import { mlmMemberApi, type MlmMember } from "../../../services/mlm";
import { formatCurrency, formatDate, formatDateTime, formatPhone } from "./utils";
import { MemberStatusBadge } from "./components/StatusBadges";

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-gray-900 dark:text-white/90">
        {value ?? "—"}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function MlmMemberDetail() {
  const { uid } = useParams<{ uid: string }>();
  const [member, setMember] = useState<MlmMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    mlmMemberApi
      .getByUid(uid)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setMember(res.data.data);
        } else {
          setError("Member not found.");
        }
      })
      .catch((err: { message?: string }) => {
        setError(err?.message ?? "Failed to load member details.");
      })
      .finally(() => setLoading(false));
  }, [uid]);

  return (
    <>
      <PageMeta
        title={`Member ${uid ?? ""} | MLM Admin`}
        description="MLM member profile details"
      />
      <MlmPageBreadCrumb
        pageTitle={uid ?? "Member Detail"}
        parent={{ label: "Members", path: "/admin/mlm/members" }}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : error ? (
        <Alert variant="error" title="Error" message={error} />
      ) : member ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
            <div>
              <p className="font-mono text-sm text-brand-600 dark:text-brand-400">
                {member.uid}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                {member.name ?? "Unnamed Member"}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <MemberStatusBadge status={member.memberStatus} />
                {(member.referrerUid ?? member.referrerId) && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Sponsor:{" "}
                    <Link
                      to={`/admin/mlm/members/${member.referrerUid ?? member.referrerId}`}
                      className="font-mono text-brand-600 hover:underline dark:text-brand-400"
                    >
                      {member.referrerUid ?? member.referrerId}
                    </Link>
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/mlm/manual-bv">
                <Button size="sm" variant="outline">
                  Add Manual BV
                </Button>
              </Link>
              <Link to="/admin/mlm/members">
                <Button size="sm" variant="outline">
                  Back to list
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Balance
              </p>
              <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
                {formatCurrency(member.wallet?.availableBalance)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Balance
              </p>
              <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
                {formatCurrency(member.wallet?.pendingBalance)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Earned
              </p>
              <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
                {formatCurrency(member.wallet?.totalEarned)}
              </p>
            </div>
          </div>

          <SectionCard title="Contact">
            <InfoRow label="Email" value={member.email} />
            <InfoRow
              label="Phone"
              value={formatPhone(
                member.phone,
                member.countryCode,
                member.contactNo
              )}
            />
            <InfoRow
              label="Email verified"
              value={member.emailVerified ? "Yes" : "No"}
            />
            <InfoRow
              label="Phone verified"
              value={member.phoneVerified ? "Yes" : "No"}
            />
            <InfoRow
              label="PAN verified"
              value={member.panVerified ? "Yes" : "No"}
            />
            <InfoRow label="PAN" value={member.panNo} />
            <InfoRow
              label="Date of Joining"
              value={formatDateTime(member.dateOfJoining ?? member.createdAt)}
            />
            {member.activatedAt && (
              <InfoRow
                label="Activated At"
                value={formatDateTime(member.activatedAt)}
              />
            )}
          </SectionCard>

          <SectionCard title="Team Overview">
            <InfoRow
              label="Direct Team"
              value={member.teamDetails?.directTeamCount}
            />
            <InfoRow
              label="Total Team"
              value={member.teamDetails?.totalTeamCount}
            />
            <InfoRow
              label="Active Team"
              value={member.teamDetails?.activeTeamCount}
            />
            <InfoRow
              label="Inactive Team"
              value={member.teamDetails?.inactiveTeamCount}
            />
          </SectionCard>

          <SectionCard title="Activation">
            <InfoRow
              label="Activation Date"
              value={formatDate(member.activationDetails?.activationDate)}
            />
            <InfoRow
              label="Activation Amount"
              value={formatCurrency(member.activationDetails?.activationAmount)}
            />
            <InfoRow
              label="Activation Status"
              value={member.activationDetails?.activationStatus}
            />
            <InfoRow
              label="Payment Status"
              value={member.activationDetails?.paymentStatus}
            />
          </SectionCard>

          {member.bank && Object.keys(member.bank).length > 0 && (
            <SectionCard title="Bank Details">
              {Object.entries(member.bank).map(([key, value]) => (
                <InfoRow
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  value={String(value ?? "—")}
                />
              ))}
            </SectionCard>
          )}

          {member.nominee && Object.keys(member.nominee).length > 0 && (
            <SectionCard title="Nominee">
              {Object.entries(member.nominee).map(([key, value]) => (
                <InfoRow
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  value={String(value ?? "—")}
                />
              ))}
            </SectionCard>
          )}
        </div>
      ) : null}
    </>
  );
}
