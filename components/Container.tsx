import React from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">{children}</div>;
}
