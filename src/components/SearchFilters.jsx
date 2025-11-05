import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const timeWindows = [
  { value: '7d', label: 'Last 7 days' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'hourly', label: 'Hourly feed' },
  { value: 'backfill', label: 'Backfill (6 months)' },
];

export default function SearchFilters({ initial, onSearch, loading }) {
  const [form, setForm] = useState({
    title_filter: initial.title_filter || '',
    location_filter: initial.location_filter || '',
    description_filter: initial.description_filter || '',
    source: initial.source || '',
    remote: initial.remote || '',
    include_ai: initial.include_ai || false,
    time_window: initial.time_window || '7d',
    limit: initial.limit || 20,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form onSubmit={submit} className="max-w-6xl mx-auto px-4 mt-4">
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <SlidersHorizontal size={16}/>
          <span className="text-sm font-medium">Search filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            name="title_filter"
            value={form.title_filter}
            onChange={handleChange}
            className="md:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Title e.g. Software Engineer"
          />
          <input
            name="location_filter"
            value={form.location_filter}
            onChange={handleChange}
            className="md:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Location e.g. United States OR United Kingdom"
          />
          <select
            name="time_window"
            value={form.time_window}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {timeWindows.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select
            name="remote"
            value={form.remote}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Remote: All</option>
            <option value="true">Remote only</option>
            <option value="false">On-site only</option>
          </select>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            className="md:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Sources e.g. workday,greenhouse"
          />
          <input
            type="number"
            name="limit"
            min={10}
            max={100}
            value={form.limit}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Limit"
          />
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="include_ai" checked={form.include_ai} onChange={handleChange} className="rounded"/>
            Include AI insights
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">Tip: Combine multiple filters for the best results.</div>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60">
            <Search size={16}/>
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
      </div>
    </form>
  );
}
