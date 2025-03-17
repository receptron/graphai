import { AgentFunctionInfo } from "@graphai/agent_utils";
import * as fs from "fs";
import * as path from "path";

interface MistralOcrAgentInputs {
  pdfPath: string;
  apiKey?: string;
  outputFormat?: string;
  saveImages?: boolean;
  imagesDir?: string;
  markdownDir?: string;
}

interface MistralOcrAgentOutputs {
  text_content: string;
  pages: Array<{
    index: number;
    text: string;
    images?: Array<{
      id: string;
      path?: string;
    }>;
  }>;
  saved_images?: Record<string, string[]>;
  markdown_files?: string[];
  raw_response?: any;
}

interface MistralOcrAgentParams {
  apiKey?: string;
  outputFormat?: string;
  saveImages?: boolean;
  imagesDir?: string;
  markdownDir?: string;
  debug?: boolean;
}

const mistralOcrAgent: AgentFunctionInfo<
  MistralOcrAgentInputs,
  MistralOcrAgentOutputs,
  MistralOcrAgentParams
> = {
  name: "mistralOcrAgent",
  description: "Agent for processing PDF documents using Mistral OCR API",
  inputs: {
    pdfPath: {
      type: "string",
      description: "Path to the PDF file to process",
    },
    apiKey: {
      type: "string",
      description: "API key for Mistral OCR authentication (optional if provided in params)",
      optional: true,
    },
    outputFormat: {
      type: "string",
      description: "Output format: 'text', 'full', or 'raw'",
      optional: true,
    },
    saveImages: {
      type: "boolean",
      description: "Whether to save extracted images",
      optional: true,
    },
    imagesDir: {
      type: "string",
      description: "Directory to save extracted images",
      optional: true,
    },
    markdownDir: {
      type: "string",
      description: "Directory to save markdown files",
      optional: true,
    },
  },
  params: {
    apiKey: {
      type: "string",
      description: "API key for Mistral OCR authentication",
      optional: true,
    },
    outputFormat: {
      type: "string",
      description: "Output format: 'text', 'full', or 'raw'",
      optional: true,
      default: "full",
    },
    saveImages: {
      type: "boolean",
      description: "Whether to save extracted images",
      optional: true,
      default: false,
    },
    imagesDir: {
      type: "string",
      description: "Directory to save extracted images",
      optional: true,
      default: "output/images",
    },
    markdownDir: {
      type: "string",
      description: "Directory to save markdown files",
      optional: true,
      default: "output/markdown",
    },
    debug: {
      type: "boolean",
      description: "Enable debug mode to log API requests and responses",
      optional: true,
      default: false,
    },
  },
  outputs: {
    text_content: {
      type: "string",
      description: "Extracted text content from the PDF",
    },
    pages: {
      type: "array",
      description: "Array of page objects containing text and image information",
    },
    saved_images: {
      type: "object",
      description: "Record of saved image paths by page",
      optional: true,
    },
    markdown_files: {
      type: "array",
      description: "List of generated markdown file paths",
      optional: true,
    },
    raw_response: {
      type: "object",
      description: "Raw response from the Mistral OCR API",
      optional: true,
    },
  },
  async execute({ inputs, params, debug }) {
    try {
      // Get API key from inputs or params or environment variable
      const apiKey = inputs.apiKey || params.apiKey || process.env.MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error("API key is required. Provide it in inputs, params, or as MISTRAL_API_KEY environment variable.");
      }

      // Get other parameters with fallbacks
      const outputFormat = inputs.outputFormat || params.outputFormat || "full";
      const saveImages = inputs.saveImages !== undefined ? inputs.saveImages : params.saveImages;
      const imagesDir = inputs.imagesDir || params.imagesDir || "output/images";
      const markdownDir = inputs.markdownDir || params.markdownDir || "output/markdown";
      const pdfPath = inputs.pdfPath;

      if (!pdfPath) {
        throw new Error("PDF path is required");
      }

      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at path: ${pdfPath}`);
      }

      // Log debug information if debug mode is enabled
      if (params.debug) {
        debug.log("Mistral OCR Request:", {
          pdfPath,
          outputFormat,
          saveImages,
          imagesDir,
          markdownDir,
        });
      }

      // Read PDF file
      const fileContent = fs.readFileSync(pdfPath);
      const fileName = path.basename(pdfPath);

      // Create FormData for file upload
      const formData = new FormData();
      const blob = new Blob([fileContent], { type: "application/pdf" });
      formData.append("file", blob, fileName);
      formData.append("purpose", "ocr");

      // Upload file to Mistral API
      const uploadResponse = await fetch("https://api.mistral.ai/v1/files", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const fileId = uploadData.id;

      // Get signed URL for the uploaded file
      const signedUrlResponse = await fetch(`https://api.mistral.ai/v1/files/${fileId}/signed_url`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        throw new Error(`Failed to get signed URL: ${signedUrlResponse.status} ${signedUrlResponse.statusText} - ${errorText}`);
      }

      const signedUrlData = await signedUrlResponse.json();
      const signedUrl = signedUrlData.url;

      // Process OCR
      const ocrResponse = await fetch("https://api.mistral.ai/v1/ocr/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-ocr-latest",
          document: {
            type: "document_url",
            document_url: signedUrl,
          },
          include_image_base64: saveImages,
        }),
      });

      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        throw new Error(`OCR processing failed: ${ocrResponse.status} ${ocrResponse.statusText} - ${errorText}`);
      }

      const ocrResult = await ocrResponse.json();

      // Log debug information if debug mode is enabled
      if (params.debug) {
        debug.log("Mistral OCR Response:", {
          status: ocrResponse.status,
          pages: ocrResult.pages.length,
        });
      }

      // Extract text content
      let textContent = "";
      for (const page of ocrResult.pages) {
        textContent += page.text + "\n\n";
      }

      // Process and save images if requested
      let savedImages = {};
      if (saveImages) {
        // Create images directory if it doesn't exist
        if (!fs.existsSync(imagesDir)) {
          fs.mkdirSync(imagesDir, { recursive: true });
        }

        savedImages = extractAndSaveImages(ocrResult, imagesDir);
      }

      // Generate markdown files if requested
      let markdownFiles = [];
      if (markdownDir) {
        // Create markdown directory if it doesn't exist
        if (!fs.existsSync(markdownDir)) {
          fs.mkdirSync(markdownDir, { recursive: true });
        }

        markdownFiles = generateMarkdownFiles(ocrResult, markdownDir, savedImages);
      }

      // Prepare output based on requested format
      let output: MistralOcrAgentOutputs = {
        text_content: textContent,
        pages: ocrResult.pages.map(page => ({
          index: page.index,
          text: page.text,
          images: page.images?.map(img => ({
            id: img.id,
            path: savedImages[page.index]?.[img.id],
          })),
        })),
      };

      if (saveImages) {
        output.saved_images = savedImages;
      }

      if (markdownDir) {
        output.markdown_files = markdownFiles;
      }

      if (outputFormat === "raw") {
        output.raw_response = ocrResult;
      }

      return output;
    } catch (error) {
      debug.error("Mistral OCR Error:", error);
      throw error;
    }
  },
  samples: [
    {
      name: "Basic OCR processing",
      inputs: {
        pdfPath: "/path/to/document.pdf",
      },
      params: {
        apiKey: "YOUR_API_KEY",
      },
    },
    {
      name: "OCR with image extraction",
      inputs: {
        pdfPath: "/path/to/document.pdf",
      },
      params: {
        apiKey: "YOUR_API_KEY",
        outputFormat: "full",
        saveImages: true,
        imagesDir: "output/images",
        markdownDir: "output/markdown",
      },
    },
  ],
};

// Helper function to extract and save images
function extractAndSaveImages(ocrResult, imagesDir) {
  const savedImages = {};

  for (const page of ocrResult.pages) {
    const pageIndex = page.index;
    const pageImages = page.images || [];
    savedImages[pageIndex] = {};

    for (const img of pageImages) {
      const imgId = img.id;
      const imgBase64 = img.image_base64;

      if (!imgBase64 || imgBase64 === "..." || imgBase64.endsWith("...")) {
        continue;
      }

      try {
        let base64Data;
        if (imgBase64.startsWith("data:")) {
          base64Data = imgBase64.split(",")[1];
        } else {
          base64Data = imgBase64;
        }

        const imgBuffer = Buffer.from(base64Data, "base64");
        const imgFileName = `page${pageIndex}_img${imgId}.png`;
        const imgPath = path.join(imagesDir, imgFileName);

        fs.writeFileSync(imgPath, imgBuffer);
        savedImages[pageIndex][imgId] = imgPath;
      } catch (error) {
        console.error(`Error saving image ${imgId} from page ${pageIndex}:`, error);
      }
    }
  }

  return savedImages;
}

// Helper function to generate markdown files
function generateMarkdownFiles(ocrResult, markdownDir, savedImages) {
  const markdownFiles = [];

  for (const page of ocrResult.pages) {
    const pageIndex = page.index;
    const pageText = page.text;
    const pageImages = page.images || [];

    let markdown = `# Page ${pageIndex + 1}\n\n`;
    markdown += pageText + "\n\n";

    if (pageImages.length > 0 && savedImages[pageIndex]) {
      markdown += "## Images\n\n";
      for (const img of pageImages) {
        const imgId = img.id;
        const imgPath = savedImages[pageIndex][imgId];
        if (imgPath) {
          const relPath = path.relative(markdownDir, imgPath);
          markdown += `![Image ${imgId}](${relPath.replace(/\\/g, "/")})\n\n`;
        }
      }
    }

    const mdFileName = `page${pageIndex + 1}.md`;
    const mdPath = path.join(markdownDir, mdFileName);
    fs.writeFileSync(mdPath, markdown);
    markdownFiles.push(mdPath);
  }

  return markdownFiles;
}

export default mistralOcrAgent;
