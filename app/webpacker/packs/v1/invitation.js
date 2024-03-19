import 'whatwg-fetch';
import 'core-js/features/promise';
import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { csrfToken } from '@rails/ujs';
import classNames from 'classnames';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import { format, parse, add } from 'date-fns';

const courseIds = (courses) => courses.map(({ id }) => id);

const pluralize = (word, number) => (number > 1 ? `${word}s` : word);

function parseDate(str, dateFormat, locale) {
  const parsed = parse(str, dateFormat, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, dateFormat, locale) {
  return format(date, dateFormat, { locale });
}

const InvitationTypeSelector = ({
  accessType,
  fieldname,
  setInvitationLength,
  setMultiplier,
  setAccessType
}) => (
  <div className="mb-4">
    <label className="flex items-baseline -mx-1">
      <input
        type="radio"
        name={`${fieldname}[access_type]`}
        value="limited"
        className="mx-1"
        checked={accessType === 'limited'}
        onChange={(e) => {
          setAccessType(e.target.value);
          setInvitationLength(7);
          setMultiplier(1);
        }}
      />
      <span className="mx-1">
        Limited{' '}
        <em className="text-sm">(defaults to one week, “Week Access” email)</em>
      </span>
    </label>
    <label className="flex items-baseline -mx-1">
      <input
        type="radio"
        name={`${fieldname}[access_type]`}
        value="unlimited"
        className="mx-1"
        checked={accessType === 'unlimited'}
        onChange={(e) => {
          setAccessType(e.target.value);
          setInvitationLength(1);
          setMultiplier(365);
        }}
      />
      <span className="mx-1">
        Unlimited{' '}
        <em className="text-sm">(defaults to one year, “Welcome” email)</em>
      </span>
    </label>
  </div>
);

const ExpirationTypeSelector = ({
  allowChoice,
  expiresAt,
  expirationType,
  fieldname,
  invitationLength,
  multiplier,
  setExpirationType,
  setInvitationLength,
  setMultiplier,
  validForDays
}) => {
  const selectExpirationType = !allowChoice ? null : (
    <div className="mb-4">
      <span className="block mb-1 font-bold">Expiration Type</span>
      <label className="flex items-baseline -mx-1">
        <input
          type="radio"
          value="length"
          name="expiration_type"
          className="mx-1"
          checked={expirationType === 'length'}
          onChange={(e) => setExpirationType(e.target.value)}
        />
        <span className="mx-1">
          Fixed Length{' '}
          <em className="text-sm">
            (user has access for a fixed period after joining)
          </em>
        </span>
      </label>
      <label className="flex items-baseline -mx-1">
        <input
          type="radio"
          value="date"
          name="expiration_type"
          className="mx-1"
          checked={expirationType === 'date'}
          onChange={(e) => setExpirationType(e.target.value)}
        />
        <span className="mx-1">
          Fixed Date{' '}
          <em className="text-sm">(user has access until selected date)</em>
        </span>
      </label>
    </div>
  );

  const expirationField =
    expirationType === 'length' ? (
      <div className="mb-4">
        <div>
          <label
            className="block mb-1 text-sm font-bold"
            htmlFor="invitation-length"
          >
            Invitation Length
          </label>
          <div className="flex flex-wrap items-center -mx-2">
            <div className="px-2">
              <input
                type="number"
                min="1"
                step="1"
                className="w-16 p-2 bg-grey-lighter"
                id="invitation-length"
                value={invitationLength}
                onChange={(event) => setInvitationLength(Math.max(1, event.target.value))
                }
              />
            </div>
            <div className="px-2">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="invitiation-length-multipier"
                  checked={multiplier === 1}
                  onChange={() => setMultiplier(1)}
                />
                {pluralize('day', invitationLength)}
              </label>
            </div>
            <div className="px-2">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="invitiation-length-multipier"
                  checked={multiplier === 365}
                  onChange={() => setMultiplier(365)}
                />
                {pluralize('year', invitationLength)}
              </label>
            </div>
          </div>
        </div>

        <input
          type="hidden"
          name={`${fieldname}[valid_for_days]`}
          value={validForDays}
        />
      </div>
    ) : (
      <div className="mb-4">
        <span className="block mb-1 text-sm font-bold">Expiration Date</span>
        <div className="flex items-center mb-4">
          <i className="fas fa-calendar-day" />
          <DayPickerInput
            formatDate={formatDate}
            format="MM/dd/yyyy"
            parseDate={parseDate}
            clickUnselectsDay
            value={expiresAt}
            inputProps={{
              name: `${fieldname}[expires_at]`,
              className: 'mx-1 p-2 bg-grey-lighter shadow-inner',
              autoComplete: 'off'
            }}
            dayPickerProps={{
              disabledDays: {
                before: new Date()
              }
            }}
          />
        </div>
      </div>
    );

  return (
    <>
      {selectExpirationType}
      {expirationField}
    </>
  );
};

const InvitationSelector = ({
  id,
  fieldname,
  expiresAt: initialExpiresAt,
  accessType: initialAccessType = 'limited',
  message,
  restricted,
  userId,
  validForDays: initialValidForDays,
  discount,
  basePrice,
  userRoles
}) => {
  const [accessType, setAccessType] = useState(initialAccessType);
  const [skipEmail, setSkipEmail] = useState(true);
  const [optOutEOP, setoptOutEOP] = useState(false);
  const [hasUnlimitedGifts, setHasUnlimitedGifts] = useState(
    userRoles.includes('unlimited_gifts')
  );
  const [price, setPrice] = useState(basePrice - (discount || 300));
  const [hasPreferredRate, setHasPreferredRate] = useState(!!discount);
  const [expiresAt, setExpiresAt] = useState(
    !initialExpiresAt ? null : parse(initialExpiresAt, 'yyyy-MM-dd', new Date())
  );

  const allowChoice = !userId;
  const defaultExpirationType = initialExpiresAt ? 'date' : 'length';
  const [expirationType, setExpirationType] = useState(
    !allowChoice ? 'date' : defaultExpirationType
  );

  const [multiplier, setMultiplier] = useState(
    initialAccessType === 'limited' ? 1 : 365
  );
  const [validForDays, setValidForDays] = useState(
    initialValidForDays || initialAccessType === 'limited' ? 7 : 365
  );
  const [invitationLength, setInvitationLength] = useState(
    Math.max(1, Math.round(validForDays / multiplier))
  );

  useEffect(() => {
    const date =
      accessType === 'unlimited'
        ? add(new Date(), { years: 1 })
        : add(new Date(), { days: 7 });
    setExpiresAt(date);
  }, [accessType]);

  useEffect(() => {
    setValidForDays(invitationLength * multiplier);
  }, [invitationLength, multiplier, setValidForDays]);

  return (
    <div className="mb-2">
      {id && <input type="hidden" value={id} name={`${fieldname}[id]`} />}

      {restricted ? (
        <input
          type="hidden"
          name={`${fieldname}[access_type]`}
          value="limited"
        />
      ) : (
        <>
          <InvitationTypeSelector
            {...{
              accessType,
              fieldname,
              setInvitationLength,
              setMultiplier,
              setAccessType,
            }}
          />

          <ExpirationTypeSelector
            {...{
              allowChoice,
              expiresAt,
              expirationType,
              fieldname,
              invitationLength,
              multiplier,
              setExpirationType,
              setInvitationLength,
              setMultiplier,
              validForDays,
            }}
          />
        </>
      )}
      <div className="mb-4">
        <label className="flex items-baseline -mx-1">
          <input
            type="checkbox"
            name={`${fieldname}[unlimited_gifts]`}
            className="mx-1"
            checked={hasUnlimitedGifts}
            onChange={() => setHasUnlimitedGifts(!hasUnlimitedGifts)}
          />
          <span className="mx-1">Allow unlimited gifts?</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-baseline -mx-1">
          <input
            type="checkbox"
            name={`${fieldname}[skip_email]`}
            className="mx-1"
            checked={skipEmail}
            onChange={() => setSkipEmail(!skipEmail)}
          />
          <span className="mx-1">Skip sending email?</span>
        </label>
      </div>
      <div className={skipEmail ? 'hidden' : 'mb-4'}>
        <label
          className="block mb-1 font-bold"
          htmlFor={`${fieldname}[message]`}
        >
          Message (optional)
        </label>
        <textarea
          placeholder="Your message here..."
          rows={5}
          maxLength={800}
          autoComplete="off"
          defaultValue={message}
          className="w-full p-2 bg-grey-lighter shadow-inner"
          name={!skipEmail ? `${fieldname}[message]` : undefined}
          id={`${fieldname}[message]`}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-baseline -mx-1">
          <input
            type="checkbox"
            name={`${fieldname}[opt_out_eop]`}
            className="mx-1"
            checked={optOutEOP}
            onChange={() => setoptOutEOP(!optOutEOP)}
          />
          <span className="mx-1">Opt out of EOP</span>
        </label>
      </div>

      {!restricted && (
        <>
          <div className="mb-4">
            <label className="flex items-baseline -mx-1">
              <input
                type="checkbox"
                className="mx-1"
                checked={hasPreferredRate}
                onChange={() => setHasPreferredRate(!hasPreferredRate)}
              />
              <span className="mx-1">Set preferred rate pricing?</span>
            </label>
          </div>

          {hasPreferredRate && (
            <div>
              <label className="block mb-1 font-bold" htmlFor="price">
                Price
              </label>
              <span>
                <span className="mr-1">$</span>
                <input
                  type="number"
                  min={0}
                  max={basePrice}
                  step={1}
                  className="w-24 p-2 bg-grey-lighter"
                  id="price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </span>
              <input
                type="hidden"
                value={(basePrice - price) * 100}
                name={`${fieldname}[discount_cents]`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Invitation = ({
  userId,
  id,
  expiresAt,
  fieldname,
  accessType,
  courses,
  selectedCourses,
  message,
  restricted,
  validForDays,
  discount,
  basePrice,
  userAccessType,
  userAccessTypeLabel,
  userAccessTypeValues,
  userRoles
}) => {
  const [invitationId, setInvitationId] = useState(id);
  const [invitationActive, setInvitationActive] = useState(false);
  const [selected, setSelected] = useState(
    id ? selectedCourses : courseIds(courses)
  );

  useEffect(() => {
    setInvitationActive(!!invitationId || !userId);
  }, [invitationId]);

  const headingLabel = id
    ? 'Update Invitation Access'
    : 'Add Invitation Access';

  const deleteInvitation = () => {
    // eslint-disable-next-line
    if (confirm('Delete this invitation?')) {
      fetch(`/admin/invites/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': csrfToken()
        }
      })
        .then((resp) => {
          if (resp.status === 200) {
            setInvitationId(null);
            setSelected([]);
          }
        })
        .catch((error) => {
          console.log('request failed', error);
        });
    }
  };

  const courseList = courses.map((course) => (
    <option key={course.id} value={course.id}>
      {course.title}
    </option>
  ));

  const actionLink = invitationId ? (
    <span
      role="button"
      tabIndex={0}
      className="block text-sm text-purple-darker underline"
      onClick={deleteInvitation}
      onKeyPress={deleteInvitation}
    >
      Delete Invitation
    </span>
  ) : (
    <span
      role="button"
      tabIndex={0}
      className={classNames('block text-sm text-purple-darker underline', {
        hidden: !userId
      })}
      onClick={() => setInvitationActive(false)}
      onKeyPress={() => setInvitationActive(false)}
    >
      Cancel
    </span>
  );

  return (
    <>
      <button
        type="button"
        className={classNames('btn btn--inverse rounded border', {
          hidden: invitationActive
        })}
        onClick={() => setInvitationActive(true)}
      >
        Add Invitation Access
      </button>
      {invitationActive && (
        <>
          <div className="mb-6">
            <label className="block mb-1 font-bold" htmlFor="course_list">
              Modules
            </label>
            <select
              size="14"
              multiple="multiple"
              className="border"
              required="required"
              name={`${fieldname}[course_ids][]`}
              defaultValue={selected}
              id="course_list"
            >
              {courseList}
            </select>
          </div>
          <div className="mb-6">
            {userAccessTypeLabel && userAccessTypeValues && (
              <div className="mb-6">
                <label
                  className="block mb-1 font-bold"
                  htmlFor="user_access_type"
                >
                  {userAccessTypeLabel}
                </label>
                <select
                  className="w-full p-2 bg-grey-lighter shadow-inner"
                  style={{ maxWidth: 411 }}
                  name={`${fieldname}[user_access_type]`}
                  id="user_access_type"
                  defaultValue={userAccessType}
                >
                  <option value="" />
                  {userAccessTypeValues.map(([label, value]) => (
                    <option
                      key={`user-access-type-${value}`}
                      value={value}
                      label={label}
                    />
                  ))}
                </select>
              </div>
            )}
            <span className="block mb-1 font-bold">{headingLabel}</span>
            <InvitationSelector
              {...{
                id: invitationId,
                expiresAt,
                fieldname,
                accessType,
                restricted,
                message,
                userId,
                validForDays,
                discount,
                basePrice,
                userRoles
              }}
            />
            {actionLink}
          </div>
        </>
      )}
    </>
  );
};

const invitation = document.querySelector('.invitation');
const {
  user: userId,
  id,
  expiresAt,
  fieldname,
  access: accessType,
  courses,
  selected: selectedCourses,
  message,
  restricted,
  validForDays,
  discount,
  basePrice,
  userAccessType,
  userAccessTypeLabel,
  userAccessTypeValues,
  userRoles
} = invitation.dataset;

render(
  <Invitation
    userId={userId}
    id={id}
    expiresAt={expiresAt}
    fieldname={fieldname}
    accessType={accessType}
    courses={JSON.parse(courses)}
    selectedCourses={JSON.parse(selectedCourses)}
    message={message}
    restricted={restricted === 'true'}
    validForDays={validForDays}
    discount={parseFloat(discount)}
    basePrice={parseFloat(basePrice)}
    userAccessType={userAccessType}
    userAccessTypeLabel={userAccessTypeLabel}
    userAccessTypeValues={
      userAccessTypeValues ? JSON.parse(userAccessTypeValues) : undefined
    }
    userRoles={userRoles}
  />,
  invitation
);
