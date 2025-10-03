import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

export default function ATS({ score, suggestions }: ATSProps) {
  const getATSRating = (score: number) => {
    if (score >= 80)
      return {
        label: "Excellent",
        color: "text-green-600",
        icon: "/icons/ats-good.svg",
      };
    if (score >= 60)
      return {
        label: "Good",
        color: "text-yellow-600",
        icon: "/icons/ats-warning.svg",
      };
    return {
      label: "Needs Improvement",
      color: "text-red-600",
      icon: "/icons/ats-bad.svg",
    };
  };

  const rating = getATSRating(score);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <img src={rating.icon} alt="ATS" className="w-8 h-8" />
          ATS Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">ATS Score</span>
            <span className={`text-2xl font-bold ${rating.color}`}>
              {score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                score >= 80
                  ? "bg-green-600"
                  : score >= 60
                    ? "bg-yellow-600"
                    : "bg-red-600"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className={`mt-2 font-medium ${rating.color}`}>{rating.label}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-lg mb-3">Suggestions:</h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                suggestion.type === "good" ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              {suggestion.type === "good" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-gray-800">{suggestion.tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
