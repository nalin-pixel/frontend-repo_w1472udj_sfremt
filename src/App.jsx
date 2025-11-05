import { useEffect, useMemo, useState } from 'react';
import ApiKeyBar from './components/ApiKeyBar';
import SearchFilters from './components/SearchFilters';
import JobsList from './components/JobsList';
import Pagination from './components/Pagination';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiHost, setApiHost] = useState('fantastic.p.rapidapi.com');

  const [filters, setFilters] = useState({
    title_filter: '',
    location_filter: '',
    description_filter: '',
    source: '',
    remote: '',
    include_ai: true,
    time_window: '24h',
    limit: 20,
  });

  const [offset, setOffset] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimits, setRateLimits] = useState(null);

  // Derive provider from host
  const provider = apiHost?.includes('active-jobs-db.p.rapidapi.com') ? 'active' : 'fantastic';

  const payload = useMemo(() => {
    // Build a base payload from filters and pagination
    const base = {
      offset,
      api_key: apiKey || undefined,
      api_host: apiHost || undefined,
    };

    if (provider === 'active') {
      // Only send supported fields for Active Jobs DB
      const lim = Number(filters.limit) || 100;
      return {
        ...base,
        title_filter: filters.title_filter || undefined,
        location_filter: filters.location_filter || undefined,
        description_type: 'text',
        limit: Math.min(100, Math.max(10, lim)),
      };
    }

    // Fantastic.jobs supports richer filtering
    return {
      ...base,
      ...filters,
    };
  }, [filters, offset, apiKey, apiHost, provider]);

  const runSearch = async (incoming) => {
    setOffset(0);
    setFilters((s) => ({ ...s, ...incoming }));
  };

  useEffect(() => {
    const shouldFetch = Boolean(apiKey) && Boolean(apiHost);
    if (!shouldFetch) {
      setJobs([]);
      setError('');
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${BACKEND_URL}/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const detail = data?.detail;
          const msg =
            (typeof detail === 'string' && detail) ||
            detail?.message ||
            detail?.error ||
            data?.message ||
            'Failed to fetch';
          throw new Error(msg);
        }
        setJobs(data.jobs || []);
        setRateLimits(data.rate_limits || null);
      } catch (e) {
        const msg = e?.message || 'Something went wrong';
        setError(msg);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [payload, apiKey, apiHost]);

  const hasMore = jobs.length >= (provider === 'active' ? Math.min(100, Math.max(10, Number(filters.limit) || 100)) : (filters.limit || 20));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-semibold">J</div>
            <div>
              <h1 className="text-sm font-semibold">Job Aggregator</h1>
              <p className="text-xs text-gray-500">Search modified roles in the last 24 hours</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Provider: <span className={provider === 'active' ? 'text-emerald-700' : 'text-indigo-700'}>{provider}</span></div>
        </div>
      </header>

      <ApiKeyBar
        apiKey={apiKey}
        setApiKey={setApiKey}
        apiHost={apiHost}
        setApiHost={setApiHost}
        provider={provider}
      />

      <SearchFilters
        initial={filters}
        onSearch={runSearch}
        loading={loading}
        provider={provider}
      />

      <JobsList jobs={jobs} loading={loading} error={error} rateLimits={rateLimits} />

      <Pagination offset={offset} setOffset={setOffset} limit={filters.limit || 20} hasMore={hasMore} />

      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-gray-500">
        {provider === 'active' ? (
          <span>
            Using Active Jobs DB: Modified in the last 24 hours. Supported inputs: title, location, limit (10-100), offset. Description type is set to text.
          </span>
        ) : (
          <span>
            Using Fantastic.jobs: Title, location, remote, source, time window, and more are supported.
          </span>
        )}
      </footer>
    </div>
  );
}

export default App;
