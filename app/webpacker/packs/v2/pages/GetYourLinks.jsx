import React, { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useMutation, useQueryClient } from 'react-query';
// API
import { userAPI } from '../api';
// Context
import useModal from '../context/ModalContext';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Components
import PodcastLinksModal from '../components/PodcastLinksModal';
// Images
import PodcastImg from '../../../../assets/images/reskin-images/img--podcast-listening.png';
// Icons
import SmartPhone from '../../../../assets/images/reskin-images/icon--smartphone-2.svg';
import Headphones from '../../../../assets/images/reskin-images/icon--headphones-2.svg';


export default function GetYourLinks() {
    const { isTablet } = useResponsive();
    const { setContent } = useModal();
    const queryClient = useQueryClient();
    const { mutate } = useMutation(userAPI.podcastCTA, {
        onSuccess: () => {}
    });

    const onClick = (e) => {
        e.preventDefault();
        setContent({
        modalTitle: 'Podcast Links',
        content: <PodcastLinksModal/>,
        });
        mutate();
    }
    
    return (
        <div className="container mb-24 mt-10 md:mt-16 text-charcoal">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="md:w-2/5">
                    <img
                    src={PodcastImg}
                    alt="Podcast"
                    className="h2h-feature-img"
                    />
                </div>
                <div className="md:w-3/5 lg:w-1/2 md:py-12 md:px-4 lg:px-8">
                    <h1 className="font-extrabold text-4xl md:text-5xl mb-8">
                        Podcast Feeds
                    </h1>
                    <div className="flex gap-6 items-start mb-10">
                        <div className="flex items-center p-4 bg-purple-100 rounded-full">
                            <SVG src={SmartPhone} />
                        </div>
                    <div>
                        <h2 className="mb-2 font-semibold" style={{fontSize: "20px"}}>
                            Get special access to two key private podcast feeds:
                        </h2>
                        <ul style={{paddingLeft: "1rem"}}>
                            <li>All Admired Leader Behavior modules</li>
                            <li>All AL Direct Q&A sessions</li>
                        </ul>
                    </div>
                    </div>
                    <div className="flex gap-6 items-start mb-10">
                        <div className="flex items-center p-4 bg-purple-100 rounded-full">
                            <SVG src={Headphones} />
                        </div>
                    <div>
                        <h2 className="mb-2 font-semibold" style={{fontSize: "20px"}}>
                            Listen on the go
                        </h2>
                        <p style={{fontSize: "16px"}}>
                            Choose the podcast player of your choice. 
                        </p>
                        <p style={{fontSize: "16px"}}>
                            Apple and Google Podcasts are supported.
                        </p>
                    </div>
                    </div>
                    <button
                        type="button"
                        className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-lg ml-auto uppercase"
                        onClick={onClick}
                        style={{borderRadius: '27px'}}
                        >
                        Get Access
                    </button>
                </div>
            </div>
        </div>
    );
}