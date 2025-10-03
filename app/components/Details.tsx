import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { Feedback } from "../../types";

interface DetailsProps {
  feedback: Feedback;
}

export default function Details({ feedback }: DetailsProps) {
  const renderSection = (
    title: string,
    score: number,
    tips: { type: "good" | "improve"; tip: string; explanation: string }[]
  ) => (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <span
            className={`text-2xl font-bold ${
              score >= 80
                ? "text-green-600"
                : score >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {score}/100
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                tip.type === "good"
                  ? "bg-green-50 border-green-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <div className="flex items-start gap-3">
                {tip.type === "good" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {tip.tip}
                  </h5>
                  <p className="text-sm text-gray-700">{tip.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="tone">Tone</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          {renderSection(
            "Content Quality",
            feedback.content.score,
            feedback.content.tips
          )}
        </TabsContent>
        <TabsContent value="structure" className="mt-6">
          {renderSection(
            "Document Structure",
            feedback.structure.score,
            feedback.structure.tips
          )}
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          {renderSection(
            "Skills & Keywords",
            feedback.skills.score,
            feedback.skills.tips
          )}
        </TabsContent>
        <TabsContent value="tone" className="mt-6">
          {renderSection(
            "Tone & Style",
            feedback.toneAndStyle.score,
            feedback.toneAndStyle.tips
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
