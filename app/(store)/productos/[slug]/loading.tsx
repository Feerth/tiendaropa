export default function ProductoDetalleLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-bg-elevated rounded-xl" />
        <div className="space-y-6">
          <div className="w-24 h-4 bg-bg-elevated rounded" />
          <div className="w-72 h-12 bg-bg-elevated rounded" />
          <div className="w-32 h-10 bg-bg-elevated rounded" />
          <div className="w-full h-24 bg-bg-elevated rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-bg-elevated rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
