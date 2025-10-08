import { useEffect, useState } from "react";
import { Link } from "react-router";
import { databases, ensureAppwriteSession, storage } from "../lib/appwrite";
import ResumeHistoryCard from "../components/ResumeHistoryCard";
import { Button } from "../components/ui/button";
import type { Feedback } from "../../types";
import { Query } from "appwrite";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID!;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID!;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT!;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID!;

export function meta() {
  return [
    { title: "History - Analyzed Resumes" },
    { name: "description", content: "View your previously analyzed resumes" },
  ];
}

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await ensureAppwriteSession();
        const userId = me?.$id ?? "anonymous";
        // Fetch current user's resumes (fallback to all if rules allow)
        let res;
        try {
          res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.equal("user_id", userId),
            Query.orderDesc("$createdAt"),
          ]);
        } catch (e) {
          // If rules don't index user_id or allow public listing, try without filter
          res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.orderDesc("$createdAt"),
          ]);
        }
        setItems(res.documents || []);
        setLoading(false);
      } catch (err: any) {
        console.error("History load error:", err);
        setError(err.message || "Failed to load history");
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/images/resume-scan-2.gif"
            alt="Loading"
            className="w-48 h-48 mx-auto mb-4"
          />
          <h2 className="text-xl text-gray-700">Loading your history...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <img
            src="/icons/warning.svg"
            alt="error"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load history
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/upload">
            <Button>Upload a Resume</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <img
            src="/images/pdf.png"
            alt="empty"
            className="w-20 h-20 mx-auto mb-4 opacity-80"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No resumes yet
          </h2>
          <p className="text-gray-600 mb-6">
            Analyze your first resume to see it here.
          </p>
          <Link to="/upload">
            <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Analyze a Resume
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Map documents to card props
  const cards = items.map((doc) => {
    let feedback: Feedback | null = null;
    try {
      feedback = doc.feedback_json ? JSON.parse(doc.feedback_json) : null;
    } catch {}
    const overall = feedback?.overallScore ?? 0;
    const imageUrl = doc.image_file_id
      ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${doc.image_file_id}/view?project=${PROJECT_ID}`
      : "";
    return {
      id: doc.$id,
      imageFileId: doc.image_file_id,
      companyName: doc.company_name || "",
      jobTitle: doc.job_title || "",
      imageUrl,
      overallScore: overall,
      createdAt: doc.$createdAt,
    };
  });

  const handleDelete = async (id: string, imageFileId?: string) => {
    if (deletingId) return; // prevent concurrent deletes
    const confirmed = window.confirm(
      "Delete this resume and its stored image? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await databases.deleteDocument(DB_ID, COLLECTION_ID, id);
      if (imageFileId) {
        try {
          await storage.deleteFile(BUCKET_ID, imageFileId);
        } catch (e) {
          console.warn("Image delete failed", e);
        }
      }
      setItems((prev) => prev.filter((d) => d.$id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Resume History
            </h1>
            <p className="text-gray-600 mt-2">
              Click any card to view its full analysis.
            </p>
          </div>
          <Link to="/upload">
            <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Analyze New
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <ResumeHistoryCard
              key={c.id}
              {...(c as any)}
              onDelete={handleDelete}
              deleting={deletingId === c.id}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
