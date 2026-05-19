type Props = { items: string[]; accent?: boolean };

export function Marquee({ items, accent }: Props) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`overflow-hidden border-y border-[color:var(--border)] py-3 ${
        accent ? "bg-[color:var(--accent)] text-white" : "bg-black/40"
      }`}
    >
      <div className="marquee gap-10 whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="display text-xl md:text-2xl tracking-wider px-5 inline-flex items-center gap-10"
          >
            {it}
            <span aria-hidden className="opacity-60">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
