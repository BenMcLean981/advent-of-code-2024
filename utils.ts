export function readLines(filePath: string): ReadonlyArray<string> {
  const content = readFileAsString(filePath);

  return content.split(/\r?\n/).filter((l) => l.trim() !== "");
}

export function readFileAsString(filePath: string): string {
  const decoder = new TextDecoder("utf8");
  const contents = Deno.readFileSync(filePath);

  return decoder.decode(contents);
}
