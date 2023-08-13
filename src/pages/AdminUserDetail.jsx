import React, { Fragment, useEffect, useState } from "react";
import Header from "../sections/Header";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../styles/pages/UserDetail.scss";
import { useParams } from "react-router-dom";
import { API_URL } from "../API_URL";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const AdminUserDetail = () => {
  const user = useSelector((state) => state.user.user);
  const [listPosition, setListPosition] = useState([]);
  const [idImage, setIdImage] = useState("")
  const { id } = useParams();
  const [userForm, setUserForm] = useState({
    id: "",
    fullname: "",
    username: "",
    password: "",
    date: new Date(),
    mail: "",
    avatar: "",
    phone: "",
    role: "",
    salary: 0,
    gender: "",
    position: "",
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/position/getall`);

        setListPosition(res.data.data);
      } catch (error) {}
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/user/admin/account/${id}`,
          {
            admin: user?.role == "admin" ? true : false,
          }
        );

        setIdImage(res.data.user?.id)

        setUserForm({
          fullname: res.data.user?.fullname,
          username: res.data.user?.username,
          password: res.data.user?.password,
          date: new Date(res.data.user?.date),
          mail: res.data.user?.mail,
          avatar: res.data.user?.avatar,
          phone: res.data.user?.phone,
          role: res.data.user?.role,
          salary: res.data.user?.position?.salary,
          gender: res.data.user?.gender,
          position: res.data.user?.position?._id,
        });
      } catch (error) {}
    };

    fetchUser();
  }, [user]);

  const handleUpdate = async () => {
    try {
      let newForm;
      if (!userForm.password) {
        const { password, ...form } = userForm;
        newForm = form;
      } else {
        newForm = userForm;
      }
      const res = await axios.put(
        `${API_URL}/api/user/admin/update/${id}`,
        {
          ...newForm,
          admin: user?.role == "admin" ? true : false,
        }
      );
      alert("Updated");
    } catch (error) {
      alert("Error updating");
    }
  };

  return (
    <Fragment>
      <Header />
      <div className="userDetails">
        <form>
        <div className="input_field">
            <input
              type="text"
              name="username"
              id="username"
              disabled
              value={idImage}
            />
            <label htmlFor="username">Id</label>
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
          <DatePicker selected={userForm.date} onChange={(date) => setUserForm({
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
              <option disabled value="">
                None
              </option>
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
              value={userForm?.salary}
              disabled
            />
            <label htmlFor="salary">Salary</label>
          </div>
          <div className="button__update" onClick={() => handleUpdate()}>
            Update
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AdminUserDetail;
