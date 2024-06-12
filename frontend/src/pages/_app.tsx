import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "../styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  useQuery,
} from "@apollo/client";
import { QuestProvider } from "@/contexts/QuestContext";

//imports relatifs au thème global MaterialUI
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userType } from "@/components/Header";
import { queryMySelf } from "@/graphql/queryMySelf";

const link = createHttpLink({
  uri:
    typeof window !== "undefined" && location.origin.includes("localhost")
      ? "http://localhost:5050"
      : "/api",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const publicPages = ["/", "/signup", "/signin", "/setNewPassword"];

// fonction Auth (affiche quand l'utilisateur est connecté ou non)
const Auth = (props: { children: React.ReactNode }) => {
  const { data, loading } = useQuery<{ item: userType }>(queryMySelf);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (publicPages.includes(router.pathname)) {
        setIsAuthenticated(true);
      } else if (!data?.item) {
        router.replace("/signin");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [loading, data, router.pathname, router]);

  if (loading || isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    return null;
  }

  return <>{props.children}</>;
};

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Auth>
        <QuestProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />;
          </ThemeProvider>
        </QuestProvider>
      </Auth>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
