import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";

import ColorModeToggle from "@/components/ColorModeToggle";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flip it!",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <ChakraProvider>{children}</ChakraProvider>
        <span className="fixed bottom-4 right-4 rounded-full">
          <ColorModeToggle />
        </span>
        <ToastContainer />
      </body>
    </html>
  );
}
