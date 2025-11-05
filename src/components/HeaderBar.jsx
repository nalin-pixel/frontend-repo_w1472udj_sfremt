import { Briefcase, Globe, Filter } from 'lucide-react';

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Universal Jobs</h1>
            <p className="text-xs text-gray-500">Modern aggregator from 130k+ career sites & ATS</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-600">
          <span className="inline-flex items-center gap-1 text-xs"><Globe size={14}/> Worldwide coverage</span>
          <span className="inline-flex items-center gap-1 text-xs"><Filter size={14}/> Powerful filters</span>
        </div>
      </div>
    </header>
  );
}
