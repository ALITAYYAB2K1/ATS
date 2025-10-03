import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Feedback } from "../../types";

interface SummaryProps {
  feedback: Feedback;
}

export default function Summary({ feedback }: SummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Overall Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreBg(
              feedback.overallScore
            )}`}
          >
            <span
              className={`text-4xl font-bold ${getScoreColor(
                feedback.overallScore
              )}`}
            >
              {feedback.overallScore}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ATS Score</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(feedback.ATS.score)}`}
            >
              {feedback.ATS.score}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Content</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(feedback.content.score)}`}
            >
              {feedback.content.score}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Structure</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(feedback.structure.score)}`}
            >
              {feedback.structure.score}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Skills</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(feedback.skills.score)}`}
            >
              {feedback.skills.score}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tone & Style</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(feedback.toneAndStyle.score)}`}
            >
              {feedback.toneAndStyle.score}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
