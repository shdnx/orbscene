// Based on: https://stackoverflow.com/a/18197341/128240
export default function promptDownloadFile(filename, text, mimeType) {
  mimeType = mimeType || "text/plain";

  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
