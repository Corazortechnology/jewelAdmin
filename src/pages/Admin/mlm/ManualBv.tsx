import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import MlmPageBreadCrumb from "./components/MlmPageBreadCrumb";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import { mlmMemberApi } from "../../../services/mlm";
import { formatBv } from "./utils";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertState {
  variant: AlertVariant;
  title: string;
  message: string;
}

export default function MlmManualBv() {
  const [form, setForm] = useState({
    targetUid: "",
    bvAmount: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertState(null);

    const targetUid = form.targetUid.trim().toUpperCase();
    const bvAmount = Number(form.bvAmount);

    if (!targetUid) {
      setAlertState({
        variant: "warning",
        title: "Validation",
        message: "Member UID is required.",
      });
      return;
    }

    if (!Number.isFinite(bvAmount) || bvAmount <= 0) {
      setAlertState({
        variant: "warning",
        title: "Validation",
        message: "Enter a valid BV amount greater than zero.",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await mlmMemberApi.addManualBv({
        targetUid,
        bvAmount,
        note: form.note.trim() || undefined,
      });

      if (res.data.success) {
        setAlertState({
          variant: "success",
          title: "BV credited",
          message: `Successfully added ${formatBv(bvAmount)} BV to ${targetUid}.`,
        });
        setForm({ targetUid: "", bvAmount: "", note: "" });
      } else {
        setAlertState({
          variant: "error",
          title: "Failed",
          message: res.data.message ?? "Could not add manual BV.",
        });
      }
    } catch (err: unknown) {
      setAlertState({
        variant: "error",
        title: "Failed",
        message:
          (err as { message?: string })?.message ??
          "Could not add manual BV. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Manual BV | MLM Admin"
        description="Add offline manual business volume"
      />
      <MlmPageBreadCrumb pageTitle="Manual BV" />

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300">
            Offline billing credit
          </h3>
          <p className="mt-1 text-sm text-amber-700/90 dark:text-amber-200/80">
            Use this form to credit business volume from offline or manual
            billing. This action affects member team volume calculations.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Member UID</Label>
              <Input
                placeholder="OX482846"
                value={form.targetUid}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    targetUid: e.target.value.toUpperCase(),
                  }))
                }
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Enter the target member&apos;s UID (e.g. OX000001)
              </p>
            </div>

            <div>
              <Label>BV Amount</Label>
              <Input
                type="number"
                min="1"
                placeholder="50000"
                value={form.bvAmount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bvAmount: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Note (optional)</Label>
              <TextArea
                rows={3}
                placeholder="Offline manual bill"
                value={form.note}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, note: value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() =>
                  setForm({ targetUid: "", bvAmount: "", note: "" })
                }
              >
                Clear
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Processing…" : "Credit BV"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
