import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

const titleRoutes = [
  { path: '/', title: 'Traveloop' },
  { path: '/login', title: 'Login | Traveloop' },
  { path: '/signup', title: 'Register | Traveloop' },
  { path: '/forgot-password', title: 'Forgot Password | Traveloop' },
  { path: '/reset-password', title: 'Reset Password | Traveloop' },
  { path: '/dashboard', title: 'Dashboard | Traveloop' },
  { path: '/trips', title: 'My Trips | Traveloop' },
  { path: '/trip/create', title: 'Plan a Trip | Traveloop' },
  { path: '/itinerary/:id', title: 'Itinerary | Traveloop' },
  { path: '/map/:id', title: 'Map View | Traveloop' },
  { path: '/search/cities', title: 'City Search | Traveloop' },
  { path: '/search/activities', title: 'Activity Search | Traveloop' },
  { path: '/community', title: 'Community | Traveloop' },
  { path: '/checklist', title: 'Packing | Traveloop' },
  { path: '/notes', title: 'Notes | Traveloop' },
  { path: '/invoice/:id', title: 'Invoice | Traveloop' },
  { path: '/profile', title: 'Profile | Traveloop' },
  { path: '/admin', title: 'Admin | Traveloop' },
];

export default function DocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = titleRoutes.find((route) =>
      matchPath({ path: route.path, end: true }, location.pathname)
    );

    document.title = currentRoute?.title || 'Traveloop';
  }, [location.pathname]);

  return null;
}
