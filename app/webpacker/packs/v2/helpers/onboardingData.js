import React from "react";

import NotesOnBoardingOne from "../../../../assets/images/reskin-images/onboarding--notes-1.png";
import NotesOnBoardingTwo from "../../../../assets/images/reskin-images/onboarding--notes-2.png";
import WelcomOne from "../../../../assets/images/reskin-images/onboarding--welcome-1.png";

const WelcomeSubtitle = () => (
  <>
    <h3 className="ont-bold pb-4">Same Great Content. All New Look.</h3>
  </>
);

const WelcomeBlurb = () => (
  <p>The path to Admired Leadership just got a lot more attractive.</p>
);

const NotesBlurb1 = () => (
  <p>Take notes in the new notes tab to revisit later</p>
);

const NotesBlurb2 = () => (
  <p>Access all of your notes at any time in the main menu</p>
);

const onboardingList = [
  {
    feature: "welcome3000",
    title: "We've made some changes.",
    callout: "WELCOME!",
    slides: [
      {
        image: WelcomOne,
        subtitle: <WelcomeSubtitle />,
        blurb: <WelcomeBlurb />,
      },
    ],
    pages: ["all"],
  },
  // {
  //   feature: "notes",
  //   title: "Take notes while you watch.",
  //   callout: "NEW!",
  //   slides: [
  //     {
  //       image: NotesOnBoardingOne,
  //       blurb: <NotesBlurb1 />,
  //     },
  //     {
  //       image: NotesOnBoardingTwo,
  //       blurb: <NotesBlurb2 />,
  //     },
  //   ],
  //   pages: ["/v2/program/notes", "/v2/program/{number}/{number}"],
  // },
];

export default onboardingList;
