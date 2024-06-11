export async function readPDF(data: Buffer): Promise<string[]> {
    const parser = await import("pdf2json").then(
      ({ default: Pdfparser }) => new Pdfparser(null, true),
    );
    const text = await new Promise<string>((resolve, reject) => {
      parser.on("pdfParser_dataError", (error) => {
        reject(error);
      });
      parser.on("pdfParser_dataReady", () => {
        resolve((parser as any).getRawTextContent() as string);
      });
      parser.parseBuffer(data);
    });
    return text.split(/----------------Page \(\d+\) Break----------------/g);
}

export function extractFinalResponse(inputText: string): string {
  const pattern = /\s*Answer:\<\/s\>\n\<\|assistant\|\>\n(.*?)$/s;
  const match = inputText.match(pattern);

  if (!match) {
    throw new Error(
      `Could not extract final answer from input text`,
    );
  }
  const answer = match[1].trim();
  return answer
}