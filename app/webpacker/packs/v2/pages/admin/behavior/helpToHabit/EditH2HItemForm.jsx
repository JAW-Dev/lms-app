import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { adminAPI } from "../../../../api";

export function EditH2HItemForm({ behaviorId, habit, placement, setIsLoading, setIsEditing }) {
  const [form, setForm] = useState({
    content: habit?.content || "",
    placement
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => {
      if(placement) {
        return adminAPI.editHelpToHabitExtra({ behaviorId, extraId: habit?.id, data: form })
      }
      return adminAPI.editHelpToHabit({ helpToHabitID: habit.id, data: form })
    },
    {
      onMutate: () => setIsLoading(true),
      onSettled: () => {
        setIsLoading(false);
        setIsEditing(false);
      },
      onSuccess: () => {
        queryClient.refetchQueries([
          `behavior ${behaviorId}`,
        ]);
      },
    },
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={onSubmit} className="flex-1 w-full ml-4 mr-12">
      <textarea
        rows="4"
        name="content"
        className="w-full mb-2 p-4 border-2 rounded"
        value={form.content}
        onChange={handleChange}
      ></textarea>
      <div className="flex justify-end -mx-1">
        <button
          type="button"
          className="mx-1 p-3 text-purple font-bold text-sm"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="mx-1 p-3 text-purple font-bold text-sm rounded-lg border-2 border-purple hover:bg-purple hover:text-white"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
