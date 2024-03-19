import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// API
import { h2hAPI, userAPI } from '../../api';
// Context
import useData from '../../context/DataContext';
import useAuth from '../../context/AuthContext';
import { useModal } from "../../context/ModalContext";
// Components
import FormCheckbox from '../../components/FormCheckbox';
import { CancelButton } from '../../components/Modal';
import Button from '../../components/Button';
import { StepLoader } from "../../components/Modal";
// Hooks
import useResponsive from "../../hooks/useResponsive";

const EnqueueList = ({data, contentData}) => {
    const [currentReminders, setCurrentReminders] = useState();
    const [checkedBehaviors, setCheckedBehaviors] = useState([]);
    const [remindersAdded, setRemindersAdded] = useState([]);
    const [buttonCount, setButtonCount] = useState(0);
    const { isTablet } = useResponsive();
    const { setContent } = useModal();
    const queryClient = useQueryClient();

    const newData = contentData?.modules?.map(module => ({
        id: module.id,
        title: module.title,
        position: module.position - 2,
        behaviors: module.behaviors.filter(behavior => behavior.has_h2h === true),
    })).filter(module => module.behaviors.length > 0);
    
    const { mutate, isLoading } = useMutation(
        userAPI.subscribeToH2H,
        {
            onSettled: () => {
                queryClient.refetchQueries(['userHelpToHabitProgress']);
                setContent(null)
            }
        }
      );

    const onChange = (behaviorID) => {
        const isChecked = !checkedBehaviors[behaviorID];

        if (isChecked) {
            setCheckedBehaviors((prevState) => ({
                ...prevState,
                [behaviorID]: isChecked,
            }));
            setButtonCount(buttonCount + 1);
            setRemindersAdded([...remindersAdded, behaviorID]);
        } else {
            setCheckedBehaviors((prevState) => {
                const nextState = { ...prevState };
                delete nextState[behaviorID];
                return nextState;
            });
            setButtonCount(buttonCount - 1);
            setRemindersAdded((prevReminders) => prevReminders.filter((reminder) => reminder !== behaviorID));
        }
    };

    const onClick = () => {
        remindersAdded.forEach(reminder => {
            setTimeout(() => {
                mutate({behaviorID: reminder});
            }, 100);
        });
    };

    useEffect(() => {
        const initialCheckedState = {};
        data?.forEach(item => {initialCheckedState[item.behavior_id] = true;});
        setCurrentReminders(initialCheckedState);
    }, [data]);

    if (!currentReminders) {
        return null;
    }

    return (
        <div>
            <div className="overflow-y-scroll" style={{maxHeight: isTablet ? 'none' : '50vh'}} >
                {newData?.map((data) => (
                    <div key={`module-${data.id}`}>
                        <h3>Module {data.position} {data.title}</h3>
                        <div className="pb-4">
                            {data?.behaviors.filter(behavior => !currentReminders[behavior.id]).map(behavior => (
                                <div className="flex flex-row items-center py-4 border-b border-gray-dark" style={{ gap: '27px' }} key={`behavior-${behavior.id}`}>
                                    <label htmlFor={`behavior-${behavior.id}`} className="custom-checkbox-container" style={{ paddingLeft: '18px', top: '-10px' }}>
                                        <input
                                            id={`behavior-${behavior.id}`}
                                            type="checkbox"
                                            onChange={() => onChange(behavior.id)}
                                            style={{cursor: !checkedBehaviors[behavior.id] ? 'default' : 'pointer'}}
                                        />
                                        <span className="custom-checkbox" ></span>
                                    </label>
                                    <img
                                        style={{ borderRadius: '8px', width: '139px', height: '79px' }}
                                        src={`https://play.vidyard.com/${behavior.player_uuid}.jpg`}
                                        alt={behavior.title}
                                    />
                                    <p>{behavior?.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-dark p-4" >
                <div className="flex justify-end">
                    <CancelButton text="Close"/>
                    {buttonCount > 0 && (
                        <Button type="submit" onClick={() => onClick()} variant="default-lowewrcase" className="font-bold capitalize" style={{ borderRadius: '12px' }}>
                        Add ({buttonCount}) Reminders
                        </Button>
                    )}
                </div>
            </div>
            {isLoading && <StepLoader />}
        </div>
    );
};

export default EnqueueList;