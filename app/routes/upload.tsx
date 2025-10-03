import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ID } from "appwrite";
import {
  storage,
  databases,
  ensureAppwriteSession,
  account,
} from "../lib/appwrite";
import { convertPdfToImage, extractPdfText } from "../lib/Pdf2img";
import { generateFeedbackWithGemini } from "../lib/gemini";
import FileUploader from "../components/FileUploader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID!;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID!;

export function meta() {
  return [
    { title: "Upload Resume - ATS" },
    { name: "description", content: "Upload and analyze your resume" },
  ];
}

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState(
    "Upload your resume to get started"
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      // Make sure we have an Appwrite session (anonymous if needed)
      const user = await ensureAppwriteSession();
      const userId = user?.$id ?? "anonymous";
      setIsProcessing(true);
      setStatusText("Converting PDF to image...");

      // Convert PDF to image
      const imageResult = await convertPdfToImage(file);
      if (!imageResult.file || imageResult.error) {
        throw new Error(imageResult.error || "PDF conversion failed");
      }

      setStatusText("Extracting text from PDF...");
      // Extract text from PDF (throws with detailed message on failure)
      const resumeText = await extractPdfText(file);
      console.log("Extracted resume text length:", resumeText.length);

      setStatusText("Uploading image to storage...");
      // Upload image to Appwrite Storage
      const imageFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        imageResult.file
      );

      setStatusText("Analyzing resume with AI...");
      // Get feedback from Gemini
      const feedback = await generateFeedbackWithGemini({
        jobTitle: jobTitle || "General Position",
        jobDescription: jobDescription || "General job description",
        resumeText,
      });

      setStatusText("Saving analysis...");
      // Save to database
      const document = await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          user_id: userId,
          company_name: companyName || "",
          job_title: jobTitle || "",
          // Appwrite schema marks job_description as required; use fallback if empty
          job_description: (jobDescription && jobDescription.trim()) || "N/A",
          image_file_id: imageFile.$id,
          feedback_json: JSON.stringify(feedback),
        }
      );

      setStatusText("Analysis complete!");
      // Navigate to results page (with hard redirect fallback)
      const target = `/resume/${document.$id}`;
      console.log("Navigating to:", target);
      setTimeout(() => {
        try {
          navigate(target);
          // In case SPA navigation is blocked or fails, force a hard redirect shortly after
          setTimeout(() => {
            if (
              typeof window !== "undefined" &&
              window.location.pathname !== target
            ) {
              console.warn(
                "SPA navigation did not change route, forcing hard redirect to:",
                target
              );
              window.location.assign(target);
            }
          }, 200);
        } catch (navErr) {
          console.warn(
            "navigate() threw, forcing hard redirect to:",
            target,
            navErr
          );
          if (typeof window !== "undefined") {
            window.location.assign(target);
          }
        }
      }, 800);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMessage(err.message || "An error occurred during analysis");
      setShowErrorModal(true);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Smart Feedback from Your Dream Job
          </h1>
          {isProcessing ? (
            <>
              <h2 className="text-xl text-gray-700 mb-6">{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Scanning"
                className="w-full max-w-md mx-auto rounded-2xl"
              />
            </>
          ) : (
            <h2 className="text-xl text-gray-600">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}
        </div>

        {!isProcessing && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-100"
          >
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name (Optional)</Label>
              <Input
                id="company-name"
                name="company-name"
                placeholder="e.g., Google, Microsoft"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-title">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="job-title"
                name="job-title"
                placeholder="e.g., Senior Frontend Developer"
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">
                Job Description (Optional)
              </Label>
              <Textarea
                id="job-description"
                name="job-description"
                rows={5}
                placeholder="Paste the job description here for more accurate analysis..."
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploader">
                Upload Resume <span className="text-red-500">*</span>
              </Label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <Button
              type="submit"
              disabled={!file || isProcessing}
              className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Analyze My Resume
            </Button>
          </form>
        )}
      </section>

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-start gap-3">
              <img
                src="/icons/warning.svg"
                alt="warning"
                className="w-6 h-6 mt-1"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-gray-700 mb-4">{errorMessage}</p>
                <p className="text-sm text-gray-600">
                  Please try again. If the problem persists, check your API key
                  or try with a different PDF.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button
                onClick={() => setShowErrorModal(false)}
                variant="outline"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  navigate("/");
                }}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
