export default function StoreLoading() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[85vh] bg-bg-secondary flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-48 h-8 bg-bg-elevated rounded mx-auto" />
          <div className="w-96 h-12 bg-bg-elevated rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
