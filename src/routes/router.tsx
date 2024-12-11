/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy, useEffect } from 'react';
import { Outlet, createBrowserRouter, useNavigate } from 'react-router-dom';
import MainLayout from 'layouts/main-layout/index';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';
import { Button, Typography } from '@mui/material';
import { SocketProvider } from 'components/provider/SocketProvider';
import { NotificationProvider } from 'components/provider/NotificationProvider';
import { useAuth } from 'hooks/auth/useAuth';

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
const Buildings = lazyLoad(() => import('pages/properties/Buildings/BuildingPage'));
const Floors = lazyLoad(() => import('pages/properties/Floors/FloorPage'));
const Apartments = lazyLoad(() => import('pages/properties/Apartments/index'));
const Events = lazyLoad(() => import('pages/event/Events'));
const Services = lazyLoad(() => import('pages/service/Services'));
const Residents = lazyLoad(() => import('pages/residents/ResidentPage'));
const Settings = lazyLoad(() => import('pages/more/Settings'));
const RS = lazyLoad(() => import('pages/more/ReportsAndStatistics'));
const VehiclePage = lazyLoad(() => import('pages/residents/vehicles/VehiclePage'));
const BillPage = lazyLoad(() => import('pages/bill/BillPage'));
const ComplaintPage = lazyLoad(() => import('pages/complaint/ComplaintPage'));
const FacilityPage = lazyLoad(() => import('pages/properties/Facility/FacilityPage'));
const NotifyPage = lazyLoad(() => import('pages/notification/NotifyPage'));
const ApartmentDetailPage = lazyLoad(() => import('pages/properties/Apartments/ApartmentDetail'));
const AddMultiResidentPage = lazyLoad(() => import('pages/residents/AddResidentPage'));

const ChatPage = lazyLoad(() => import('pages/chat/ChatPage'));
const NotFound = () => {
  const nav = useNavigate();
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="text-center">
        <Typography variant="h1" onClick={() => nav('/')}>
          Page Not Found
        </Typography>
        <Button onClick={() => nav('/')} variant="contained" color="primary" sx={{ mt: 3 }}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only redirect if we're not loading and the user isn't authenticated
    if (!isLoading && !isAuthenticated) {
      navigate(paths.signin, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Don't render protected content until we confirm authentication
  if (!isAuthenticated) {
    return null;
  }

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
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              ),
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
              path: paths.apartmentDetail,
              element: <ApartmentDetailPage />,
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
            },
            {
              path: paths.vehicles,
              element: <VehiclePage />,
            },
            {
              path: paths.settings,
              element: <Settings />,
            },
            {
              path: paths.reports,
              element: <RS />,
            },
            {
              path: paths.bills,
              element: <BillPage />,
            },
            {
              path: paths.complaints,
              element: <ComplaintPage />,
            },
            {
              path: paths.facilities,
              element: <FacilityPage />,
            },
            {
              path: paths.notifications,
              element: <NotifyPage />,
            },
            {
              path: paths.chat,
              element: <ChatPage />,
            },
            {
              path: paths.addResident,
              element: <AddMultiResidentPage />,
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
