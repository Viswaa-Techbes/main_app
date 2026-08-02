import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/api",
        "/checkout",
        "/payment",
        "/login",
        "/register",
      ],
    },
    sitemap: "https://techbes.co.in/sitemap.xml",
  };
}
