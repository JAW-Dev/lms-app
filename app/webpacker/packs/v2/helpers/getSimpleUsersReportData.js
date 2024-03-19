import { csrfToken } from '@rails/ujs';
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Token': csrfToken(),
};

const getSimpleUsersReportData = async (users = null) => {
  let queriedUsers = [];

  if (!users) {
    return;
  }

  const userIDs = users.map((user) => user.id);

  const res = await fetch('/api/v2/admin/users/users_details', {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_ids: userIDs }),
  });

  const result = await res.json();
  queriedUsers = result?.users || [];

  let updatedUserData = [];

  const queriedUsersData = queriedUsers.map((queriedUser) => {
    let newData = {};
    const usersdata = queriedUser?.user;
    const userCourses = usersdata?.courses;

    newData.id = usersdata?.id;
    newData.email = usersdata?.email;
    newData.first_name = usersdata?.profile?.first_name;
    newData.last_name = usersdata?.profile?.last_name;

    const coursesData = userCourses.map((course) => {
      const behaviorsCount = course?.behaviors?.length;
      let behaviorsCompletedCount = 0;
      let newCourse = {};

      newCourse.id = course?.id;
      newCourse.title = course?.title;

      course.behaviors.map((behavior) => {
        const completed = behavior?.completed;

        if (completed === true) {
          behaviorsCompletedCount += 1;
        }
      });

      newCourse.percentage_completed = Math.ceil(
        (behaviorsCompletedCount / behaviorsCount) * 100
      );

      return newCourse;
    });

    newData.courses = coursesData;

    updatedUserData.push(newData);
  });

  return updatedUserData;
};

export default getSimpleUsersReportData;
