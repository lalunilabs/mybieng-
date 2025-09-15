import React from 'react';

export default function Head() {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const title = 'Your Reports | MyBeing';
  const description = 'Interactive insights and charts from your assessments. Discuss findings with the AI companion for deeper understanding.';
  const url = `${base}/reports`;
  const og = `${base}/api/og?title=${encodeURIComponent('Your Reports')}&subtitle=${encodeURIComponent('Interactive insights and charts')}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og} />
    </>
  );
}
