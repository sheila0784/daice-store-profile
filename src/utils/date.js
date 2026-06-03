export const formatDate = (date) => {
  if (!date) return "";

  //   return new Intl.DateTimeFormat("en-PH", {
  //     year: "numeric",
  //     month: "short",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(new Date(date));

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatDateLabel = (range) => {
  if (!range || !range[0]) return "";

  const start = new Date(range[0]);
  const end = range[1] ? new Date(range[1]) : null;

  const fullOptions = {
    timeZone: "Asia/Manila",
    weekday: "short", // ✅ adds Mon, Tue, etc.
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const shortOptions = {
    timeZone: "Asia/Manila",
    weekday: "short", // ✅ adds Mon, Tue, etc.
    month: "short",
    day: "2-digit",
  };

  const formatFull = (date) => new Intl.DateTimeFormat("en-PH", fullOptions).format(date);
  // .replace(",", "");

  const formatShort = (date) =>
    new Intl.DateTimeFormat("en-PH", shortOptions).format(date).replace(",", "");

  const startLabel = formatShort(start); // ❌ no year
  const endLabel = end ? formatFull(end) : null; // ✔ with year

  // single date
  if (!end || start.toDateString() === end.toDateString()) {
    return formatFull(start);
  }

  return `${startLabel} – ${endLabel}`;
};
