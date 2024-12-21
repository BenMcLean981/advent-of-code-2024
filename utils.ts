export function readLines(filePath: string): ReadonlyArray<string> {
  const content = readFileAsString(filePath);

  return content.split(/\r?\n/).filter((l) => l.trim() !== "");
}

export function readFileAsString(filePath: string): string {
  const decoder = new TextDecoder("utf8");
  const contents = Deno.readFileSync(filePath);

  return decoder.decode(contents);
}

export function isEven(n: number): boolean {
  return n % 2 === 0;
}

export function isOdd(n: number): boolean {
  return !isEven(n);
}

export function notUndefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}
