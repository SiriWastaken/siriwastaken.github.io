import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-36">
      <h1 className="font-display text-8xl leading-none tracking-tight sm:text-9xl">
        404<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 text-xl">
        Nothing here. Either it moved or it never existed.
      </p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary">
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
