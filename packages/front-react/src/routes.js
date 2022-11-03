import React from 'react';

export default [
  {
    path: '/',
    Component: React.lazy(() => import('./views/Home'))
  },
  {
    path: '/about',
    Component: React.lazy(() => import('./views/About'))
  },
]