import React from "react";

export interface JsonLdProps {
  type: "organization" | "localbusiness" | "website" | "service" | "breadcrumb" | "faq" | "product";
  data?: any;
}

export function JsonLd({ type, data }: JsonLdProps) {
  let schema: any = null;

  switch (type) {
    case "organization":
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TechBes",
        "url": "https://techbes.co.in",
        "logo": "https://techbes.co.in/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-95911-44949",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "kn"]
        },
        "sameAs": [
          "https://twitter.com/techbes",
          "https://linkedin.com/company/techbes",
          "https://instagram.com/techbes"
        ]
      };
      break;

    case "localbusiness":
      schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "TechBes",
        "image": "https://techbes.co.in/logo.png",
        "@id": "https://techbes.co.in/#localbusiness",
        "url": "https://techbes.co.in",
        "telephone": "+91-95911-44949",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st Floor, #962, Above SBI Bank, Near Deepa Complex, Papareddy Palya, 2nd Stage, Nagarbhavi",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "postalCode": "560072",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.9625,
          "longitude": 77.5155
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Bangalore"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "19:00"
        }
      };
      break;

    case "website":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "TechBes",
        "url": "https://techbes.co.in",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://techbes.co.in/services?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case "service":
      if (data) {
        schema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.title,
          "serviceType": data.category,
          "provider": {
            "@type": "LocalBusiness",
            "name": "TechBes",
            "telephone": "+91-95911-44949",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1st Floor, Above SBI Bank, Nagarbhavi",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560072",
              "addressCountry": "IN"
            }
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Bangalore"
          },
          "description": data.description,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": String(data.priceValue || 499),
            "url": `https://techbes.co.in/services/${data.slug}`
          }
        };
      }
      break;

    case "breadcrumb":
      if (data && Array.isArray(data.items)) {
        schema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: { name: string; url: string }, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url.startsWith("http") ? item.url : `https://techbes.co.in${item.url}`
          }))
        };
      }
      break;

    case "faq":
      if (data && Array.isArray(data.faqs) && data.faqs.length > 0) {
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs.map((faq: { question: string; answer: string }) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
      }
      break;

    case "product":
      if (data) {
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.title || "CCTV Cameras & Equipment",
          "image": data.image || "https://techbes.co.in/hero-illustration.png",
          "description": data.description || "Purchase high-quality CCTV cameras and accessories in Bangalore from leading brands.",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": String(data.priceValue || 199),
            "priceValidUntil": "2027-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "LocalBusiness",
              "name": "TechBes"
            }
          }
        };
      }
      break;

    default:
      return null;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
