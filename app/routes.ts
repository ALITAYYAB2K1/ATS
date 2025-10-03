import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signin", "routes/SignIn.tsx"),
  route("signup", "routes/signup.tsx"),
  route("upload", "routes/upload.tsx"),
  route("auth/verify", "routes/auth.verify.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
