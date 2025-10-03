// src/pages/resume.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { databases, storage } from "../lib/appwrite";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID!;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID!;

export default function Resume() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    let revoked = false;
    (async () => {
      try {
        const d = await databases.getDocument(DB_ID, COLLECTION_ID, id);
        setDoc(d);

        // Get file view (binary) and convert to object URL
        const fileBlob = await storage.getFileView(BUCKET_ID, d.image_file_id);
        // Some SDKs return a Blob directly; some return binary data.
        // If fileBlob is already a Blob or ArrayBuffer, handle appropriately.
        let blob: Blob;
        if (fileBlob instanceof Blob) blob = fileBlob;
        else if (fileBlob instanceof ArrayBuffer) blob = new Blob([fileBlob]);
        else blob = new Blob([fileBlob]);

        const url = URL.createObjectURL(blob);
        if (!revoked) setImageUrl(url);

        if (d.feedback_json) {
          try {
            setFeedback(JSON.parse(d.feedback_json));
          } catch {
            setFeedback({ raw: d.feedback_json });
          }
        }
      } catch (err) {
        console.error("Load resume error", err);
      }
    })();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      revoked = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <nav className="mb-4">
        <Link to="/" className="text-blue-600">
          ← Back
        </Link>
      </nav>

      <h1 className="text-2xl font-bold mb-4">Resume Review</h1>

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Resume preview"
            className="rounded shadow max-w-full"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold">Job</h2>
        <p>
          <strong>Title:</strong> {doc.job_title}
        </p>
        <p className="mt-2">
          <strong>Job description:</strong>
          <br />
          {doc.job_description}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">AI Feedback</h2>
        {feedback ? (
          <pre className="bg-black text-green-300 p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-600">Analysis not available yet.</p>
        )}
      </div>
    </main>
  );
}
