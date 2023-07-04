import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "~/components/layouts/ThemeProvider";
import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
