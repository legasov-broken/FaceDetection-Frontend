import React, { useEffect, useState } from 'react'
import Header from '../sections/Header'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/apiCall";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import Loading from '../sections/Loading'
import "../styles/pages/Login.scss"
const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
  });
  const accessToken = localStorage.getItem("accessToken");
  const user = useSelector((state) => state.user.user);
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const handleLogin = () => {
    login(dispatch, {
      username: userForm.username,
      password: userForm.password,
    });
  };
  useEffect(() => {
    if (accessToken) {
      navigator("/");
    }
  }, [accessToken]);
  return (
    <div className="login">
        <Header />
        <div className="login__wrapper">
          <div className="login__form">
          <form>
            <h1>Login</h1>
            <p>If you have an account with us, please sign in.</p>
                <div className="input_field">
          
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder='Username'
                    required
                    onChange={(e) => {
                      setUserForm({
                        ...userForm,
                        ["username"]: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="input_field">
                  
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder='Password'
                    onChange={(e) => {
                      setUserForm({
                        ...userForm,
                        ["password"]: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </form>

              
              {isLogin ? <Loading /> : <div className="login-sucess" onClick={() => handleLogin()}>Login</div>}
           
{/* 
            <div className="other-actions">
              <div>
                <Link
                  to={"/register"}
                  
                >
                  Create account
                </Link>
              </div>
            </div> */}
          </div>
        </div>
    </div>
  )
}

export default Login