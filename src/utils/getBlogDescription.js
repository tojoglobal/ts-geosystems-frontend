export function getDescriptionTextFromHtml(html) {
  if (!html) return "";
  const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (matches && matches.length > 0) {
    const tempDiv = document.createElement("div");
    const filtered = matches.filter((p) => {
      tempDiv.innerHTML = p;
      return (
        (tempDiv.textContent || tempDiv.innerText || "").trim().length > 10
      );
    });
    const text = filtered.length
      ? filtered
          .map((p) => {
            tempDiv.innerHTML = p;
            return tempDiv.textContent || tempDiv.innerText || "";
          })
          .join(" ")
      : matches
          .map((p) => {
            tempDiv.innerHTML = p;
            return tempDiv.textContent || tempDiv.innerText || "";
          })
          .join(" ");
    return text;
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}