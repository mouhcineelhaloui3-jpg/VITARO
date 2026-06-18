import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-wider text-accent">
          404
        </p>
        <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.05em] text-heading">
          This Vitaro page is not available.
        </h1>
        <p className="mt-5 text-lg leading-[1.75] text-body">
          The route may be part of a future product, collection, or CMS page.
        </p>
        <ButtonLink className="mt-10" href="/" size="lg">
          Back to homepage
        </ButtonLink>
      </div>
    </div>
  );
}
