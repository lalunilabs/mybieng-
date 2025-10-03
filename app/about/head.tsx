import React from 'react';

export default function Head() {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const title = 'About MyBeing | Mission & Research Approach';
  const description = 'MyBeing is a research-backed platform for self-discovery through articles and pattern-recognition assessments. No right/wrong answers. Founded by Dr N.';
  const url = `${base}/about`;
  const og = `${base}/api/og?title=${encodeURIComponent('About MyBeing')}&subtitle=${encodeURIComponent('Mission • Research • Assessments')}`;
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
