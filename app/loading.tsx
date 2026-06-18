export default function Loading() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-10 w-40 animate-pulse rounded-full bg-zinc-200 dark:bg-white/10" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-[2rem] bg-zinc-200 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
