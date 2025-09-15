import React from 'react';

export default function Head() {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const title = 'Research | MyBeing';
  const description = 'Evidence and references behind our assessments. Research-backed, pattern-focused — no right/wrong answers.';
  const url = `${base}/research`;
  const og = `${base}/api/og?title=${encodeURIComponent('Research')}&subtitle=${encodeURIComponent('Evidence-backed assessments')}`;
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
