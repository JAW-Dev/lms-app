import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import classNames from 'classnames';

import { userAPI } from '../../api';

// Context
import useAuth from '../../context/AuthContext';
// Import Hooks
import useResponsive from '../../hooks/useResponsive';
// Components
import Text from '../../components/Text';
import useModal from '../../context/ModalContext';


const SubscriptionSkeleton = () => {
  return (
    <div className="w-full px-8 lg:px-0">
      <div
        style={{ width: '400px' }}
        className="loading-colors rounded-lg h-10 mb-8"
      />

      <div style={{ width: '300px' }} className="loading-colors h-4 mb-4" />
      <div style={{ width: '300px' }} className="loading-colors h-4 mb-8" />
      <div style={{ width: '450px' }} className="loading-colors h-4 mb-2" />
      <div style={{ width: '450px' }} className="loading-colors h-4 mb-2" />
      <div style={{ width: '380px' }} className="loading-colors h-4 mb-6" />
      <div
        style={{ width: '250px' }}
        className="loading-colors h-10 mb-6 rounded-xl"
      />
    </div>
  );
};

const SubscriptionActionButton = ({ children, onClick, type = 'primary' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'text-sm font-bold py-3 px-4 rounded-2lg inline-flex self-start mt-6',
        {
          'text-white bg-link-purple ': type === 'primary',
          'text-charcoal bg-gray-dark': type === 'secondary',
        }
      )}
    >
      {children}
    </button>
  );
};

const SubscriptionButtons = ({ data }) => {
  const { upcoming_action_date, action } = data;
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  const actionMap = {
    Purchase: 'Purchase',
    Renew: userAPI.processResubscription,
    Subscribe: 'Subscribe',
    Cancel: userAPI.cancelSubscription,
  };

  const { setContent, setIsLoading } = useModal();
  const { mutate, isLoading } = useMutation(actionMap[data.action], {
    onSuccess: () => {
      queryClient.invalidateQueries(['userDetails', userData?.id]);
      setContent();
    },
  });

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  const renderButtons = {
    Purchase: (
      <SubscriptionActionButton
        onClick={() => (window.location.href = '/program/orders/new')}
      >
        Purchase Full Access
      </SubscriptionActionButton>
    ),
    Renew: (
      <SubscriptionActionButton
        onClick={() =>
          setContent({
            modalTitle: 'Set Up Renewal',
            content: (
              <>
                <p className="mb-4">
                  By proceeding with this action, you will be charged for
                  $200.00 on {upcoming_action_date} to continue your full access
                  to Admired Leadership.
                  <br className="mb-2" />
                  You will be charged on the same day every year until you
                  cancel your subscription.
                  <br className="mb-2" />
                  You can cancel your subscription at any time.
                </p>
                <SubscriptionActionButton onClick={() => mutate()}>
                  Proceed with Renewal
                </SubscriptionActionButton>
              </>
            ),
          })
        }
      >
        Set Up Renewal
      </SubscriptionActionButton>
    ),
    Subscribe: (
      <SubscriptionActionButton
        onClick={() => (window.location.href = '/v2/yearly-subscription')}
      >
        Set Up Renewal
      </SubscriptionActionButton>
    ),
    Cancel: (
      <SubscriptionActionButton
        type="secondary"
        onClick={() =>
          setContent({
            modalTitle: 'Cancel Renewal',
            content: (
              <>
                <p className="mb-4">
                  Are you sure you want to proceed with canceling your renewal?
                  <br className="mb-2" />
                  By proceeding with this action, you will lose access to your
                  full access to Admired Leadership on {upcoming_action_date}.
                </p>
                <SubscriptionActionButton onClick={() => mutate()}>
                  Proceed with Cancellation
                </SubscriptionActionButton>
              </>
            ),
          })
        }
      >
        Cancel Renewal
      </SubscriptionActionButton>
    ),
  };

  return renderButtons[action];
};

const Subscription = () => {
  const { userData } = useAuth();
  const { isTablet } = useResponsive();

  const { data, isLoading } = useQuery(
    ['userDetails', userData?.id],
    () => userAPI.getUserAccessData(userData?.id),
    {
      enabled: !!userData,
    }
  );

  return isLoading || !data ? (
    <SubscriptionSkeleton />
  ) : (
    <div className="w-full px-8 lg:px-0">
      <p className="text-grey font-bold mb-2">Current Plan</p>
      <Text
        size="h2"
        variant="h2"
        className="text-charcoal font-extrabold font-inter mb-2"
      >
        {data.plan}
      </Text>
      <p className="text-charcoal mb-4" style={{ maxWidth: '450px' }}>
        {data.plan_description}
      </p>
      <p className="text-charcoal mb-4" style={{ maxWidth: '450px' }}>
        {data.plan_description_2}
      </p>
      {data.upcoming_action_description && (
        <p
          className="text-grey-dark font-bold mb-2"
          style={{ maxWidth: '450px' }}
        >
          {data.upcoming_action_description}
        </p>
      )}
      <SubscriptionButtons data={data} />
    </div>
  );
};

export default Subscription;
