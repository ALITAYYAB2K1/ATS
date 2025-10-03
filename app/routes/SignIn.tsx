import { useState } from "react";
import { account } from "~/lib/appwrite";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Sign In - ATS" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export default function SignIn() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Magic URL (Email Verification) Sign In
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/verify`;
      await account.createMagicURLToken("unique()" as any, email, redirectUrl);

      setMessage({
        type: "success",
        text: "Magic link sent! Check your email to complete sign in.",
      });
      setEmail("");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send magic link. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await account.createEmailPasswordSession(email, password);

      // Check if email is verified
      const user = await account.get();
      if (!user.emailVerification) {
        // Send verification email
        await account.createVerification(
          `${window.location.origin}/auth/verify`
        );
        setMessage({
          type: "success",
          text: "Please verify your email. A verification link has been sent to your inbox.",
        });
        // Optionally log them out until verified
        // await account.deleteSession('current');
      } else {
        setMessage({
          type: "success",
          text: "Signed in successfully!",
        });
        // Redirect to dashboard or home
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.message || "Failed to sign in. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit =
    authMode === "magic" ? handleMagicLinkSignIn : handlePasswordSignIn;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATS
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          {/* Auth Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setAuthMode("magic");
                setMessage(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                authMode === "magic"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("password");
                setMessage(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                authMode === "password"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Password
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Password Input (only shown in password mode) */}
            {authMode === "password" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Description based on auth mode */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {authMode === "magic" ? (
                  <>
                    <span className="font-semibold">
                      🔐 Passwordless Sign In:
                    </span>{" "}
                    We'll send a magic link to your email. Click it to sign in
                    securely without a password.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      ✉️ Email Verification Required:
                    </span>{" "}
                    Your email must be verified to access your account. We'll
                    send a verification link if needed.
                  </>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : authMode === "magic" ? (
                "Send Magic Link"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
