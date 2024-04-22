import type { AppType } from "next/app";
import { ThemeProvider } from "~/components/layouts/ThemeProvider";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<Component {...pageProps} />
			<Toaster />
		</ThemeProvider>
	);
};

export default api.withTRPC(MyApp);
