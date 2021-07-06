export function assetLoader(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fetch(url)
      .then((response) => response.blob())
      .then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob);
        resolve(objectURL);
      })
      .catch((e) => reject(e));
  });
}