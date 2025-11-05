import { KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function ApiKeyBar({ apiKey, setApiKey, apiHost, setApiHost }) {
  const [show, setShow] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="rounded-xl border bg-white p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center"><KeyRound size={16}/></div>
          <div>
            <p className="text-sm font-medium">Connect your API</p>
            <p className="text-xs text-gray-500">Paste your RapidAPI key to fetch live jobs. You can change it anytime.</p>
          </div>
        </div>
        <button onClick={() => setShow(s => !s)} className="text-xs px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100">{show ? 'Hide' : 'Add Key'}</button>
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
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="X-RapidAPI-Host (default: fantastic.p.rapidapi.com)"
            value={apiHost}
            onChange={(e) => setApiHost(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
