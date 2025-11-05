export default function Pagination({ offset, setOffset, limit, hasMore }) {
  const prev = () => setOffset(Math.max(0, offset - limit));
  const next = () => setOffset(offset + limit);
  return (
    <div className="max-w-6xl mx-auto px-4 mt-4 mb-8 flex items-center justify-between">
      <button onClick={prev} disabled={offset === 0} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-50">Previous</button>
      <div className="text-xs text-gray-500">Offset: {offset}</div>
      <button onClick={next} disabled={!hasMore} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-50">Next</button>
    </div>
  );
}
