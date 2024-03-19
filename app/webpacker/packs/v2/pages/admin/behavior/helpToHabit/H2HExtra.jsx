import React, { useState } from "react";
import SVG from "react-inlinesvg";
import classNames from "classnames";

import { EditH2HItemForm } from "./EditH2HItemForm";
import IconPencil from "../../../../../../../assets/images/reskin-images/icon--edit.svg";

export function H2HExtra({
  behaviorId,
  habit,
  placement,
  label,
  setIsLoading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      className={classNames("border-gray p-4 flex gap-4 bg-white", {
        "items-center": !isEditing,
        "items-start": isEditing,
        "border-b": placement === "intro",
      })}
    >
      <span
        style={{ minWidth: "24px" }}
        className="flex items-center justify-center rounded bg-matte-gray px-2 py-1 ml-10 text-white text-sm uppercase"
      >
        {label}
      </span>
      {isEditing ? (
        <EditH2HItemForm
          habit={habit}
          behaviorId={behaviorId}
          placement={placement}
          setIsLoading={setIsLoading}
          setIsEditing={setIsEditing}
        />
      ) : (
        <p>{habit?.content}</p>
      )}
      <div className="ml-auto mr-9">
        {!isEditing && (
          <button
            type="button"
            className="p-2"
            onClick={() => setIsEditing(true)}
          >
            <SVG src={IconPencil} height={20} width={20} />
          </button>
        )}
      </div>
    </div>
  );
}
