import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import { mlmMemberApi } from "../../../services/mlm";
import { currentPeriodKey } from "./utils";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertState {
  variant: AlertVariant;
  title: string;
  message: string;
}

export default function MlmClosing() {
  const [periodKey, setPeriodKey] = useState(currentPeriodKey());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const isValidPeriod = /^\d{4}-(0[1-9]|1[0-2])$/.test(periodKey);

  const handleRunClosing = async () => {
    if (!isValidPeriod) {
      setAlertState({
        variant: "warning",
        title: "Invalid period",
        message: "Period must be in YYYY-MM format (e.g. 2026-05).",
      });
      return;
    }

    setRunning(true);
    setAlertState(null);
    try {
      const res = await mlmMemberApi.runClosing({ periodKey });
      if (res.data.success) {
        setAlertState({
          variant: "success",
          title: "Closing completed",
          message: `Monthly closing for ${periodKey} has been processed successfully.`,
        });
        setConfirmOpen(false);
      } else {
        setAlertState({
          variant: "error",
          title: "Closing failed",
          message: res.data.message ?? "Could not run monthly closing.",
        });
      }
    } catch (err: unknown) {
      setAlertState({
        variant: "error",
        title: "Closing failed",
        message:
          (err as { message?: string })?.message ??
          "Could not run monthly closing. Please try again.",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Monthly Closing | MLM Admin"
        description="Run MLM monthly income closing"
      />
      <MlmPageBreadCrumb pageTitle="Monthly Closing" />

      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-red-200/70 bg-red-50/50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Critical operation
          </h3>
          <p className="mt-1 text-sm text-red-700/90 dark:text-red-200/80">
            Running monthly closing settles pending income for the selected
            period. This action cannot be undone easily — verify the period
            before proceeding.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {alertState && (
            <div className="mb-5">
              <Alert
                variant={alertState.variant}
                title={alertState.title}
                message={alertState.message}
              />
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label>Period Key</Label>
              <Input
                placeholder="2026-05"
                value={periodKey}
                onChange={(e) => setPeriodKey(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Format: YYYY-MM (year and month to close)
              </p>
            </div>

            {!confirmOpen ? (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={!isValidPeriod}
                  onClick={() => setConfirmOpen(true)}
                >
                  Run Closing
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Confirm monthly closing for{" "}
                  <span className="font-mono text-brand-600 dark:text-brand-400">
                    {periodKey}
                  </span>
                  ?
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  All pending income for this period will be settled.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={running}
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" disabled={running} onClick={handleRunClosing}>
                    {running ? "Running…" : "Confirm & Run"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            What happens during closing?
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>• Pending income for the period is calculated and settled</li>
            <li>• Member wallets are updated with settled amounts</li>
            <li>• Income records move from pending to settled status</li>
          </ul>
        </div>
      </div>
    </>
  );
}
