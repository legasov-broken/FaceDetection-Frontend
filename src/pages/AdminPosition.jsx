import React, { useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { API_URL } from "../API_URL";
import Loading from "../sections/Loading"
const AdminPosition = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userForm, setUserForm] = useState({
    name: "",
    salary: "",
  });

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${API_URL}/api/position/create`,
        userForm
      );
      setIsLoading(false)
      alert("Tạo chuc vu thành công");
    } catch (error) {
        alert("Tạo chuc vu thất bại");
    }
  };
  return (
    <div className="register">
      <Header />
      <div className="register__wrapper">
        {isLoading ? <Loading /> :<div className="register__form">
          <form>
            <h1>Create an position</h1>

            <div className="input_field">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                required
                onChange={(e) => {
                  setUserForm({
                    ...userForm,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="input_field">
              <input
                type="text"
                name="salary"
                placeholder="salary"
                id="salary"
                onChange={(e) => {
                  setUserForm({
                    ...userForm,
                    salary: e.target.value,
                  });
                }}
                required
              />
            </div>
          </form>

          <div className="login-sucess" onClick={() => handleCreate()}>
            Tao chuc vu
          </div>
        </div>}
      </div>
    </div>
  );
};

export default AdminPosition;
