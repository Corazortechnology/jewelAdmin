import { useAdminModule, type AdminModule } from "../../context/AdminModuleContext";

const modules: { id: AdminModule; label: string; shortLabel: string }[] = [
  { id: "shopping", label: "Shopping Control", shortLabel: "Shopping" },
  { id: "mlm", label: "MLM Control", shortLabel: "MLM" },
];

export default function ModuleSwitcher() {
  const { module, switchModule } = useAdminModule();

  return (
    <div
      className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-white/[0.03]"
      role="group"
      aria-label="Admin module switcher"
    >
      {modules.map((item) => {
        const active = module === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => switchModule(item.id)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              active
                ? "bg-white text-brand-600 shadow-theme-xs dark:bg-gray-900 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            aria-pressed={active}
          >
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
