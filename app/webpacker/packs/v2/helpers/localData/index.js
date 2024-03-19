import React from 'react';
import { csrfToken } from "@rails/ujs";
import AlLogoIcon from "../../../../../assets/images/reskin-images/icon--al-logo.svg";
import ResourcesIcon from "../../../../../assets/images/reskin-images/icon--resources.svg";
import UserIcon from "../../../../../assets/images/reskin-images/icon--user.svg";
import LogOutIcon from "../../../../../assets/images/reskin-images/icon--log-out.svg";
import UsersIcon from "../../../../../assets/images/reskin-images/icon--users.svg";
import EventsIcon from "../../../../../assets/images/reskin-images/icon--events.svg";
import StarIcon from "../../../../../assets/images/reskin-images/icon--star2.svg";
import SupportIcon from "../../../../../assets/images/reskin-images/icon--support.svg";
import NotesIcon from "../../../../../assets/images/reskin-images/icon--note.svg";
import IconHeart from "../../../../../assets/images/reskin-images/icon--heart.svg";

import UsersCircleIcon from "../../../../../assets/images/reskin-images/icon--user-circle.svg";
import SmartPhoneIcon from "../../../../../assets/images/reskin-images/icon--smartphone-active.svg";
import ModulesIcon from "../../../../../assets/images/reskin-images/icon--modules.svg";
import BehaviorsIcon from "../../../../../assets/images/reskin-images/icon--behaviors.svg";
import SalesIcon from "../../../../../assets/images/reskin-images/icon--sales.svg";
import WebinarsIcon from "../../../../../assets/images/reskin-images/icon--webinars.svg";
import ToolIcon from "../../../../../assets/images/reskin-images/icon--tool.svg";

import {FAQ1, FAQ2, FAQ3} from '../../components/h2h/faq'

export const hamburgerDropdownList = [
  {
    icon: ToolIcon,
    text: "Admin Dashboard",
    path: "/v2/admin/user",
    onClick: () => {},
    subList: [],
    role: "admin",
  },
  {
    icon: ToolIcon,
    text: "Old Admin Dashboard",
    path: "/admin",
    onClick: () => {},
    subList: [],
    role: "admin",
  },
  {
    icon: AlLogoIcon,
    text: "Dashboard",
    path: "/v2",
    onClick: () => {},
    subList: [],
  },
  {
    icon: IconHeart,
    text: "Help to Habit",
    path: "/v2/help-to-habit",
    onClick: () => {},
    subList: [],
  },
  {
    icon: StarIcon,
    text: "Modules",
    path: "/v2/program/2/15",
    onClick: () => {},
    subList: [],
  },
  {
    icon: EventsIcon,
    text: "Events",
    path: "/v2/program/events",
    onClick: () => {},
    subList: [],
  },
  {
    icon: NotesIcon,
    text: "Notes",
    path: "/v2/program/notes",
    onClick: () => {},
    subList: [],
  },
  {
    icon: UsersIcon,
    text: "Community Discussion Groups",
    path: "/v2/program/resources/study-groups",
    onClick: () => {},
    subList: [],
  },
  {
    icon: ResourcesIcon,
    text: "Resources",
    path: null,
    onClick: () => {},
    subList: [
      // {
      //   path: '/program/events',
      //   text: 'Events',
      // },
      {
        path: "https://admiredleadership.com/field-notes/archive/",
        text: "Field Notes",
      },
      {
        path: "/v2/program/AL-Direct",
        text: "AL Direct",
      },
      {
        path: "/program/resources/study-groups",
        text: "Cohorts",
      },
      {
        path: "/v2/get-your-links",
        text: "Get Podcast Link",
      },
      {
        path: "/v2/program/book-summaries",
        text: "Book Summaries",
      },
    ],
  },
  {
    icon: SupportIcon,
    text: "Support",
    path: "/v2/contact-us",
    onClick: () => {},
    subList: [],
  },
  // {
  //   icon: GiftIcon,
  //   text: 'Gift a Course',
  //   path: '/gift',
  //   onClick: () => {},
  //   subList: []
  // }
];

export const userDropdownList = [
  {
    icon: UserIcon,
    text: "View Profile Settings",
    path: "/v2/users/profile/manage-profile",
    onClick: () => {},
    subList: [],
  },
  {
    icon: LogOutIcon,
    text: "Sign Out",
    path: null,
    onClick: () => {
      fetch("/users/sign_out", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken(),
        },
      }).then(() => {
        window.location.href = "/users/sign_in";
      });
    },
    subList: [],
  },
];

export const adminMenu = [
  {
    icon: UsersCircleIcon,
    text: "Users",
    description: "Add, update, or remove users and assign their access level",
    route: "/v2/admin/user",
    disabled: false,
  },
  {
    icon: SmartPhoneIcon,
    text: "Help to Habit",
    description: "Add, update, or remove help to habit content",
    route: "/v2/admin/behaviors",
    disabled: false,
  },
  {
    icon: ModulesIcon,
    text: "Manage Modules",
    description: "Add, update, or remove modules and behavior bundles",
    route: "/admin/program/modules",
    disabled: true,
  },
  {
    icon: BehaviorsIcon,
    text: "Manage Behaviors",
    description: "Add, update, or remove behavior videos",
    route: "/admin/program/behaviors",
    disabled: true,
  },
  {
    icon: WebinarsIcon,
    text: "Manage Webinars",
    description: "Add, update, or remove webinars",
    route: "/admin/program/webinars",
    disabled: true,
  },
  {
    icon: SalesIcon,
    text: "View Orders",
    description: "View completed orders and gifts",
    route: "/admin/program/orders",
    disabled: true,
  },
];

export const footerMenu = [
  { href: "https://www.admiredleadership.com/about/", text: "About Us" },
  { href: "/v2/contact-us", text: "Get Support" },
  { href: "/v2/privacy-policy/", text: "Privacy Policy" },
  { href: "/v2/user-agreement/", text: "User Agreement" },
];

export const anchorSections = ["notes", "examples", "questions", "exercises", "behavior_maps", "gift"];
export const h2h_faqs = [
  {
    question: 'What is Help to habit?',
    answer: <FAQ1/>
  },
  {
    question: 'How do i activate reminders for a behavior?',
    answer: <FAQ2/>
  },
  {
    question: 'Why can’t i add more reminders to my queue?',
    answer: <FAQ3/>
  },
];
