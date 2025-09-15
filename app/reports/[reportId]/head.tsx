import React from 'react';

export default function Head({ params }: { params: { reportId: string } }) {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const title = 'Report Detail | MyBeing';
  const description = 'View your assessment results and discuss patterns with the AI companion. No right/wrong answers — focus on insight.';
  const url = `${base}/reports/${params.reportId}`;
  const og = `${base}/api/og?title=${encodeURIComponent('Your Report')}&subtitle=${encodeURIComponent('Personalized insights and patterns')}`;
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
