/**
 * Renders a JSON-LD `<script>` tag. Keep this in a separate component so
 * pages don't grow `dangerouslySetInnerHTML` noise — and so we can change
 * the serialization strategy (whitespace, escaping) in one place if we
 * ever need to.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
