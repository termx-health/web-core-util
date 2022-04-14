const DISPLAYABLE_CONTENT_TYPES = [
  'application/pdf',
  'image/bmp',
  'image/x-bmp',
  'image/gif',
  'image/jpeg',
  'image/apng',
  'image/png',
  'image/svg+xml'
];

export function openOrDownload(name: string, content: Blob): void {
  if (!content) {
    return;
  }
  const url = window.URL.createObjectURL(content);
  if (DISPLAYABLE_CONTENT_TYPES.includes(content.type)) {
    window.open(url, '_blank');
  } else {
    //Download file
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = name;
    link.click();
  }
}

export function base64ToBlob(content: string, contentType: string): Blob {
  const byteString = atob(content);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: contentType});
}
