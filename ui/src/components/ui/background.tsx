export default function DotGridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="gradient-base" />
      <div className="gradient-layer layer-one" />
      <div className="gradient-layer layer-two" />
    </div>
  );
}
