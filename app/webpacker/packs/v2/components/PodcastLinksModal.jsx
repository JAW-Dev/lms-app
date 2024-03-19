import React from 'react';
import SVG from "react-inlinesvg";
// Context
import useModal from '../context/ModalContext';
import useAuth from "../context/AuthContext";
// Images
import SmartPhone from '../../../../assets/images/reskin-images/icon--smartphone-2.svg';

const PodcastLinksModal = () => {
  const { setContent } = useModal();
  const { userData } = useAuth();

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center p-4 bg-purple-100 rounded-full">
        <SVG src={SmartPhone} />
      </div>

      <p className="pt-2 pb-8 text-center" style={{maxWidth: '440px'}}>Details regarding your private podcast links have been emailed to: <span className="text-link-purple">{userData.email}</span></p>
      
      <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg ml-auto"
          onClick={() => setContent()}
        >
          OK
        </button>
    </div>
  )
}

export default PodcastLinksModal;