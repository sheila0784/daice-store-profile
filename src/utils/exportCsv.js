export function exportCsv({
  data,
  headers,
  filename = "export.csv",
}) {
  const rows = data.map((row) =>
    headers.map((header) => row[header.key])
  );

  const csvContent = [
    headers.map((h) => h.label),
    ...rows,
  ]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}