export function OrganizationSchema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Meum Labs',
    alternateName: ['MyBeing', 'MyBeing by Meum Labs'],
    url: 'https://mybeing.in',
    logo: 'https://mybeing.in/logo.png',
    description: 'Meum Labs creates MyBeing, a Personal Health Environment platform for self-discovery and behavioral pattern analysis through research-backed assessments.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Dr N',
      jobTitle: 'Founder & Research Director',
      url: 'https://mybeing.in/about'
    },
    sameAs: [
      'https://mybeing.in',
      'https://mybeing.in/about'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'MyBeing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Personal Health Environment',
            description: 'Comprehensive self-discovery platform with behavioral assessments and AI insights'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mental Tug of War Assessment',
            description: 'Cognitive dissonance assessment focusing on value-behavior alignment patterns'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Premium Subscription',
            description: 'Unlimited access to assessments, premium content, and AI conversations',
            offers: {
              '@type': 'Offer',
              price: '32',
              priceCurrency: 'USD',
              billingDuration: 'P1M'
            }
          }
        }
      ]
    },
    knowsAbout: [
      'Personal Health Environment',
      'Behavioral Psychology',
      'Cognitive Dissonance',
      'Self-Discovery',
      'Mental Health Assessment',
      'Behavioral Pattern Analysis',
      'Research-Based Psychology',
      'Longitudinal Health Tracking'
    ],
    areaServed: 'Worldwide',
    serviceType: 'Digital Health Platform'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
