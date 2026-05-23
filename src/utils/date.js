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
