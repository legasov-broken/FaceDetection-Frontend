import { API_URL } from "../API_URL";
import { loginStart, loginSuccess, loginFailure } from "./slice/userSlice";
import axios from "axios";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      username: user.username,
      password: user.password,
    });
    dispatch(loginSuccess(res.data.user));
    console.log(res.data);
    localStorage.setItem("accessToken", res.data.token.accessToken);
    alert("Đăng nhập thành công");
  } catch (error) {
    dispatch(loginFailure());
    alert("Đăng nhập thất bại");
  }
};

export const register = async (dispatch, user) => {
  try {
    const res = await axios.post(`${API_URL}/api/user/create`, {
      fullname: user.fullname,
      username: user.username,
      password: user.password,
      date: user.date,
      mail: user.mail,
      gender: user.gender,
      avatar: user.avatar,
      role: user.role,
      phone: user.phone,
      salary: user.salary,
      admin: user.admin,
    });
    alert("Tạo tài khoản thành công");
  } catch (error) {
    alert("Tạo tài khoản thất bại");
  }
};

export const getDataFromAccessToken = async (dispatch, accessToken) => {
  dispatch(loginStart());
  try {
    const res = await axios.get(`${API_URL}/api/user/account`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(loginSuccess(res.data.user));
  } catch (error) {
    dispatch(loginFailure());
    localStorage.removeItem("accessToken");
    alert("Đăng nhập thất bại");
  }
};
