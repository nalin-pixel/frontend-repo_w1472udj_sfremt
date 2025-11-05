import { KeyRound, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function ApiKeyBar({ apiKey, setApiKey, apiHost, setApiHost, provider }) {
  const [show, setShow] = useState(false);

  const quickSet = (host) => {
    setApiHost(host);
    setShow(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="rounded-xl border bg-white p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center"><KeyRound size={16}/></div>
          <div>
            <p className="text-sm font-medium">Connect your API</p>
            <p className="text-xs text-gray-500">Paste your RapidAPI key and choose a provider.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => quickSet('fantastic.p.rapidapi.com')} className={`text-xs px-3 py-1.5 rounded-lg border ${provider === 'fantastic' ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Fantastic.jobs</button>
          <button onClick={() => quickSet('active-jobs-db.p.rapidapi.com')} className={`text-xs px-3 py-1.5 rounded-lg border ${provider === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Active Jobs DB</button>
          <button onClick={() => setShow(s => !s)} className="text-xs px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100">{show ? 'Hide' : 'Add Key'}</button>
        </div>
      </div>

      {show && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="password"
            className="col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="X-RapidAPI-Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="X-RapidAPI-Host"
              value={apiHost}
              onChange={(e) => setApiHost(e.target.value)}
            />
            <span className={`inline-flex items-center gap-1 text-xs px-2 rounded border ${provider === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
              <Building2 size={12}/> {provider === 'active' ? 'Active DB' : 'Fantastic'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
