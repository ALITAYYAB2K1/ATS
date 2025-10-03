import { Link } from "react-router";
import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import {
  Upload,
  CheckCircle,
  BarChart3,
  Target,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
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
    { title: "ATS - AI-Powered Resume Analyzer" },
    {
      name: "description",
      content:
        "Transform your resume with AI-powered analysis and optimization",
    },
  ];
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await account.get();
        if (mounted) {
          const isAnon = me?.labels?.includes("anonymous");
          setAuthed(!!me && !isAnon);
        }
      } catch {
        if (mounted) setAuthed(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Grammar & Structure Analysis",
      description:
        "Get detailed feedback on grammar, spelling, and overall resume structure to make a professional impression.",
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "ATS Optimization",
      description:
        "Ensure your resume passes Applicant Tracking Systems with keyword optimization and formatting suggestions.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Industry-Specific Insights",
      description:
        "Receive tailored recommendations based on your target industry and role requirements.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Upload Your Resume",
      description: "Simply upload your resume in PDF or DOCX format",
    },
    {
      step: "2",
      title: "AI Analysis",
      description:
        "Our AI analyzes your resume for ATS compatibility, grammar, and structure",
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive detailed feedback and actionable recommendations",
    },
  ];

  const stats = [
    { number: "10K+", label: "Resumes Analyzed" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "24/7", label: "AI Available" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 overflow-hidden">
        {/* Enhanced layered glow backdrop */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.18),transparent_70%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.15),transparent_70%)]" />
          <div className="absolute -top-56 -left-32 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-blue-500/25 to-transparent blur-[160px]" />
          <div className="absolute -bottom-72 -right-20 h-[46rem] w-[46rem] rounded-full bg-gradient-to-tr from-fuchsia-500/25 to-transparent blur-[170px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-500/25 to-transparent blur-[170px]" />
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.35] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.22)_0px,rgba(255,255,255,0.22)_2px,transparent_2px,transparent_6px)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                AI-Powered Resume Analysis
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Transform Your Resume with
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get instant, AI-powered feedback on your resume. Optimize for ATS
              systems, improve grammar and structure, and increase your chances
              of landing interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="text-white w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Analyze My Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!authed && (
                <Link to="/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 border-2"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ATS Result Showcase Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.55] bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.10),transparent_65%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.10),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sample ATS Insights
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A quick preview of the kind of structured analysis you’ll receive.
              Each card represents a processed resume with its overall
              compatibility score and key highlights.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {dummyShowcase.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
                <div className="relative p-5 flex-1 flex flex-col">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border bg-gray-50 shadow-inner mb-5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                    {item.summary}
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <svg
                          viewBox="0 0 42 42"
                          className="h-14 w-14 -rotate-90"
                        >
                          <circle
                            cx="21"
                            cy="21"
                            r="18"
                            stroke="#e5e7eb"
                            strokeWidth="5"
                            fill="none"
                          />
                          <circle
                            cx="21"
                            cy="21"
                            r="18"
                            stroke="url(#gradScore)"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 18}
                            strokeDashoffset={
                              (1 - item.score / 100) * (2 * Math.PI * 18)
                            }
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id="gradScore"
                              x1="1"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#9333ea" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-800">
                            {item.score}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs leading-relaxed text-gray-600 max-w-[110px]">
                        <span className="font-medium text-gray-800">
                          {item.score >= 80
                            ? "Strong"
                            : item.score >= 65
                              ? "Moderate"
                              : "Needs Work"}
                        </span>
                        <br />
                        Overall Fit
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-[11px] font-medium text-gray-700 border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative px-5 pb-5 pt-2">
                  <div className="flex gap-2 flex-wrap text-[11px] text-gray-600">
                    {item.highlights.map((h) => (
                      <div
                        key={h}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 shadow-sm hover:bg-white/70 transition text-xs"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Powerful Features
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ATS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our advanced AI technology provides comprehensive resume analysis
              to help you stand out in today's competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-center text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get professional resume feedback in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg relative z-10">
                      {step.step}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-50"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their resumes with
            our AI-powered analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started Now
                <Upload className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!authed && (
              <Link to="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Trust / Brands Section */}
      <section className="py-20 bg-white border-t relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[radial-gradient(circle_at_15%_30%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_85%_70%,rgba(168,85,247,0.15),transparent_65%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm tracking-wide font-medium text-gray-500 mb-10 uppercase">
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
            {/* Google */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-[2rem] leading-none font-black tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#DB4437]">o</span>
                <span className="text-[#F4B400]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#0F9D58]">l</span>
                <span className="text-[#DB4437]">e</span>
              </span>
            </div>
            {/* Microsoft */}
            <div className="flex items-center gap-3 select-none">
              <div className="grid grid-cols-2 gap-1.5">
                <span className="h-3.5 w-3.5 rounded-sm bg-[#F25022]" />
                <span className="h-3.5 w-3.5 rounded-sm bg-[#7FBA00]" />
                <span className="h-3.5 w-3.5 rounded-sm bg-[#FFB900]" />
                <span className="h-3.5 w-3.5 rounded-sm bg-[#00A4EF]" />
              </div>
              <span className="text-[1.55rem] font-semibold text-neutral-700 tracking-tight">
                Microsoft
              </span>
            </div>
            {/* Amazon */}
            <div className="flex items-end gap-1 select-none">
              <span className="text-[1.9rem] font-black tracking-tight text-neutral-800 relative">
                amazon
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-[8px]">
                  <svg
                    viewBox="0 0 256 48"
                    className="w-full h-full"
                    aria-hidden="true"
                  >
                    <path
                      fill="#FF9900"
                      d="M4 24c60 36 132 36 248 0-4 10-10 18-18 24-74 26-142 18-212-10-8-4-14-8-18-14z"
                    />
                  </svg>
                </span>
              </span>
            </div>
            {/* Meta */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-[1.9rem] font-black tracking-tight bg-gradient-to-r from-[#0866FF] via-[#0A6CFF] to-[#6017FF] bg-clip-text text-transparent">
                Meta
              </span>
            </div>
            {/* Apple */}
            <div className="flex items-center select-none">
              <span className="text-[2rem] font-semibold text-neutral-900">
                
              </span>
              <span className="text-[1.55rem] ml-1 font-medium tracking-tight text-neutral-700">
                Apple
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Showcase dummy data (local public images)
const dummyShowcase = [
  {
    id: "r1",
    title: "Product Manager Resume",
    image: "/images/resume_01.png",
    score: 82,
    summary:
      "Well-structured with quantified product metrics, stakeholder collaboration, and roadmap ownership. Could improve keyword density around experimentation.",
    tags: ["Keywords", "Structure", "Metrics"],
    highlights: [
      "Strong action verbs",
      "Clear impact metrics",
      "ATS-friendly layout",
      "Good section hierarchy",
    ],
  },
  {
    id: "r2",
    title: "Full-Stack Engineer Resume",
    image: "/images/resume_02.png",
    score: 74,
    summary:
      "Solid technical stack coverage and accomplishments; missing some cloud optimization details and security considerations.",
    tags: ["Tech", "Impact", "Readability"],
    highlights: [
      "Stack diversity",
      "Quantified performance gains",
      "Readable bullet density",
      "Good seniority signals",
    ],
  },
  {
    id: "r3",
    title: "Data Analyst Resume",
    image: "/images/resume_03.png",
    score: 88,
    summary:
      "Exceptional use of quantified insights, tooling variety, and outcome-driven storytelling. Minor opportunity to refine summary for focus.",
    tags: ["Insights", "Clarity", "Optimization"],
    highlights: [
      "High metric coverage",
      "Clear problem/solution framing",
      "Tool diversity",
      "Business impact focus",
    ],
  },
];
