import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { account } from "~/lib/appwrite";

export default function AuthVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyMagicURL = async () => {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");
      const mode = searchParams.get("mode") || "verify";

      if (!userId || !secret) {
        setStatus("error");
        setMessage("Invalid verification link. Missing parameters.");
        return;
      }

      const consumePendingCredentials = () => {
        if (typeof window === "undefined") return null;
        try {
          const raw = window.sessionStorage.getItem("pending-verified-login");
          if (!raw) return null;
          window.sessionStorage.removeItem("pending-verified-login");
          const parsed = JSON.parse(raw);
          if (parsed?.email && parsed?.password) {
            return parsed as { email: string; password: string };
          }
        } catch {}
        return null;
      };

      const runVerify = async (allowRetry = true) => {
        try {
          if (mode === "magic") {
            // Ensure no active session blocks creating a new session
            try {
              await account.get();
              await account.deleteSession("current");
            } catch {}

            await account.updateMagicURLSession(userId, secret);
            setStatus("success");
            setMessage("Signed in via magic link! Redirecting...");

            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            await account.updateVerification(userId, secret);

            let autoLogin = false;
            const pendingCredentials = consumePendingCredentials();

            if (pendingCredentials) {
              try {
                await account.createEmailPasswordSession(
                  pendingCredentials.email,
                  pendingCredentials.password
                );
                autoLogin = true;
              } catch (err) {
                console.warn("auto login with stored credentials failed", err);
                autoLogin = false;
              }
            }

            setStatus("success");
            setMessage(
              autoLogin
                ? "Email verified and you're now signed in! Redirecting..."
                : "Your email has been verified! You can sign in with your credentials now."
            );

            setTimeout(
              () => {
                navigate(autoLogin ? "/" : "/signin");
              },
              autoLogin ? 2000 : 2500
            );
          }
        } catch (error: any) {
          const msg = String(error?.message || error);
          if (mode === "magic") {
            const sessionActiveErr =
              msg.toLowerCase().includes("session is active") ||
              msg.toLowerCase().includes("prohibited when a session is active");
            if (allowRetry && sessionActiveErr) {
              try {
                await account.deleteSession("current");
              } catch {}
              return runVerify(false);
            }
          }
          setStatus("error");
          setMessage(
            msg || "Failed to verify email. The link may have expired."
          );
        }
      };

      await runVerify(true);
    };

    verifyMagicURL();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center border border-gray-100">
        {status === "loading" && (
          <>
            <div className="mb-6">
              <svg
                className="animate-spin h-16 w-16 mx-auto text-blue-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
