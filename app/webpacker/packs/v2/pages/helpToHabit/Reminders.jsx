import React, { useState, useEffect, useRef, forwardRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import SVG from "react-inlinesvg";
import classNames from "classnames";

import { useModal } from "../../context/ModalContext";
import useData from "../../context/DataContext";

import IconHistory from "../../../../../assets/images/reskin-images/icon--history.svg";
import IconHamburger from "../../../../../assets/images/reskin-images/icon--hamburger-menu.svg";
import IconPlay from "../../../../../assets/images/reskin-images/icon--play-circle2.svg";
import IconPause from "../../../../../assets/images/reskin-images/icon--pause-circle.svg";
import IconCancel from "../../../../../assets/images/reskin-images/icon--cancel-circle.svg";
import PurplePlus from "../../../../../assets/images/reskin-images/icon--purple-plus.svg";

import { h2hAPI, userAPI } from "../../api";
import { HelpToHabitProgressBar } from "../../components/HelpToHabitProgressList";
import { Reorder } from "framer-motion/dist/framer-motion";
import { StepLoader } from "../../components/Modal";
import EnqueueList from "./EnqueueList";

const ConfirmRemove = forwardRef(function({ habit, message }, readyToOrder) {
  const { setContent } = useModal();

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    () => h2hAPI.deleteHelpToHabitProgresses([habit.id]),
    {
      onMutate: () => (readyToOrder.current = false),
      onSuccess: () => {
        queryClient.refetchQueries(["userHelpToHabitProgress"]);
      },
      onError: () => (readyToOrder.current = true),
      onSettled: () => setContent(null),
    },
  );

  return (
    <>
      <div className="md:px-8 py-4 md:text-center">
        <p className="mb-4 text-xl font-semibold">Are you sure?</p>
        <p>
          {message || "Do you want to remove this reminder from your queue?"}
        </p>
      </div>
      <div className="flex gap-4 mt-auto items-center justify-end py-8 md:pt-16 md:pb-0 sticky md:static pin-b bg-white">
        <button
          type="button"
          className="font-semibold"
          onClick={() => setContent(null)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          onClick={mutate}
        >
          Confirm
        </button>
        {isLoading && <StepLoader />}
      </div>
    </>
  );
});

const Item = forwardRef(function({ habit, reOrdering }, readyToOrder) {
  const { setContent } = useModal();
  const queryClient = useQueryClient();
  const toggleMutation = useMutation(
    (params) => h2hAPI.toggleProgress(params),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["userHelpToHabitProgress"]);
      },
    },
  );

  const onClickRemove = () => {
    setContent({
      modalTitle: "Remove Reminder",
      content: <ConfirmRemove habit={habit} ref={readyToOrder} />,
    });
  };

  const isCurrent = habit.is_active && habit.queue_position === 1 && !reOrdering;

  const playState = (habit) => {
    if (!habit.is_active && habit?.progress === 0) {
      return "Start";
    } else if (!habit.is_active) {
      return "Resume";
    } else {
      return "Pause";
    }
  };

  return (
    <Reorder.Item
      id={`habit-${habit.id}`}
      key={habit.id}
      value={habit}
      className={classNames({ "current mb-3": isCurrent })}
    >
      <div
        className={classNames("flex flex-col w-full h-full bg-white")}
      >
        <div className={classNames("flex flex-col py-4", {"md:rounded-xl md:shadow-lg": isCurrent, "border-b border-gray-dark": !isCurrent})}>
          <div className="flex flex-col lg:flex-row gap-5">
            <SVG
              src={IconHamburger}
              className="hidden lg:block flex-no-shrink self-center lg:ml-2 cursor-grab"
            />
            <div className="w-4/5 lg:w-2/5 select-none">
              <img
                src={`https://play.vidyard.com/${habit.behavior?.player_uuid}.jpg`}
                className="align-middle h-full object-cover rounded-2lg"
              />
            </div>
            <div className="flex-1 pr-4 select-none">
              <a
                href={`/v2/program/${habit?.module?.id}/${habit?.behavior_id}`}
                className="block mb-2 text-sm text-link-purple"
              >
                {habit.behavior_title}
              </a>
              <p className="mb-2 text-xs">
                You&apos;re on day {habit.progress} of {habit.total_content}
              </p>
              <HelpToHabitProgressBar
                num={habit.progress}
                denom={habit.total_content}
                disableRatio
              />
              <div className="flex flex-col md:flex-row gap-3 mt-3">
                {isCurrent && (
                  <button
                    type="button"
                    className={classNames(
                      "flex items-center gap-1 text-purple-500 text-sm",
                      {
                        "opacity-50 pointer-events-none":
                          toggleMutation.isLoading,
                      },
                    )}
                    onClick={() =>
                      toggleMutation.mutate({
                        progressId: habit.id,
                        is_active: !habit.is_active,
                      })
                    }
                  >
                    <SVG
                      src={habit.is_active ? IconPause : IconPlay}
                      width={24}
                      height={24}
                      preProcessor={(code) =>
                        code.replace(/stroke=".*?"/g, 'stroke="currentColor"')
                      }
                    />
                    <span className="text-link-purple">{playState(habit)}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="flex items-center gap-1 text-purple-500 text-sm"
                  onClick={onClickRemove}
                >
                  <SVG
                    src={IconCancel}
                    width={20}
                    height={20}
                    preProcessor={(code) =>
                      code.replace(/stroke=".*?"/g, 'stroke="currentColor"')
                    }
                  />
                  <span className="text-link-purple">Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
});

export function Reminders() {
  const { setContent } = useModal();
  const { contentData } = useData();

  const { data, isLoading } = useQuery("userHelpToHabitProgress", () =>
    h2hAPI.getProgresses(),
  );

  const [habitQueue, setHabitQueue] = useState([]);
  const readyToOrder = useRef(false);
  const queryClient = useQueryClient();
  const orderMutation = useMutation(
    (habits) => userAPI.updateQueueOrder(habits),
    {
      onSuccess: () => {
        readyToOrder.current = false;
        queryClient.refetchQueries(["userHelpToHabitProgress"]);
      },
      onError: () => (readyToOrder.current = true),
    },
  );

  useEffect(() => {
    if (!isLoading && data) {
      const queue = (data ?? []).filter((reminder) => !reminder.completed);
      readyToOrder.current = false;
      setHabitQueue(queue);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (readyToOrder.current) {
      const reordered = habitQueue.reduce((acc, habit, index) => {
        const orderedHabit = { queue_position: index + 1 };
        return { ...acc, [habit.id]: orderedHabit };
      }, {});
      orderMutation.mutate(reordered);
    }

    readyToOrder.current = habitQueue.length > 0;
  }, [habitQueue]);

  const onClickEnqueue = () => {
    setContent({
      modalTitle: "Add Reminders to Queue",
      subTitle: "Choose from the available behaviors below.",
      content: <EnqueueList data={data} contentData={contentData} />,
    });
  };

  const current = (data || []).find(
    (reminder) => reminder.queue_position === 1 && !reminder.completed,
  );

  const loadedWithContent = !orderMutation.isLoading && !isLoading && !!current;

  return (
    <div className="flex flex-col gap-10 md:gap-6">
      <div className="w-full md:p-6 flex flex-col md:rounded-xl md:shadow-lg">
        <div className="flex items-center mb-3">
          <SVG src={IconHistory} />
          <span className="font-semibold font-sans ml-3">Reminder Queue</span>
        </div>
        {current && (
        <div className="p-4 lg:mb-3 rounded-2lg w-full h-full md:border md:border-gray-dark shadow-lg md:shadow-none">
          <p className="mb-1 text-sm font-bold">Today&apos;s Reminder</p>
          {(orderMutation.isLoading || isLoading) && (
            <div className="rounded-2lg loading-colors h-full min-h-4 w-full mt-3" />
          )}
          {loadedWithContent && (
            <p className="text-base font-normal">
              {current.current_content
                ? current.current_content
                : "You have no reminders yet. Check back tomorrow."}
            </p>
          )}
        </div>
        )}
        <div className="pt-1 flex-grow">
          <Reorder.Group
            axis="y"
            values={habitQueue}
            onReorder={setHabitQueue}
            as="ol"
            className="list-reset relative"
          >
            {habitQueue.map((habit) => (
              <Item key={habit.id} habit={habit} ref={readyToOrder} reOrdering={orderMutation.isLoading} />
            ))}
          </Reorder.Group>
          {data && contentData && (
            <div
              className="flex items-center py-4"
              style={{ gap: "20px", cursor: "pointer" }}
              onClick={onClickEnqueue}
            >
              <SVG src={PurplePlus} />
              <div
                className="flex uppercase justify-center items-center py-8 px-10 text-purple"
                style={{
                  borderRadius: "13px",
                  border: "1px dashed #8B7FDB",
                  width: "246px",
                  height: "141px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <p className="text-center">
                  + Add reminders for additional behavior
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
