import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/sections/Header.scss";
import { getDataFromAccessToken } from "../store/apiCall";
const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const userLocal = localStorage?.getItem("accessToken");
    if (!user) {
      if (userLocal) {
        getDataFromAccessToken(dispatch, userLocal);
      }
    }
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };
  return (
    <div className="header">
      <div className="header__navigation">
        <a href="/">Timesheets</a>
        <a href="/leave/all">Report</a>
        { user?.role === "admin" ? <a href="/admin/list-member/all">List employee</a> : null}
        {user?.role === "admin" ? <a href="/register" className="header__account">
            Create account
          </a> : null}  

          {user?.role === "admin" ? <a href="/admin/position" className="header__account">
            Create role
          </a> : null}  

          {user?.role === "admin" ? <a href="/admin/leave" className="header__account">
           Report manage
          </a> : null}  

          {user?.role === "admin" ? <a href="/late" className="header__account">
           Late money manage
          </a> : null}  
      </div>

      <div className="header__buttons">
        {!user ? (
          <Fragment>
            <a className="header__account" href="/login">
            Login
          </a>
          </Fragment>
        ) : (
          <div className="header__user">
            <a href={`/account`}>{user.username}</a>
            <div
              className="header__logout"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
