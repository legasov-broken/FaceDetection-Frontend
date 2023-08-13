import React, { Fragment, useEffect, useState } from "react";
import Header from "../sections/Header";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../styles/pages/UserDetail.scss";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { API_AI, API_URL } from "../API_URL";
import Loading from "../sections/Loading";
const UserDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [listPosition, setListPosition] = useState([]);
  // Handle file selection
  const handleFileChange = (event) => {
    handleUploadImg(event.target.files[0]);
  };


  useEffect(() => {
    setIsLoading(true);
    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/position/getall`);

        setListPosition(res.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchPositions();
  }, []);

  // Handle file upload
  const handleUploadImg = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Make a POST request to the server
      const response = await axios.post(
        `${API_URL}/api/user/uploadimg/${user?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updateFace = await axios.get(
        `${API_AI}/convert_vector/${user?.id}`
      );

      setIsLoading(false);

    } catch (error) {
      alert("Error updating");
      setIsLoading(false);
    }
  };
  const [userForm, setUserForm] = useState({
    fullname: user?.fullname,
    username: user?.username,
    password: user?.password,
    date: user?.date ? new Date(user?.date) : new Date(),
    mail: user?.mail,
    avatar: user?.avatar,
    phone: user?.phone,
    role: user?.role,
    salary: user?.salary,
    gender: user?.gender,
    position: user?.position?._id,
  });

  useEffect(() => {
    setUserForm({
      fullname: user?.fullname,
      username: user?.username,
      password: user?.password,
      date: user?.date ? new Date(user?.date) : new Date(),
      mail: user?.mail,
      avatar: user?.avatar,
      phone: user?.phone,
      role: user?.role,
      salary: user?.salary,
      gender: user?.gender,
      position: user?.position?._id,
    });
  }, [user]);


  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let newForm;
      if (!userForm.password) {
        const { password, ...form } = userForm;
        newForm = form;
      } else {
        newForm = userForm;
      }
      const res = await axios.put(
        `${API_URL}/api/user/update/${user?._id}`,
        newForm
      );
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      alert("Error updating");
    }
  };
  return (
    <Fragment>
      <Header />
      <div className="userDetails">
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <form className="form__img">
              <label className="input_field">
                {/* <span>Click to upload image</span> */}
                <img
                  src={`https://truongan912.s3.ap-southeast-1.amazonaws.com/${user?.id}.jpg`}
                  alt=""
                />
                <input
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => handleFileChange(e)}
                />
              </label>
            </form>
            <form>
              <div className="input_field">
                <input
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  value={user?.id}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="input_field">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  disabled
                  value={userForm.username}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="input_field">
                <input
                  type="text"
                  name="password"
                  id="password"
                  value={userForm?.password}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      password: e.target.value,
                    });
                  }}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="input_field">
                <input
                  type="text"
                  name="mail"
                  id="mail"
                  value={userForm?.mail}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      mail: e.target.value,
                    });
                  }}
                  required
                />
                <label htmlFor="main">Email</label>
              </div>
              <div className="input_field">
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  value={userForm?.fullname}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      fullname: e.target.value,
                    });
                  }}
                  required
                />
                <label htmlFor="fullname">Fullname</label>
              </div>
              <div className="input_field">
              <DatePicker selected={userForm?.date || undefined} onChange={(date) => setUserForm({
                    ...userForm,
                    date: date,
                  })} />
                
                <label htmlFor="date">Date</label>
              </div>
              <div className="input_field">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={userForm?.phone}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      phone: e.target.value,
                    });
                  }}
                  required
                />
                <label htmlFor="phone">Phone</label>
              </div>
              <div className="input_field">
                <select
                  value={userForm.position}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      position: e.target.value,
                    });
                  }}
                >
                  {listPosition
                    ? listPosition.map((item) => {
                      return <option value={item._id}>{item.name}</option>;
                    })
                    : null}
                </select>
                <label htmlFor="phone">Position</label>
              </div>
              <div className="input_field">
                <select
                  value={userForm.gender}
                  onChange={(e) => {
                    setUserForm({
                      ...userForm,
                      gender: e.target.value,
                    });
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label htmlFor="phone">Gender</label>
              </div>

              <div className="input_field">
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={user?.salary}
                  disabled
                />
                <label htmlFor="salary">Salary</label>
              </div>
              <div className="button__update" onClick={() => handleUpdate()}>
                Update
              </div>
            </form>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default UserDetail;
