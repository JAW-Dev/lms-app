import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import classNames from "classnames";
// Context
import useAuth from "../context/AuthContext";
import useModal from "../context/ModalContext";
// Icons
import IconSmartPhoneUpdate from "../../../../assets/images/reskin-images/icon--smartphone-update-2.svg";
import IconCalendar from "../../../../assets/images/reskin-images/icon--calendar-2.svg";
import IconSettings from "../../../../assets/images/reskin-images/icon--settings.svg";
import IconHelp from "../../../../assets/images/reskin-images/icon--help.svg";
import IconPlus from "../../../../assets/images/reskin-images/icon--plus.svg";
import IconMinus from "../../../../assets/images/reskin-images/icon--minus.svg";
import H2HAlert from "../../../../assets/images/reskin-images/icon--h2h-alert.svg";
import H2HPhone from "../../../../assets/images/reskin-images/icon--h2h-phone.svg";
// Images
import WorkstationImg from "../../../../assets/images/reskin-images/img--women-at-workstation.jpg";
// API
import { userAPI } from "../api";
// Helpers
import { h2h_faqs } from "../helpers/localData";
// Hooks
import useResponsive from '../hooks/useResponsive';
// Components
import Spinner from "../components/Spinner";
import TimeZoneSelect from "../components/TimeZoneSelect";
import { GetRemindedButton } from "../components/HelpToHabitCTA";
// Pages
import { SendCodeToPhone } from "./PhoneVerification";
import { Reminders } from "./helpToHabit/Reminders";

export default function HelpToHabit() {
  const queryClient = useQueryClient();
  const { userData, isCarneyTeam } = useAuth();
  const { setContent } = useModal();
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    userData?.settings.time_zone,
  );

  const [phoneNumber, setPhoneNumber] = useState(userData?.profile.phone);
  const [formChanged, setFormChanged] = useState(false);
  const [canEditPhone, setCanEditPhone] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const { isTablet } = useResponsive();

  const toggleEditPhone = () => {
    setCanEditPhone((canEdit) => {
      if (canEdit) {
        setPhoneNumber(userData?.profile.phone);
      }
      return !canEdit;
    });
  };

  const verificationComplete = () => setContent(null);

  const startVerify = () => {
    setContent({
      modalTitle: "Send Code",
      content: (
        <SendCodeToPhone
          profile={userData?.profile}
          onVerificationComplete={verificationComplete}
        />
      ),
    });
  };

  const { mutate, isLoading } = useMutation(
    () =>
      userAPI.editH2HSettings({
        data: {
          time_zone: selectedTimeZone,
          phone: phoneNumber,
        },
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["currentUser"]);
        setFormChanged(false);
        setCanEditPhone(false);
      },
    },
  );

  const onSubmit = (event) => {
    event.preventDefault();
    mutate();
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (userData && !isCarneyTeam) {
      navigate("/v2");
    }

    setPhoneNumber(userData?.profile.phone || "");
  }, [userData]);

  useEffect(() => {
    const changed =
      selectedTimeZone !== userData?.settings.time_zone ||
      phoneNumber !== userData?.profile.phone;
    setFormChanged(changed);
  }, [selectedTimeZone, phoneNumber]);

  const hasReminder =
    userData?.help_to_habit_progress_count > 0 ||
    userData?.help_to_habit_progress_completed_count > 0;
  const h2hOptOut = userData?.h2h_opt_out;
  const hasAnnualAccess =
    userData?.profile?.hubspot?.access_type === "Annual Access";
  const hasRenewalAccess =
    userData?.profile?.hubspot?.access_type === "Renewal";
  const hasCorporateAccess =
    userData?.profile?.hubspot?.access_type === "Corporate Access";
  const hasCorporateRenewalAccsess =
    userData?.profile?.hubspot?.access_type === "Corporate Renewal";
  const hasEmployeeAccsess =
    userData?.profile?.hubspot?.access_type === "Employee Access";
  const hasH2HAccess =
    hasAnnualAccess ||
    hasRenewalAccess ||
    hasCorporateAccess ||
    hasCorporateRenewalAccsess ||
    hasEmployeeAccsess;

  // TODO: get this from the API?
  const query = {
    behaviorTitle: "Go Forward with Feedback",
    behaviorID: 1,
    type: "behavior",
    hasH2H: true,
  };

  const phoneIsVerified = !!userData?.profile.phone_verified;

  const handleQuestionClick = (index) => {
    setActiveQuestion(index === activeQuestion ? null : index);
  };

  return (
    userData && (
      <div className="container mb-24 mt-10 md:mt-16 text-charcoal">
        {h2hOptOut ? (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="md:w-2/5">
              <img
                src={WorkstationImg}
                alt="Women working at desk"
                className="h2h-feature-img"
              />
            </div>
            <div className="md:w-3/5 lg:w-1/2 md:py-12 md:px-4 lg:px-8">
              <h1 className="font-extrabold text-4xl md:text-5xl mb-8">
                Help To Habit
              </h1>
              <div className="flex gap-6 items-start mb-10">
                <div className="flex items-center">
                  <SVG src={H2HAlert} width={isTablet ? '72px' : '94px'} height={isTablet ? '72px' : '94px'} />
                </div>
                <div>
                  <h2 className="mb-2 font-bold" style={{fontSize: "20px"}}>
                  You have cancelled received Help to Habit reminders by means of your cellular provider.
                  </h2>
                  <p style={{fontSize: "16px"}}>
                  Texting STOP to Help to Habit suspends our ability to send you your daily reminders.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start mb-10">
                <div className="flex items-center">
                <SVG src={H2HPhone} width={isTablet ? '72px' : '94px'} height={isTablet ? '72px' : '94px'} />
                </div>
                <div>
                  <h2 className="mb-2 font-bold" style={{fontSize: "20px"}}>
                  Text START to 833-202-9765 to enable your Help to Habit account.
                  </h2>
                  <p style={{fontSize: "16px"}}>
                  To avoid this in the future, try using the Pause and Resume features on your Help to Habit dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {hasReminder || phoneNumber ? (
              <>
                <h1 className="font-extrabold text-4xl md:text-5xl mb-4">
                  Help To Habit
                </h1>
                <p className="font-semibold font-sans mb-10">
                  Develop key leadership behavior with helpful tips and reminders.
                </p>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="mb-8 md:w-1/2 md:mb-0">
                    <Reminders />
                  </div>
                  <div className="md:w-1/2">
                    {isLoading && <Spinner />}
                    <form className="md:p-6" onSubmit={onSubmit}>
                      <div className="flex items-center border-b border-gray-dark pb-4">
                        <SVG src={IconSettings} />
                        <span className="font-semibold font-sans ml-3">
                          Settings
                        </span>
                      </div>
                      <p className="py-3 border-b border-gray-dark">
                        You will receive text messages at the following phone number
                        to help you build a leadership habit. Messages will arrive
                        between 8 <span className="text-xs uppercase">am</span> and
                        8 <span className="text-xs uppercase">pm</span> in your
                        selected time zone.
                      </p>
                      <div className="py-4 border-b border-gray-dark">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                          <span className="w-full md:w-2/5 lg:w-1/3 font-bold mb-1 md:mb-0">
                            Phone number:
                          </span>
                          <div className="flex gap-4 justify-between items-center w-full md:w-3/5">
                            <input
                              type="tel"
                              className="block w-full px-4 py-2 border-2 border-gray focus:outline-none focus:border-link-purple rounded-lg"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              disabled={!canEditPhone && phoneIsVerified}
                            />
                            {phoneIsVerified ? (
                              <button
                                type="button"
                                className="font-normal text-link-purple ml-auto"
                                onClick={toggleEditPhone}
                              >
                                {canEditPhone ? "Cancel" : "Edit"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="font-normal text-link-purple ml-auto"
                                onClick={startVerify}
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="py-4">
                        <label className="flex flex-col md:flex-row md:items-center w-full md:gap-4">
                          <span className="w-2/5 lg:w-1/3 font-bold mb-1 md:mb-0">
                            My time zone:
                          </span>
                          <div className="flex-1">
                            <TimeZoneSelect
                              selectedTimeZone={selectedTimeZone}
                              setSelectedTimeZone={setSelectedTimeZone}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="flex justify-end py-4">
                        <button
                          type="submit"
                          className={classNames(
                            "text-sm font-bold py-3 px-4 rounded-2lg inline-flex self-start",
                            { "bg-link-purple text-white": formChanged },
                            {
                              "bg-grey-light text-grey-dark cursor-default":
                                !formChanged,
                            },
                          )}
                          disabled={!formChanged}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* FAQ's to be added when we have copy */}
                {/* <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="h2h-faqs md:pb-6 md:px-6  md:w-1/2" style={{marginLeft: 'auto'}}>
                    <div className="pt-6">
                      <div className="flex items-center" style={{gap: "12px"}}>
                        <SVG src={IconHelp}/>
                        <h3 className="font-normal" style={{fontSize: '16px'}}>Frequently Asked Questions</h3>
                      </div>
                      <span className="h-px w-full bg-gray mt-6 flex" />
                    </div>
                    
                    {h2h_faqs.map((faq, index) => (
                      <div key="index">
                        <div className="faq-question pt-6" style={{cursor: 'pointer'}} onClick={() => handleQuestionClick(index)}>
                          <div className="flex justify-between items-center">
                            <p className="text-link-purple uppercase" style={{fontSize: '14px', fontWeight: '700'}}>{faq.question}</p>
                            {index === activeQuestion ? (
                              <SVG src={IconMinus} />
                            ) : (
                              <SVG src={IconPlus} />
                            )}
                          </div>
                        </div>
                        <div className={`faq-answer ${index === activeQuestion ? 'pt-4 block' : 'hidden'}`} style={{ height: index === activeQuestion ? 'auto' : '0px', transition: 'height 0.3s ease' }}>
                          {faq.answer}
                        </div>
                        <span className="h-px w-full bg-gray mt-6 flex" />
                      </div>
                    ))}
                  </div>
                </div> */}
              </>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="md:w-2/5">
                  <img
                    src={WorkstationImg}
                    alt="Women working at desk"
                    className="h2h-feature-img"
                  />
                </div>
                <div className="md:w-3/5 lg:w-1/2 md:py-12 md:px-4 lg:px-8">
                  <h1 className="font-extrabold text-4xl md:text-5xl mb-8">
                    Help To Habit
                  </h1>
                  <div className="flex gap-6 items-start mb-10">
                    <div className="flex items-center p-4 bg-purple-100 rounded-full">
                      <SVG src={IconCalendar} className="w-6 h-6 md:w-10 md:h-10" />
                    </div>
                    <div>
                      <h2 className="mb-2 font-normal" style={{ fontSize: "20px" }}>
                        Build a strong habit in 30&nbsp;days
                      </h2>
                      <p style={{ fontSize: "16px" }}>
                        Help to Habit reminders help you develop key leadership
                        behavior with daily tips and reminders.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start mb-10">
                    <div className="flex items-center p-4 bg-purple-100 rounded-full">
                      <SVG
                        src={IconSmartPhoneUpdate}
                        className="w-6 h-6 md:w-10 md:h-10"
                      />
                    </div>
                    <div>
                      <h2 className="mb-2 font-normal" style={{ fontSize: "20px" }}>
                        Get reminders for leadership behavior
                      </h2>
                      <p style={{ fontSize: "16px" }}>
                        Daily reminders are sent via SMS at your preferred time.
                      </p>
                    </div>
                  </div>
                  {hasH2HAccess ? (
                    <GetRemindedButton
                      query={query}
                      text="Activate Now"
                      showIcon={false}
                      classes="w-full md:w-auto font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
                    />
                  ) : (
                    <div class="p-6 bg-purple-100" style={{ borderRadius: "32px" }}>
                      <p className="mb-4" style={{ fontSize: "20px" }}>
                        Sign up for full access to Admired Leadership to activate
                        this exclusive member benefit.
                      </p>
                      <a
                        href="/program/orders/new"
                        className="inline-block w-full md:w-auto font-bold text-sm text-white bg-link-purple py-3 px-4"
                        style={{ borderRadius: "27px" }}
                      >
                        Get Full Access
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  );
}
