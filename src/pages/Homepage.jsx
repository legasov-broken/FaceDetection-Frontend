import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/pages/Homepage.scss";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../API_URL";
import Loading from "../sections/Loading";
const Homepage = () => {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [total, setTotal] = useState(0);
  const [lateMoney, setLateMoney] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const user = useSelector((state) => state.user.user);
  const fetchData = async () => {
    setIsLoading(true);
    const bodyData = {
      id: user?.id,
    };
    if (month) {
      bodyData.month = Number(month);
    }

    if (year) {
      bodyData.year = Number(year);
    }

    const data = await axios.post(`${API_URL}/api/timesheet/getbyid`, bodyData);
    const fetchLateData = await axios.get(`${API_URL}/api/late`)
    setLateMoney(fetchLateData.data.data.money)
    setDataTable(data.data.data);
    const totalSalary = data.data.data.reduce((total, item) => {
      const checkIn = new Date(item.check_in);
      const checkOut = new Date(item.check_out);
      const duration = (checkOut - checkIn) / (1000 * 60 * 60); // Duration in hours
      const salary = duration * user?.position?.salary;
      const lateArrival = new Date(item?.check_in).getHours() > 8 ? (new Date(item?.check_in).getHours() - 8) * 20000 : 0;
      return total + salary - lateArrival;
    }, 0);

    setTotal(totalSalary);

    setIsLoading(false);
  };

  const handleThongke = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If the date is not valid, return an empty string
      return "";
    }
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <div className="chamcong">
      <Header />
      <div className="chamcong__wrapper">
        <div className="chamcong__heading">
          <h1>Timesheets</h1>
          <div className="chamcong__heading-inputs">
            <h2>Choose time</h2>
            <label htmlFor="month">
              <span>Month</span>
              <input
                type="number"
                name="month"
                value={month ? month : 0}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>

            <label htmlFor="year">
              <span>Year</span>
              <input
                type="number"
                name="year"
                value={year ? year : 0}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                setMonth();
                setYear();
                handleThongke();
              }}
            >
              Reset
            </button>
            <button onClick={() => handleThongke()}>Search</button>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="chamcong__content">
            <div className="chamcong__content-heading">
              <div className="chamcong__time chamcong__heading-item">Date</div>
              <div className="chamcong__time chamcong__heading-item">
                Start time
              </div>
              <div className="chamcong__time chamcong__heading-item">
                Time ends
              </div>
              <div className="chamcong__time chamcong__heading-item">
                Working hours
              </div>

              <div className="chamcong__salary chamcong__heading-item">
                Hourly
              </div>

              <div className="chamcong__salary chamcong__heading-item">
                Late
              </div>

              <div className="chamcong__total chamcong__heading-item">
                Total
              </div>

              <div className="chamcong__total chamcong__heading-item">
                Button
              </div>
            </div>

            <div className="chamcong__content-table">
              {dataTable
                ? dataTable.map((item, index) => {
                  let date = item.check_in ? new Date(item.check_in.slice(0, -1)).toLocaleDateString("en-US") : "";
                  let timeStart = item.check_in ? new Date(item.check_in.slice(0, -1)).toLocaleTimeString("en-US") : "";
                  let timeFinish = item.check_out ? new Date(item.check_out.slice(0, -1)).toLocaleTimeString("en-US") : "";
                  let checkIn = new Date(item?.check_in);
                  let checkOut = new Date(item?.check_out);
                  let timeDifferenceMs = checkOut.getTime() - checkIn.getTime();
                  let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
                  const checkInHours = new Date(item.check_in.slice(0, -1)).getHours();
                  const lateArrival =
                    checkInHours > 8
                      ? (checkInHours - 8) * lateMoney
                      : 0;
                    return (
                      <div className="chamcong__item" key={index}>
                        <div className="chamcong__item-time chamcong__heading-item">
                          {date}
                        </div>
                        <div className="chamcong__item-time chamcong__heading-item">
                          {timeStart}
                        </div>
                        <div className="chamcong__item-time chamcong__heading-item">
                          {timeFinish}
                        </div>

                        <div className="chamcong__item-sogio chamcong__heading-item">
                          {timeDifferenceHours.toFixed(2)}
                        </div>

                        <div className="chamcong__item-salary chamcong__heading-item">
                          {user?.position?.salary.toLocaleString("en-US")}
                        </div>

                        <div className="chamcong__item-salary chamcong__heading-item">
                          { lateArrival}
                        </div>

                        <div className="chamcong__item-total chamcong__heading-item">
                          {Number(
                            (
                              timeDifferenceHours * user?.position?.salary -
                              lateArrival
                            ).toFixed(0)
                          ).toLocaleString("en-US")}
                        </div>

                        <Link to={`/leave/${item._id}`} className="chamcong__item-total chamcong__heading-item" >
                          Report
                        </Link>
                      </div>
                    );
                  })
                : null}

              <div className="chamcong__item">
                <div className="chamcong__item-time chamcong__heading-item"></div>

                <div className="chamcong__item-sogio chamcong__heading-item"></div>

                <div className="chamcong__item-salary chamcong__heading-item"></div>
                <div className="chamcong__item-salary chamcong__heading-item"></div>
                <div className="chamcong__item-salary chamcong__heading-item"></div>
                <div className="chamcong__item-salary chamcong__heading-item"></div>
                <div className="chamcong__item-total chamcong__heading-item">
                  {Number(total.toFixed(0)).toLocaleString("en-US")}
                </div>
                <div className="chamcong__item-salary chamcong__heading-item"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
