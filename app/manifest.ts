import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HomeHub",
    short_name: "HomeHub",
    description: "家庭向けの生活管理Webアプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [],
  };
}
