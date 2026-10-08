export default function SkeletonCard() {
  return (
    <div className="card bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="card-body p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="flex justify-between">
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}