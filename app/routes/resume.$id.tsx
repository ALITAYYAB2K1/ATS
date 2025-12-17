import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { databases, storage, ensureAppwriteSession } from "../lib/appwrite";
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";
import { Button } from "../components/ui/button";
import type { Feedback } from "../../types";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID!;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID!;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT!;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID!;

export function meta() {
  return [
    { title: "Resume Analysis - ATS" },
    { name: "description", content: "View your resume analysis results" },
  ];
}

export default function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchResumeData = async () => {
      if (!id) {
        setError("No resume ID provided");
        setLoading(false);
        return;
      }

      try {
        // Ensure we have a session (anonymous or user) to respect Appwrite rules
        await ensureAppwriteSession();
        console.log("[resume] session ensured, fetching document", id);
        // Fetch document from Appwrite
        const doc = await databases.getDocument(DB_ID, COLLECTION_ID, id);
        setResumeData(doc);

        // Parse feedback JSON
        if (doc.feedback_json) {
          const parsedFeedback = JSON.parse(doc.feedback_json);
          setFeedback(parsedFeedback);
        }

        // Get image URL
        if (doc.image_file_id) {
          const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${doc.image_file_id}/view?project=${PROJECT_ID}`;
          setImageUrl(url);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setError(err.message || "Failed to load resume data");
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/images/resume-scan-2.gif"
            alt="Loading"
            className="w-64 h-64 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-700">
            Loading your analysis...
          </h2>
        </div>
      </main>
    );
  }

  if (error || !feedback) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <img
            src="/icons/warning.svg"
            alt="error"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Could not load resume analysis"}
          </p>
          <Button onClick={() => navigate("/upload")}>
            Upload Another Resume
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resume Analysis Results
          </h1>
          {resumeData?.job_title && (
            <p className="text-gray-600 mt-2 text-lg">
              {resumeData.company_name && `${resumeData.company_name} - `}
              {resumeData.job_title}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Resume Image (Sticky) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {imageUrl ? (
                <img src={imageUrl} alt="Resume" className="w-full h-auto" />
              ) : (
                <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">Resume preview not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {/* Overall Summary */}
            <Summary feedback={feedback} />

            {/* ATS Compatibility */}
            <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips} />

            {/* Detailed Feedback */}
            <Details feedback={feedback} />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/upload")}
                className="text-white flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Analyze Another Resume
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1"
              >
                Print Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
