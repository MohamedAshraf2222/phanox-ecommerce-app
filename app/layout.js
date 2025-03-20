import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "Phanox Store",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={``}>
        <ClientWrapper>
          <Layout>
            <Toaster />
            {children}
          </Layout>
        </ClientWrapper>
      </body>
    </html>
  );
}
