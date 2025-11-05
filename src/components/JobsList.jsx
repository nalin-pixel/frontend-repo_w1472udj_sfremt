import { ExternalLink, MapPin, Building2, Clock } from 'lucide-react';

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  return dt.toLocaleString();
}

export default function JobsList({ jobs, loading, error, rateLimits }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-gray-600">{jobs?.length || 0} results</h2>
        {rateLimits && (
          <div className="text-xs text-gray-500">
            {rateLimits['x-ratelimit-jobs-remaining'] !== undefined && (
              <span className="mr-3">Jobs left: {rateLimits['x-ratelimit-jobs-remaining']}</span>
            )}
            {rateLimits['x-ratelimit-requests-remaining'] !== undefined && (
              <span>Requests left: {rateLimits['x-ratelimit-requests-remaining']}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        {loading && (
          <div className="rounded-xl border p-6 animate-pulse bg-white">Loading jobs...</div>
        )}
        {error && (
          <div className="rounded-xl border p-4 bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        {!loading && !error && jobs?.length === 0 && (
          <div className="rounded-xl border p-6 bg-white text-sm text-gray-600">
            No jobs to show yet. Run a search after adding your API key.
          </div>
        )}

        {jobs?.map((job) => (
          <article key={job.id || job.url} className="rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {job.organization && (
                    <span className="inline-flex items-center gap-1"><Building2 size={14}/> {job.organization}</span>
                  )}
                  {job.locations_derived?.length > 0 && (
                    <span className="inline-flex items-center gap-1"><MapPin size={14}/> {job.locations_derived.map(l => l.city || l.admin || l.country).filter(Boolean).join(', ')}</span>
                  )}
                  {job.date_posted && (
                    <span className="inline-flex items-center gap-1"><Clock size={14}/> {formatDate(job.date_posted)}</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.source && <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{job.source}</span>}
                  {job.remote_derived && <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Remote</span>}
                  {job.ai_experience_level && <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{job.ai_experience_level}</span>}
                  {job.employment_type?.[0] && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{job.employment_type[0]}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.organization_logo && (
                  <img src={job.organization_logo} alt="logo" className="h-10 w-10 rounded object-contain border"/>
                )}
                {job.url && (
                  <a className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg border hover:bg-gray-50" href={job.url} target="_blank" rel="noreferrer">
                    Apply <ExternalLink size={14}/>
                  </a>
                )}
              </div>
            </div>
            {job.ai_core_responsibilities && (
              <p className="mt-3 text-sm text-gray-700 line-clamp-2">{job.ai_core_responsibilities}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
