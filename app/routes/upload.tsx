import { Link } from "react-router";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function meta() {
  return [
    { title: "Upload Resume - ATS" },
    {
      name: "description",
      content: "Upload your resume for AI-powered analysis",
    },
  ];
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Upload Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">Upload Your Resume</CardTitle>
            <CardDescription className="text-lg">
              Get instant AI-powered feedback and optimization suggestions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button>Browse Files</Button>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: PDF, DOCX (Max size: 10MB)
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4">
                <div className="text-green-600 font-semibold mb-1">
                  ✓ ATS Optimized
                </div>
                <p className="text-sm text-gray-600">
                  Beat applicant tracking systems
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-blue-600 font-semibold mb-1">
                  ✓ Instant Feedback
                </div>
                <p className="text-sm text-gray-600">Results in seconds</p>
              </div>
              <div className="text-center p-4">
                <div className="text-purple-600 font-semibold mb-1">
                  ✓ Secure & Private
                </div>
                <p className="text-sm text-gray-600">Your data is protected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
