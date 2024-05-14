export function formatLocation(
  stringList: string[],
  separator: string = " "
): string {
  const location = stringList
    .filter((part) => part?.trim().length)
    .join(separator);
  return location;
}

export function isValidChineseEnglishInput(input: string): boolean {
  const regex = /^[\u4e00-\u9fa5A-Za-z]+$/;
  return regex.test(input);
}
