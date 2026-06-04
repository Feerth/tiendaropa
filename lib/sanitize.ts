const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function sanitize(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => htmlEntities[ch] || ch);
}
