import { createHashRouter, type RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const DashboardPage = lazy(() => import('../pages/Dashboard.page'));
const SimpleLayout = lazy(() => import('@pages/layouts/Simple.layout'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SimpleLayout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
];

export const router = createHashRouter(routes);
