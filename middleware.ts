import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // TBF: 沒登入時導回首頁
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
