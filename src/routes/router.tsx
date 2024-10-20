/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';
import ProtectedRoute from 'components/loader/ProtectedRoute';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'));
const Signin = lazy(() => import('pages/authentication/Signin'));
const Buildings = lazy(() => import('pages/properties/Buildings'));
const Floors = lazy(() => import('pages/properties/Floors'));
const Apartments = lazy(() => import('pages/properties/Apartments'));
const Events = lazy(() => import('pages/more/Events'));
const Services = lazy(() => import('pages/more/Services'));
const Residents = lazy(() => import('pages/residents/Residents'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Outlet />
                </ProtectedRoute>
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: paths.buildings,
              element: <Buildings />,
            },
            {
              path: paths.floors,
              element: <Floors />,
            },
            {
              path: paths.apartments,
              element: <Apartments />,
            },
            {
              path: paths.events,
              element: <Events />,
            },
            {
              path: paths.services,
              element: <Services />,
            },
            {
              path: paths.residents,
              element: <Residents />,
            }
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.signin,
              element: <Signin />,
            }
          ],
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);

export default router;
