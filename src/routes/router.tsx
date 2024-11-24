/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';
import ProtectedRoute from 'components/loader/ProtectedRoute';

// Lazy load components with error boundaries
const lazyLoad = (importFunc : any) => {
  return lazy(() => importFunc().catch((error : any) => {
    console.error('Error loading component:', error);
    return { default: () => <div>Error loading page</div> };
  }));
};

const App = lazyLoad(() => import('App'));
const Dashboard = lazyLoad(() => import('pages/dashboard/Dashboard'));
const Signin = lazyLoad(() => import('pages/authentication/Signin'));
const Buildings = lazyLoad(() => import('pages/properties/Buildings/index'));
const Floors = lazyLoad(() => import('pages/properties/Floors/index'));
const Apartments = lazyLoad(() => import('pages/properties/Apartments/index'));
const Events = lazyLoad(() => import('pages/more/Events'));
const Services = lazyLoad(() => import('pages/more/Services'));
const Residents = lazyLoad(() => import('pages/residents/Residents'));
const Settings = lazyLoad(() => import('pages/more/Settings'));
const RS = lazyLoad(() => import('pages/more/ReportsAndStatistics'));
const Overview = lazyLoad(() => import('pages/properties/Overview/index'));
const NotFound = () => <div>Page not found</div>;

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      errorElement: <NotFound />,
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
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: paths.overview.replace('/', ''),
              element: <Overview />,
            },
            {
              path: paths.buildings.replace('/', ''),
              element: <Buildings />,
            },
            {
              path: paths.floors.replace('/', ''),
              element: <Floors />,
            },
            {
              path: paths.apartments.replace('/', ''),
              element: <Apartments />,
            },
            {
              path: paths.events.replace('/', ''),
              element: <Events />,
            },
            {
              path: paths.services.replace('/', ''),
              element: <Services />,
            },
            {
              path: paths.residents.replace('/', ''),
              element: <Residents />,
            },
            {
              path: paths.settings.replace('/', ''),
              element: <Settings />,
            },
            {
              path: paths.reportStatistics.replace('/', ''),
              element: <RS />,
            },
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </AuthLayout>
          ),
          errorElement: <NotFound />,
          children: [
            {
              path: paths.signin.split('/').pop(),
              element: <Signin />,
            },
          ],
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: '/',
  }
);

export default router;