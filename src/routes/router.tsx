/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layouts/main-layout/index';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';
import { Typography } from '@mui/material';
import { SocketProvider } from 'components/provider/SocketProvider';
import { NotificationProvider } from 'components/provider/NotificationProvider';

// Lazy load components with error boundaries
const lazyLoad = (importFunc: any) => {
  return lazy(() =>
    importFunc().catch((error: any) => {
      console.error('Error loading component:', error);
      return { default: () => <div>Error loading page</div> };
    }),
  );
};

const App = lazyLoad(() => import('App'));
const Dashboard = lazyLoad(() => import('pages/dashboard/Dashboard'));
const Signin = lazyLoad(() => import('pages/authentication/Signin'));
const Buildings = lazyLoad(() => import('pages/properties/Buildings/index'));
const Floors = lazyLoad(() => import('pages/properties/Floors/index'));
const Apartments = lazyLoad(() => import('pages/properties/Apartments/index'));
const Events = lazyLoad(() => import('pages/event/Events'));
const Services = lazyLoad(() => import('pages/service/Services'));
const Residents = lazyLoad(() => import('pages/residents/Residents'));
const Settings = lazyLoad(() => import('pages/more/Settings'));
const RS = lazyLoad(() => import('pages/more/ReportsAndStatistics'));
const VehiclePage = lazyLoad(() => import('pages/vehicles/VehiclePage'));
const BillPage = lazyLoad(() => import('pages/bill/BillPage'));
const ComplaintPage = lazyLoad(() => import('pages/complaint/ComplaintPage'));
const FacilityPage = lazyLoad(() => import('pages/facility/FacilityPage'));
const NotifyPage = lazyLoad(() => import('pages/notification/NotifyPage'));

const ChatPage = lazyLoad(() => import('pages/chat/ChatPage'));
const NotFound = () => (
  <div>
    <Typography variant="h1">Page not found - 404</Typography>
  </div>
);

const ProtectedLayout = () => {
  return (
    <NotificationProvider>
      <SocketProvider>
        <MainLayout>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      </SocketProvider>
    </NotificationProvider>
  );
};

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
          element: <ProtectedLayout />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Dashboard />,
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
              path: paths.vehicles.replace('/', ''),
              element: <VehiclePage />,
            },
            {
              path: paths.settings.replace('/', ''),
              element: <Settings />,
            },
            {
              path: paths.reportStatistics.replace('/', ''),
              element: <RS />,
            },
            {
              path: paths.bills.replace('/', ''),
              element: <BillPage />,
            },
            {
              path: paths.complaints.replace('/', ''),
              element: <ComplaintPage />,
            },
            {
              path: paths.facilities.replace('/', ''),
              element: <FacilityPage />,
            },
            {
              path: paths.notifications.replace('/', ''),
              element: <NotifyPage />,
            },
            {
              path: paths.chat.replace('/', ''),
              element: <ChatPage />,
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
              path: paths.signin,
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
  },
);

export default router;
