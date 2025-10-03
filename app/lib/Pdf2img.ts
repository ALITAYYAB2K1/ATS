export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

type PdfJsLib = {
  getDocument: (src: any) => any;
  GlobalWorkerOptions?: { workerSrc?: string };
  __hasWorker?: boolean;
};

async function loadPdfJs(): Promise<PdfJsLib> {
  if (pdfjsLib) return pdfjsLib as PdfJsLib;
  if (loadPromise) return loadPromise as Promise<PdfJsLib>;

  isLoading = true;
  loadPromise = (async () => {
    // Always prefer the locally installed worker that matches the API version
    const mod: any = await import("pdfjs-dist");
    let workerUrl: string | undefined = undefined;
    try {
      const workerImport: any = await import(
        /* @vite-ignore */ "pdfjs-dist/build/pdf.worker.mjs?url"
      );
      workerUrl = workerImport?.default as string | undefined;
    } catch (e) {
      // Fallback: no worker URL available (will run in no-worker mode)
      console.warn(
        "pdfjs-dist worker URL import failed; falling back to no-worker mode.",
        e
      );
    }

    const GlobalWorkerOptions =
      mod.GlobalWorkerOptions ?? mod.default?.GlobalWorkerOptions;
    const getDocument = mod.getDocument ?? mod.default?.getDocument;

    if (GlobalWorkerOptions && workerUrl) {
      try {
        GlobalWorkerOptions.workerSrc = workerUrl;
      } catch (e) {
        console.warn(
          "Failed to set PDF.js workerSrc; continuing without worker.",
          e
        );
      }
    }

    const lib: PdfJsLib = {
      getDocument,
      GlobalWorkerOptions,
      __hasWorker: Boolean(workerUrl),
    };
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  })();

  return loadPromise as Promise<PdfJsLib>;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log("Starting PDF to image conversion...");
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    // Deep-copy into a new buffer to avoid "detached ArrayBuffer" issues
    const srcView = new Uint8Array(arrayBuffer);
    const data = new Uint8Array(srcView); // copies bytes into a fresh buffer
    const pdf = await lib.getDocument({ data, disableWorker: !lib.__hasWorker })
      .promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to get 2D context for canvas",
      };
    }

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            console.log("PDF converted to image successfully");
            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob from canvas",
            });
          }
        },
        "image/png",
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    console.error("PDF conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function extractPdfText(file: File): Promise<string> {
  try {
    console.log("Starting PDF text extraction...");
    const lib = await loadPdfJs();
    console.log("PDF.js loaded successfully");

    const arrayBuffer = await file.arrayBuffer();
    console.log("PDF file read, size:", arrayBuffer.byteLength, "bytes");

    const srcView = new Uint8Array(arrayBuffer);
    const data = new Uint8Array(srcView);

    console.log("Loading PDF document...");
    const pdf = await lib.getDocument({ data, disableWorker: !lib.__hasWorker })
      .promise;
    console.log("PDF loaded, total pages:", pdf.numPages);

    let fullText = "";
    const total = pdf.numPages;

    for (let i = 1; i <= total; i++) {
      console.log(`Extracting text from page ${i}/${total}...`);
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      const pageText = tc.items.map((it: any) => it.str ?? "").join(" ");
      fullText += pageText + "\n";
      console.log(`Page ${i} text length:`, pageText.length);
    }

    let trimmed = fullText.trim();
    console.log("Total extracted text length:", trimmed.length);

    // If we didn't get meaningful text, try OCR fallback (for scanned/image-only PDFs)
    if (trimmed.length < 20) {
      console.warn(
        "Low text content detected; attempting OCR fallback with Tesseract.js..."
      );
      try {
        const Tesseract: any =
          (await import("tesseract.js")).default ??
          (await import("tesseract.js"));
        let ocrText = "";
        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          const result = await Tesseract.recognize(dataUrl, "eng");
          const pageOcr = (result?.data?.text ?? "").trim();
          console.log(`OCR page ${i} length:`, pageOcr.length);
          ocrText += pageOcr + "\n";
        }
        trimmed = ocrText.trim();
        console.log("OCR total text length:", trimmed.length);
      } catch (ocrErr) {
        console.error("OCR fallback failed:", ocrErr);
      }
    }

    if (!trimmed) {
      throw new Error(
        "No text could be extracted from the PDF (including OCR)"
      );
    }

    return trimmed;
  } catch (err) {
    console.error("Failed to extract PDF text:", err);
    throw new Error(
      `PDF text extraction failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
