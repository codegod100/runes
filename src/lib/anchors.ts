export default function convertLinksToAnchors(text: string): string {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Replace URLs with anchor tags
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`,
  );
}
