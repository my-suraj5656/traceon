import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/blockchain", "/search", "/diamond/"],
      disallow: [
        "/admin",
        "/admin/*",
        "/superadmin",
        "/superadmin/*",
        "/employee",
        "/employee/*",
        "/api",
        "/api/*",
        "/login",
        "/change-password",
        "/reset-password",
      ],
    },
    sitemap: "https://traceon.click2pdf.in/sitemap.xml",
  };
}
