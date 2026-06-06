export default function ProductosLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="w-64 h-10 bg-bg-elevated rounded mb-8" />
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-bg-elevated rounded" />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-bg-elevated rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
