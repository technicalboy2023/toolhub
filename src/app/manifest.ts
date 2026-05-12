import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolsHub — Premium Browser Tools",
    short_name: "ToolsHub",
    description:
      "A premium collection of fast, private, browser-based tools. Process images, PDFs, text, and more — all locally on your device.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6366f1",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}