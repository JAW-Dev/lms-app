import React, { useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useOutletContext } from "react-router-dom";
import SVG from "react-inlinesvg";
import classNames from "classnames";
import {
  Reorder,
  useMotionValue,
  animate,
} from "framer-motion/dist/framer-motion";

import { adminAPI } from "../../../api";
import Spinner from "../../../components/Spinner";
import { AddNewHelpToHabit } from "./helpToHabit/AddNewHelpToHabit";
import { EditH2HItemForm } from "./helpToHabit/EditH2HItemForm";
import { H2HExtra } from "./helpToHabit/H2HExtra";

import IconTrash from "../../../../../../assets/images/reskin-images/icon--trash.svg";
import IconPencil from "../../../../../../assets/images/reskin-images/icon--edit.svg";
import IconHamburger from "../../../../../../assets/images/reskin-images/icon--hamburger-menu.svg";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
}

function H2HItem({ habit, setIsLoading }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => adminAPI.deleteHelpToHabit({ helpToHabitID: habit.id }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          `behavior ${habit.curriculum_behavior_id}`,
        ]);
        setIsLoading(false);
      },
    },
  );

  const handleDelete = () => {
    setIsLoading(true);
    mutate();
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <Reorder.Item
      value={habit}
      id={`habit-${habit.id}`}
      style={{ boxShadow, y }}
      className="relative list-reset p-4 bg-white border-b"
    >
      <div
        className={classNames("flex gap-4", {
          "items-center": !isEditing,
          "items-start": isEditing,
        })}
      >
        <SVG
          src={IconHamburger}
          className="hidden lg:block flex-no-shrink cursor-grab"
        />
        <p
          style={{ minWidth: "24px" }}
          className="flex items-center justify-center rounded bg-green-lightest px-2 py-1 text-gray text-sm"
        >
          Day {habit.order}
        </p>
        {isEditing ? (
          <EditH2HItemForm
            habit={habit}
            behaviorId={habit.curriculum_behavior_id}
            setIsLoading={setIsLoading}
            setIsEditing={setIsEditing}
          />
        ) : (
          <p>{habit.content}</p>
        )}
        <div className="ml-auto">
          {!isEditing && (
            <button type="button" className="p-2" onClick={() => handleEdit()}>
              <SVG src={IconPencil} height={20} width={20} />
            </button>
          )}
          <button type="button" className="p-2" onClick={() => handleDelete()}>
            <SVG src={IconTrash} height={20} width={20} />
          </button>
        </div>
      </div>
      <button
        type="button"
        className="hidden rounded-lg text-grey-dark group font-bold items-center justify-center bg-white hover:text-white add-h2h-button"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-grey-dark">
          +
        </div>
      </button>
    </Reorder.Item>
  );
}

export default function AdminBehaviorEditHelpToHabit() {
  const behavior = useOutletContext();
  const [H2H, setH2H] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const readyToOrder = useRef(false);

  const queryClient = useQueryClient();
  const reOrder = useMutation((habits) => adminAPI.updateHabitOrder(habits), {
    onSuccess: () => {
      queryClient.refetchQueries([`behavior ${behavior.id}`]);
    },
  });

  const toggleActive = useMutation(
    (status) =>
      adminAPI.updateBehavior({
        data: { h2h_status: status },
        behaviorID: behavior.id,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([`behavior ${behavior.id}`]);
      },
    },
  );

  useEffect(() => {
    if (behavior?.help_to_habits) {
      setH2H(behavior.help_to_habits);
    }
    setStatus(behavior?.h2h_status);
  }, [behavior]);

  useEffect(() => {
    if (readyToOrder.current) {
      const reordered = H2H.reduce((acc, habit, index) => {
        const orderedHabit = { order: index + 1 };
        return { ...acc, [habit.id]: orderedHabit };
      }, {});
      reOrder.mutate(reordered);
    }

    readyToOrder.current = H2H.length > 0;
  }, [H2H]);

  const handleChange = () => {
    const newStatus = status === "active" ? "inactive" : "active";
    if (!toggleActive.isLoading) {
      setStatus(newStatus);
      toggleActive.mutate(newStatus);
    }
  };

  return (
    behavior && (
      <>
        <label className="mb-4 switch switch-flat">
          <input
            className="switch-input"
            type="checkbox"
            checked={status === "active"}
            onChange={handleChange}
          />
          <span
            className="switch-label"
            data-on="Active"
            data-off="Inactive"
          ></span>
          <span className="switch-handle"></span>
        </label>

        <H2HExtra
          label="Intro"
          habit={behavior.h2h_intro}
          behaviorId={behavior.id}
          placement="intro"
          setIsLoading={setIsLoading}
        />
        <Reorder.Group
          axis="y"
          values={H2H}
          onReorder={setH2H}
          as="ol"
          className="pl-0 relative"
        >
          {isLoading && <Spinner />}
          {H2H &&
            H2H.map((habit, index) => (
              <H2HItem
                key={habit.id}
                habit={habit}
                setIsLoading={setIsLoading}
              />
            ))}
        </Reorder.Group>
        <H2HExtra
          label="Outro"
          habit={behavior.h2h_outro}
          behaviorId={behavior.id}
          placement="outro"
          setIsLoading={setIsLoading}
        />
        <AddNewHelpToHabit behavior={behavior} />
      </>
    )
  );
}
