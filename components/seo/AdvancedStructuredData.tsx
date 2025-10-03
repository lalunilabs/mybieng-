import Script from 'next/script';

export function AdvancedStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mybeing.in/#organization",
        "name": "MyBeing",
        "alternateName": ["MyBeing Platform", "Personal Health Environment"],
        "url": "https://mybeing.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mybeing.in/logo.png",
          "width": 512,
          "height": 512
        },
        "description": "World's leading Personal Health Environment platform for self-discovery and behavioral analysis",
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": "Dr N"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@mybeing.in"
        },
        "sameAs": [
          "https://twitter.com/mybeing",
          "https://linkedin.com/company/mybeing"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://mybeing.in/#website",
        "url": "https://mybeing.in",
        "name": "MyBeing - Personal Health Environment Platform",
        "description": "Transform your life with scientifically-validated quizzes, AI-powered insights, and expert-guided growth",
        "publisher": {
          "@id": "https://mybeing.in/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://mybeing.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-IN"
      },
      {
        "@type": "WebApplication",
        "name": "MyBeing Platform",
        "url": "https://mybeing.in",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "description": "Personal Health Environment platform with AI-powered self-discovery tools",
        "offers": {
          "@type": "Offer",
          "price": "32",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "847",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Service",
        "name": "Personal Health Environment Assessment",
        "provider": {
          "@id": "https://mybeing.in/#organization"
        },
        "description": "Comprehensive behavioral pattern analysis and self-discovery through research-backed assessments",
        "serviceType": "Health and Wellness Assessment",
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "MyBeing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cognitive Dissonance Assessment",
                "description": "Identify contradictions between values and actions"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "Behavioral Pattern Analysis",
                "description": "Comprehensive analysis of daily behavioral patterns"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
