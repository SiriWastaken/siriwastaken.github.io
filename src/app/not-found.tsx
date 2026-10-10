import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-36">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">Nothing here.</h1>
      <p className="mt-4 text-lg text-muted">That page doesn&apos;t exist, or it moved.</p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary">
          Back to the homepage
        </ButtonLink>
      </div>
    </Container>
  );
}
