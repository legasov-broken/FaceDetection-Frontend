import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/pages/Homepage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../API_URL";
const AdminStatistical = () => {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [total, setTotal] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [dataMember, setDataMember] = useState();
  const user = useSelector((state) => state.user.user);

  const { id } = useParams();

  const fetchData = async () => {
    const bodyData = {
      id: id,
    };
    if (month) {
      bodyData.month = Number(month);
    }

    if (year) {
      bodyData.year = Number(year);
    }
    const data = await axios.post(
      `${API_URL}/api/timesheet/admin/getbyid`,
      bodyData
    );
    setDataTable(data.data.data);
    setDataMember(data.data.user);
    const totalSalary = data.data.data.reduce((total, item) => {
      const checkIn = new Date(item.check_in);
      const checkOut = new Date(item.check_out);
      const duration = (checkOut - checkIn) / (1000 * 60 * 60); // Duration in hours
      const salary = duration * data.data.user?.position?.salary;
      return total + salary;
    }, 0);

    setTotal(totalSalary);
  };

  const handleThongke = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  console.log(dataMember);
  return (
    <div className="chamcong">
      <Header />
      <div className="chamcong__wrapper">
        <div className="chamcong__heading">
          <h1>Bang cham cong</h1>
          <div className="chamcong__heading-inputs">
            <h2>Chon thoi gian</h2>
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
            <button onClick={() => handleThongke()}>Thong ke</button>
          </div>
        </div>

        <div className="chamcong__content">
          <div className="chamcong__content-heading">
            <div className="chamcong__time chamcong__heading-item">Ngay</div>
            <div className="chamcong__time chamcong__heading-item">
              Gio bat dau
            </div>
            <div className="chamcong__time chamcong__heading-item">
              Gio ket thuc
            </div>
            <div className="chamcong__time chamcong__heading-item">
              So gio lam viec
            </div>

            <div className="chamcong__salary chamcong__heading-item">
              Luong theo gio
            </div>

            <div className="chamcong__total chamcong__heading-item">Tong</div>
          </div>

          <div className="chamcong__content-table">
            {dataTable
              ? dataTable.map((item, index) => {
                  let date = `${new Date(item?.check_in).getDate()}/${
                    new Date(item?.check_in).getMonth() + 1
                  }/${new Date(item?.check_in).getFullYear()}`;
                  let timeStart = `${new Date(
                    item?.check_in
                  ).getHours()}:${new Date(
                    item?.check_in
                  ).getMinutes()}:${new Date(item?.check_in).getSeconds()}`;
                  let timeFinish = `${new Date(
                    item?.check_out
                  ).getHours()}:${new Date(
                    item?.check_out
                  ).getMinutes()}:${new Date(item?.check_out).getSeconds()}`;
                  let checkIn = new Date(item?.check_in);
                  let checkOut = new Date(item?.check_out);
                  let timeDifferenceMs = checkOut.getTime() - checkIn.getTime();
                  let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

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
                        {dataMember?.position?.salary.toLocaleString("en-US")}
                      </div>

                      <div className="chamcong__item-total chamcong__heading-item">
                        {Number(
                          (
                            timeDifferenceHours * dataMember?.position?.salary
                          ).toFixed(0)
                        ).toLocaleString("en-US")}
                      </div>
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

              <div className="chamcong__item-total chamcong__heading-item">
                {Number(total.toFixed(0)).toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistical;
