import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { API_URL } from "../API_URL";
import Loading from "../sections/Loading";
import { useSelector } from "react-redux";
import "../styles/pages/Homepage.scss";
import { useParams } from "react-router-dom";

const Leave = () => {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [timesheetData, setTimesheetData] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    check_in: "",
    check_out: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/leave/${user?._id}`);
      setIsLoading(false);
      setDataTable(res.data.data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    }
  };

  const fetchTimesheet = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/timesheet/${id}`);
      setIsLoading(false);
      setTimesheetData(res.data.data); // Assuming the timesheet data is returned as an object
    } catch (error) {
      console.error("Failed to fetch timesheet:", error);
    }
  };


  useEffect(() => {
    if (user?._id) {
      fetchLeaves();
    }
    fetchTimesheet();
  }, [user, id]);

  useEffect(() => {
    // Set the initial values for the form when timesheetData is available
    if (timesheetData) {
      setLeaveForm({
        check_in: timesheetData.check_in,
        check_out: timesheetData.check_out,
        reason: "",
      });
    }
  }, [timesheetData]);

  const handleCreate = async () => {
    try {
      if (!user?._id) {
        alert("You need to login");
      } else {
        setIsLoading(true);
        const res = await axios.post(`${API_URL}/api/leave`, {
          user: user?._id,
          timesheet: id,
          ...leaveForm,
        });
        setIsLoading(false);
        alert("Successfully created leave");
      
      }
    } catch (error) {
      alert("Failed to create leave");
    }
  };

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


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If the date is not valid, return an empty string
      return "";
    }
    return new Date(dateString.slice(0, -1)).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="register chamcong">
      <Header />
      <div className="register__wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          id != 'all' ? <div className="register__form">
          <form>
            <h1>Report</h1>

            <div className="input_field">
              <input
                type="datetime-local"
                name="startTime"
                id="startTime"
                placeholder="Start time"
                required
                value={leaveForm.check_in ? leaveForm.check_in.slice(0, -1) : ""}
                onChange={(e) => {
                  setLeaveForm({
                    ...leaveForm,
                    check_in: e.target.value,
                  });
                }}
              />
            </div>
            <div className="input_field">
              <input
                type="datetime-local"
                name="leftTime"
                id="leftTime"
                value={leaveForm.check_out ? leaveForm.check_out.slice(0, -1) : ""}
                placeholder="Left time"
                required
                onChange={(e) => {
                  setLeaveForm({
                    ...leaveForm,
                    check_out: e.target.value,
                  });
                }}
              />
            </div>

            <div className="input_field">
              <textarea
                name="reason"
                placeholder="Reason"
                id="reason"
                onChange={(e) => {
                  setLeaveForm({
                    ...leaveForm,
                    reason: e.target.value,
                  });
                }}
                required
              ></textarea>
            </div>
          </form>

          <div className="login-sucess" onClick={() => {
            handleCreate()
            fetchLeaves()
          }}>
            Create Leave
          </div>
        </div> : null
        )}
      </div>

      <div className="chamcong__wrapper">
        <div className="chamcong__heading">
          <h1>List</h1>
        </div>

        <div className="chamcong__content">
          <div className="chamcong__content-heading">
            <div className="chamcong__time chamcong__heading-item">
              Time start
            </div>
            <div className="chamcong__time chamcong__heading-item">
              Time end
            </div>
            <div
              className="chamcong__time chamcong__heading-item"
              style={{
                width: "50%",
              }}
            >
              Reason
            </div>
            <div className="chamcong__time chamcong__heading-item">Status</div>
          </div>
          <div className="chamcong__content-table">
            {dataTable ? (
              dataTable.map((item, index) => {
                return (
                  <div className="chamcong__item" key={index}>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatTime(item.check_in)}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatTime(item.check_out)}
                    </div>
                    <div
                      className="chamcong__item-time chamcong__heading-item"
                      style={{
                        width: "50%",
                      }}
                    >
                      {item.reason}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      <span
                        className={`status ${
                          item.status === "Pending"
                            ? "status-pending"
                            : item.status === "Approved"
                            ? "status-approved"
                            : item.status === "Rejected"
                            ? "status-rejected"
                            : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No leaves found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
