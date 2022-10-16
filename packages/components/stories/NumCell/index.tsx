import React from 'react';
import { Card } from '../Card';

export const NumCell = ({ title, text }) => {
  return (
    <Card title={title}>
      <div className="text-white font-bold text-3xl my-2">
        {text}
      </div>
    </Card>
  )
}