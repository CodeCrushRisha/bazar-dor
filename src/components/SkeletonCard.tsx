export default function SkeletonCard() {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-base-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-base-300 rounded" />
            <div className="h-3 w-1/2 bg-base-300 rounded" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 w-20 bg-base-300 rounded" />
          <div className="flex justify-between">
            <div className="h-5 w-24 bg-base-300 rounded" />
            <div className="h-5 w-12 bg-base-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}