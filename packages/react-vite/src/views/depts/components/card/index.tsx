import React from "react";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const prefixCls = "lt-card";

const Card = ({ title, children, className }: CardProps) => {
  let head: React.ReactNode;
  head = <div className={`text-white font-bold`}>{title}</div>;

  let content: React.ReactNode;
  content = <div>{children}</div>;

  return (
    <div className={`rounded-2xl bg-gray-900 py-5 px-5 ${className}`}>
      {head}
      {content}
    </div>
  );
};

export default Card;
