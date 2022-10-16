import React from 'react';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, children, className }: CardProps) => {
  console.log('children: ', children);
  return (
    <div className={`rounded-2xl bg-gray-900 py-5 px-5 ${className}`}>
      <div className={`text-white font-bold`}>
        {title}
      </div>
      {children} 
    </div>
  )
};