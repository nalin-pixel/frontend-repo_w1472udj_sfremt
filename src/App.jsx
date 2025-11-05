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
    time_window: '7d',
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

  useEffect(() => {
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
  }, [payload]);

  const hasMore = jobs.length >= (filters.limit || 20); // optimistic

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <ApiKeyBar apiKey={apiKey} setApiKey={setApiKey} apiHost={apiHost} setApiHost={setApiHost} />
      <SearchFilters initial={filters} onSearch={runSearch} loading={loading} />
      <JobsList jobs={jobs} loading={loading} error={error} rateLimits={rateLimits} />
      <Pagination offset={offset} setOffset={setOffset} limit={filters.limit || 20} hasMore={hasMore} />
      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-gray-500">
        Data from employer career sites & ATS. Paste your API key above to fetch live jobs.
      </footer>
    </div>
  );
}

export default App;
