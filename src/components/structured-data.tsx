interface StructuredDataProps {
  type: "website" | "article"
  data: {
    title: string
    description: string
    url: string
    image?: string
    datePublished?: string
    dateModified?: string
    author?: string
    category?: string
  }
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type === "website" ? "WebSite" : "Article",
    name: data.title,
    description: data.description,
    url: data.url,
  }

  const websiteSchema = {
    ...baseSchema,
    "@type": "WebSite",
    publisher: {
      "@type": "Person",
      name: "HJ",
    },
  }

  const articleSchema = {
    ...baseSchema,
    "@type": "Article",
    headline: data.title,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Person",
      name: data.author || "HJ",
    },
    publisher: {
      "@type": "Person",
      name: "HJ",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
  }

  const schema = type === "website" ? websiteSchema : articleSchema

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
