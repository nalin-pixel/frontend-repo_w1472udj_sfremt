import { useEffect, useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar';
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

  const payload = useMemo(() => ({
    ...filters,
    offset,
    api_key: apiKey || undefined,
    api_host: apiHost || undefined,
  }), [filters, offset, apiKey, apiHost]);

  const runSearch = async (incoming) => {
    setOffset(0);
    setFilters((s) => ({ ...s, ...incoming }));
  };

  // Derive provider from host
  const provider = apiHost?.includes('active-jobs-db.p.rapidapi.com') ? 'active' : 'fantastic';

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
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail?.message || data?.detail || 'Failed to fetch');
        setJobs(data.jobs || []);
        setRateLimits(data.rate_limits || null);
      } catch (e) {
        setError(e.message || 'Something went wrong');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [payload, apiKey, apiHost]);

  const hasMore = jobs.length >= (filters.limit || 20); // optimistic

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
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
          <span>Using Active Jobs DB: Showing modified jobs in the last 24 hours. Only limit, offset, and description type are applied.</span>
        ) : (
          <span>Using Fantastic.jobs: Filters like title, location, remote, and time window apply.</span>
        )}
      </footer>
    </div>
  );
}

export default App;
