import React from 'react';

export default function Head() {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const title = 'About Dr N | MyBeing';
  const description = 'MyBeing is a personal platform by Dr N to help you understand your patterns through research-backed content and self-discovery quizzes. No right/wrong answers.';
  const url = `${base}/about`;
  const og = `${base}/api/og?title=${encodeURIComponent('About Dr N')}&subtitle=${encodeURIComponent('Research‑backed self‑discovery platform')}`;
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
