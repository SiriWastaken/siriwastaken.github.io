import { FlowField } from "./flow-field";

/**
 * Fixed page background, behind everything: a dotted grid, dashed frame lines with crosshair marks
 * at the container edges (wide screens only), and the flow field on top of them.
 */
export function Backdrop() {
  return (
    <>
      <div aria-hidden="true" className="backdrop-dots pointer-events-none fixed inset-0 -z-20" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 hidden lg:block">
        <div className="relative mx-auto h-full w-full max-w-6xl border-x border-dashed border-rule">
          <span className="crosshair top-14 -left-[6px]" />
          <span className="crosshair top-14 -right-[6px]" />
        </div>
      </div>
      <FlowField />
    </>
  );
}
