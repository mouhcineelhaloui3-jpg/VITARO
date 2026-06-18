"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-wider text-accent">
          Something went wrong
        </p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-heading">
          The experience hit a temporary issue.
        </h1>
        <p className="mt-5 text-lg leading-[1.75] text-body">
          {error.message || "Please retry or contact Vitaro support if the issue continues."}
        </p>
        <Button className="mt-10" size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
