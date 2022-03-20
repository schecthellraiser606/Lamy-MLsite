export function getImageSrc(filepath: string): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return require(filepath);
  } else {
    return require(filepath);
  }
}
