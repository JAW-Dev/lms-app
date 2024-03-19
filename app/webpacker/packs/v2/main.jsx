import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Components
import Onboarding from './components/Onboarding';
import Root from './components/Root';
import Admin from './pages/admin/Admin';

// Context
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AlarmProvider } from './context/AlarmContext';
import { ModalProvider } from './context/ModalContext';
import { SlideContentProvider } from './context/SlideContent';
import { NoteContentProvider } from './context/NoteContent';
import { SideBarContentProvider } from './context/SidebarContext';
import { OverlayProvider  } from './context/OverlayContext'

// Pages
import Home from './pages/Home';
import Program from './pages/Program';
import AdminUser from './pages/admin/user/AdminUser';
import Notes from './pages/Notes';
import HelpToHabit from './pages/HelpToHabit';
import AdminBehaviors from './pages/admin/behavior/AdminBehaviors';
import AdminBehaviorEdit from './pages/admin/behavior/AdminBehaviorEdit';
import AdminBehaviorEditGeneral from './pages/admin/behavior/AdminBehaviorEditGeneral';
import AdminBehaviorEditBehaviorMap from './pages/admin/behavior/AdminBehaviorEditBehaviorMap';
import AdminBehaviorEditExamples from './pages/admin/behavior/AdminBehaviorEditExamples';
import AdminBehaviorEditExercises from './pages/admin/behavior/AdminBehaviorEditExercises';
import AdminBehaviorEditQuestions from './pages/admin/behavior/AdminBehaviorEditQuestions';
import AdminBehaviorEditHelpToHabit from './pages/admin/behavior/AdminBehaviorEditHelpToHabit';
import Events from './pages/Events';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import BookSummaries from './pages/BookSummaries';
import ALDirect from './pages/ALDirect';
import ALDirectVideo from './pages/ALDirectVideo';
import UserAgreement from './pages/UserAgreement';
import UserProfile from './pages/userProfile/UserProfile';
import UserProfileSettings from './pages/userProfile/UserProfileSettings';
import ManageAccount from './pages/userProfile/ManageAccount';
import Subscription from './pages/userProfile/Subscription';
import CourseNavigation from './pages/CourseNavigation';
import StudyGroups from './pages/StudyGroups';
import Resources from './pages/Resources';
import GetAccess from './pages/GetAccess';
import GiftExpired from './pages/gift/GiftExpired';
import AccessMe from './pages/users/AccessMe';
import AccessTeam from './pages/users/AccessTeam';
import AccessNonprofit from './pages/users/AccessNonprofit';
import AccessDirect from './pages/users/AccessDirect';
import YearlySubscription from './pages/YearleySubscription';
import GetYourLinks from './pages/GetYourLinks';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/v2',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'program/:moduleId/:behaviorId',
        element: <Program />
      },
      {
        path: 'gift',
        children: [
          {
            path: 'expired',
            element: <GiftExpired />
          }
        ]
      },
      {
        path: 'admin',
        element: <Admin />,
        children: [
          {
            path: 'user',
            element: <AdminUser />
          },
          {
            path: 'behaviors',
            children: [
              {
                path: '',
                element: <AdminBehaviors />,
                index: true
              },
              {
                path: 'edit/:id',
                element: <AdminBehaviorEdit />,
                children: [
                  {
                    path: '',
                    element: <AdminBehaviorEditGeneral />
                  },
                  {
                    path: 'behavior-map',
                    element: <AdminBehaviorEditBehaviorMap />
                  },
                  {
                    path: 'examples',
                    element: <AdminBehaviorEditExamples />
                  },
                  {
                    path: 'exercises',
                    element: <AdminBehaviorEditExercises />
                  },
                  {
                    path: 'questions',
                    element: <AdminBehaviorEditQuestions />
                  },
                  {
                    path: 'help-to-habit',
                    element: <AdminBehaviorEditHelpToHabit />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'program/notes',
        element: <Notes />
      },
      {
        path: 'help-to-habit',
        element: <HelpToHabit />
      },
      {
        path: 'program/events',
        element: <Events />
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: 'contact-us',
        element: <ContactUs />
      },
      {
        path: 'program/book-summaries',
        element: <BookSummaries />
      },
      {
        path: 'program/AL-Direct',
        element: <ALDirect />
      },
      {
        path: 'program/AL-Direct/:webinarId',
        element: <ALDirectVideo />
      },
      {
        path: 'user-agreement',
        element: <UserAgreement />
      },
      {
        path: 'users/profile',
        element: <UserProfile />,
        children: [
          {
            path: 'manage-profile',
            element: <UserProfileSettings />
          },
          {
            path: 'manage-account',
            element: <ManageAccount />
          },
          {
            path: 'subscription-settings',
            element: <Subscription />
          }
        ]
      },
      {
        path: 'program/course-navigation',
        element: <CourseNavigation />,
      },
      {
        path: 'program/resources/study-groups',
        element: <StudyGroups />,
      },
      {
        path: 'program/resources',
        element: <Resources />,
      },
      {
        path: 'users/access/',
        element: <GetAccess />,
      },
      {
        path: 'users/access/me',
        element: <AccessMe />
      },
      {
        path: 'users/access/team',
        element: <AccessTeam />
      },
      {
        path: 'users/access/nonprofit',
        element: <AccessNonprofit />
      },
      {
        path: 'users/access/direct',
        element: <AccessDirect />
      },
      {
        path: 'yearly-subscription',
        element: <YearlySubscription />
      },
      {
        path: 'get-your-links',
        element: <GetYourLinks />
      }
    ]
  }
]);

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('react-root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AnimatePresence>
          <AuthProvider>
            <DataProvider>
              <AlarmProvider>
                <OverlayProvider>
                  <ModalProvider>
                    <SlideContentProvider>
                      <NoteContentProvider>
                        <SideBarContentProvider>
                          <Onboarding />
                          <RouterProvider router={router} />
                        </SideBarContentProvider>
                      </NoteContentProvider>
                    </SlideContentProvider>
                  </ModalProvider>
                </OverlayProvider>
              </AlarmProvider>
            </DataProvider>
          </AuthProvider>
        </AnimatePresence>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
