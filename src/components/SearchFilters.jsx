import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Info } from 'lucide-react';

const timeWindows = [
  { value: '7d', label: 'Last 7 days' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'hourly', label: 'Hourly feed' },
  { value: 'backfill', label: 'Backfill (6 months)' },
];

export default function SearchFilters({ initial, onSearch, loading, provider }) {
  const [form, setForm] = useState({
    title_filter: initial.title_filter || '',
    location_filter: initial.location_filter || '',
    description_filter: initial.description_filter || '',
    source: initial.source || '',
    remote: initial.remote || '',
    include_ai: Boolean(initial.include_ai),
    time_window: initial.time_window || '24h',
    limit: initial.limit || 20,
  });

  useEffect(() => {
    // When provider switches to Active, lock time_window to 24h per API design
    if (provider === 'active' && form.time_window !== '24h') {
      setForm((s) => ({ ...s, time_window: '24h' }));
    }
  }, [provider]);

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

        {provider === 'active' && (
          <div className="mb-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2 inline-flex items-start gap-2">
            <Info size={14} className="mt-0.5"/>
            <span>Active Jobs DB shows modified jobs in the last 24 hours only. Supported filters: limit, offset, and optional description type. Title/location/source filters are ignored by the backend for this provider.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {provider !== 'active' && (
            <>
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
            </>
          )}

          {provider !== 'active' ? (
            <select
              name="time_window"
              value={form.time_window}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {timeWindows.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          ) : (
            <input
              value="Last 24 hours (modified)"
              readOnly
              className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 text-gray-600"
            />
          )}

          {provider !== 'active' && (
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
          )}

          {provider !== 'active' && (
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className="md:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Sources e.g. workday,greenhouse"
            />
          )}

          <input
            type="number"
            name="limit"
            min={10}
            max={provider === 'active' ? 500 : 100}
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
          <div className="text-xs text-gray-500">{provider === 'active' ? 'Offset pagination applies. Combine with limit for larger pages.' : 'Tip: Combine multiple filters for the best results.'}</div>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60">
            <Search size={16}/>
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
      </div>
    </form>
  );
}
