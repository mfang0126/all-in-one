import React from 'react';

export const ContentBox = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className='mb-6'>
      <div className='text-2xl font-bold mb-4'>{title}</div>
      <div className='shadow-lg border border-gray-200 rounded-lg p-4  bg-white'>{children}</div>
    </div>
  );
};
