import { Link } from "react-router";

export default function ResumeHistoryCard({
  id,
  companyName,
  jobTitle,
  imageUrl,
  overallScore,
  createdAt,
}: {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imageUrl?: string;
  overallScore?: number;
  createdAt?: string;
}) {
  const score = Math.max(0, Math.min(100, overallScore ?? 0));
  const when = createdAt ? new Date(createdAt).toLocaleString() : "";
  return (
    <Link
      to={`/resume/${id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Resume"
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No preview
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {companyName || "Resume"}
            </h3>
            {jobTitle && (
              <p className="text-sm text-gray-600 truncate">{jobTitle}</p>
            )}
            {when && <p className="mt-1 text-xs text-gray-500">{when}</p>}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
              <span
                className={`text-sm font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}
              >
                {score}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
