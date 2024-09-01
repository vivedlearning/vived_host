export function downloadFile(filename: string, file: Blob) {
  let a = document.createElement("a"),
    url = window.URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
