interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-100 bg-white px-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
            active === tab.id
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
