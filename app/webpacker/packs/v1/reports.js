import "whatwg-fetch";
import "core-js/features/promise";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import classNames from "classnames";
import Chart from "react-apexcharts";
import DateRangePicker from "react-daterange-picker";
import format from "date-fns/format";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { fetchStatus } from "../../js/util";

const moment = extendMoment(Moment);

const lineOptions = {
  chart: {
    type: "area",
  },
  stroke: {
    curve: "straight",
    width: 3,
  },
  xaxis: {
    type: "datetime",
    labels: {
      formatter: (_value, timestamp) => format(timestamp, "M/dd"),
    },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    labels: {
      formatter: (value) => parseInt(value, 10),
    },
  },
  title: {
    offsetX: 0,
    style: {
      fontSize: "24px",
      cssClass: "apexcharts-yaxis-title",
    },
  },
  subtitle: {
    offsetX: 0,
    style: {
      fontSize: "14px",
      cssClass: "apexcharts-yaxis-title",
    },
  },
};

const moneyLineOptions = {
  ...lineOptions,
  yaxis: {
    ...lineOptions.yaxis,
    labels: {
      formatter: (value) => `$${value / 100}`,
    },
  },
};

const sparkLineOptions = {
  ...lineOptions,
  chart: { ...lineOptions.chart, sparkline: { enabled: true } },
};

const moneySparkLineOptions = {
  ...sparkLineOptions,
  yaxis: {
    ...sparkLineOptions.yaxis,
    labels: {
      formatter: (value) => `$${value / 100}`,
    },
  },
};

const Dashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [registrationsData, setRegistrationsData] = useState(null);
  const [modulesData, setModulesData] = useState(null);
  const [courseData, setcourseData] = useState([]);

  useEffect(() => {
    fetch("/admin/program/reports/sales")
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ labels, series, title, subtitle }) => {
        const data = {
          ...moneySparkLineOptions,
          labels,
          series,
          title: { ...moneySparkLineOptions.title, text: title.text },
          subtitle: {
            ...moneySparkLineOptions.subtitle,
            text: subtitle.text,
          },
        };
        setSalesData(data);
      });

    fetch("/admin/program/reports/registrations")
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ labels, series, title, subtitle }) => {
        const data = {
          ...sparkLineOptions,
          labels,
          series,
          title: { ...sparkLineOptions.title, text: title.text },
          subtitle: {
            ...sparkLineOptions.subtitle,
            text: subtitle.text,
          },
        };
        setRegistrationsData(data);
      });

    fetch("/admin/program/reports/module_views")
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ labels, series, title, subtitle }) => {
        const data = {
          ...sparkLineOptions,
          labels,
          series,
          title: { ...sparkLineOptions.title, text: title.text },
          subtitle: {
            ...sparkLineOptions.subtitle,
            text: subtitle.text,
          },
        };
        setModulesData(data);
      });

    fetch("/admin/program/reports/courses")
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then((data) => setcourseData(data));
  }, []);

  const courseList = courseData.map((course) => (
    <tr key={course.id}>
      <td className="py-4 px-8">{course.title}</td>
      <td className="py-4 px-8 text-center">{course.percent_complete}</td>
      <td className="py-4 px-8 text-center">{course.sales}</td>
      <td className="py-4 px-8 text-center">{course.views}</td>
    </tr>
  ));

  return (
    <div className="pt-12 pb-16 lg:max-w-3/4">
      <div className="flex flex-col md:flex-row items-center md:mb-16 md:-mx-8">
        <div className="flex-1 mb-16 md:mb-0 md:mx-8">
          {salesData && (
            <Link to="sales">
              <Chart
                type="area"
                series={salesData.series}
                height={sparkLineOptions.chart.height}
                options={salesData}
              />
            </Link>
          )}
        </div>
        <div className="flex-1 mb-16 md:mb-0 md:mx-8">
          {registrationsData && (
            <Link to="registrations">
              <Chart
                type="area"
                series={registrationsData.series}
                height={sparkLineOptions.chart.height}
                options={registrationsData}
              />
            </Link>
          )}
        </div>
        <div className="flex-1 mb-16 md:mb-0 md:mx-8">
          {modulesData && (
            <Link to="module_views">
              <Chart
                type="area"
                series={modulesData.series}
                height={sparkLineOptions.chart.height}
                options={modulesData}
              />
            </Link>
          )}
        </div>
      </div>

      <table className="w-full striped-table hidden md:table">
        <thead>
          <tr>
            <th className="px-8 text-left">Course</th>
            <th className="px-8">Percent Completed</th>
            <th className="px-8 w-48">
              Sales
              <br />
              (Past Week)
            </th>
            <th className="px-8 w-48">
              Module Views
              <br />
              (Past Week)
            </th>
          </tr>
        </thead>
        <tbody>{courseList}</tbody>
      </table>
    </div>
  );
};

const Report = ({ match }) => {
  const start = moment().subtract(6, "days").startOf("day");
  const end = moment().startOf("day");
  const startRange = moment.range(start, end);
  const [dates, setDates] = useState(startRange);
  const [calendarHidden, setCalendarHidden] = useState(true);
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    fetch(
      `/admin/program/reports/${match.params.report}?start=${dates.start.format(
        "YYYY-MM-DD"
      )}&end=${dates.end.format("YYYY-MM-DD")}`
    )
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ labels, series, title }) => {
        const data = {
          ...moneyLineOptions,
          labels,
          series,
          title: {
            ...moneyLineOptions.title,
            text: `${series[0].name}: ${title.text}`,
          },
        };
        setSalesData(data);
      });
  }, [dates]);

  return (
    <div className="relative pt-12 pb-16">
      <div className="flex items-center mb-8 -mx-2">
        <p className="mx-2 text-sm">Date Range:</p>
        <div className="w-32 mx-2">
          <input
            type="text"
            className="w-full p-2 text-sm border"
            onFocus={() => setCalendarHidden(false)}
            value={dates.start.format("ll")}
          />
        </div>
        <div className="w-32 mx-2">
          <input
            type="text"
            className="w-full p-2 text-sm border"
            onFocus={() => setCalendarHidden(false)}
            value={dates.end.format("ll")}
          />
        </div>
      </div>
      <div
        className={classNames("absolute", "bg-white", "shadow-md", "z-10", {
          hidden: calendarHidden,
        })}
      >
        <DateRangePicker
          numberOfCalendars={2}
          singleDateRange
          value={dates}
          onSelect={(selectedDates) => {
            setDates(selectedDates);
            setCalendarHidden(true);
          }}
        />
      </div>
      <div>
        {salesData && (
          <Chart
            type="line"
            height="500"
            series={salesData.series}
            options={salesData}
          />
        )}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Dashboard} />
      <Route path="/:report" component={Report} />
    </div>
  </Router>
);

render(<App />, document.getElementById("reports-dashboard"));
