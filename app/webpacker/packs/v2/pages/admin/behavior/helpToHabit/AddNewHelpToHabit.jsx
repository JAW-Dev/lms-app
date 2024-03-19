import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { adminAPI } from "../../../../api";
import Spinner from "../../../../components/Spinner";

export function AddNewHelpToHabit({ behavior }) {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState([
    {
      content: "",
    },
  ]);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    () => adminAPI.createNew({ behaviorID: behavior.id, data: form }),
    {
      onSuccess: () => {
        setForm([
          {
            content: "",
            order: (behavior?.help_to_habits?.length || 0) + 1,
          },
        ]);

        setOpenForm(false);
        queryClient.refetchQueries([`behavior ${behavior.id}`]);
      },
    },
  );

  const handleChange = (index) => (event) => {
    const { name, value } = event.target;
    setForm((prevState) => {
      const newForm = [...prevState];
      newForm[index] = { ...newForm[index], [name]: value };
      return newForm;
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    mutate();
  };

  const addFormRow = () => {
    setForm((prevState) => [
      ...prevState,
      {
        content: "",
        order: form[form.length - 1].order + 1,
      },
    ]);
  };

  return (
    <div className="mb-12">
      <button
        type="button"
        className="rounded-2lg mx-auto px-4 py-3 font-bold flex items-center gap-2 bg-link-purple text-white"
        onClick={() => setOpenForm(!openForm)}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white">
          +
        </span>
        <span>Add New</span>
      </button>

      {openForm && (
        <form
          style={{ gap: "16px" }}
          onSubmit={onSubmit}
          className="border-2 rounded-lg p-4 flex flex-col mt-4 mb-2 relative overflow-hidden"
        >
          {isLoading && <Spinner />}

          {form.map((item, index) => (
            <div key={item} className="flex items-start w-full">
              <label className="flex-grow flex items-start mr-4">
                Content:
                <textarea
                  name="content"
                  value={item.content}
                  onChange={handleChange(index)}
                  rows={4}
                  className="border-2 rounded p-4 ml-2 flex-grow"
                  style={{ resize: "none" }}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg px-6 py-4 border-2 border-gray text-gray hover:border-charcoal hover:text-charcoal group font-bold mt-4 flex items-center justify-center"
            onClick={addFormRow}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray group-hover:border-charcoal">
              +
            </div>
          </button>
          <button
            type="submit"
            className="rounded-lg px-6 py-4 bg-link-purple text-white font-medium mt-4"
          >
            Add {form.length} {form.length > 1 ? "Habits" : "Habit"}
          </button>
        </form>
      )}
    </div>
  );
}
