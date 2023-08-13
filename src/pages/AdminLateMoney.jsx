import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../API_URL'
import Header from '../sections/Header'
import Loading from '../sections/Loading'

const AdminLateMoney = () => {
    const [data, setData] = useState()
    const [money, setMoney] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const updateData = async (money) => {
        setIsLoading(true)
       try {
        const fetch = await axios.put(`${API_URL}/api/late`, {
            money: money
        })
        alert("Update success")
        setIsLoading(false)
       } catch (error) {
        alert("Update failure")
        setIsLoading(false)
       }
    }

    const getData = async () => {
        setIsLoading(true)
        try {
         const fetch = await axios.get(`${API_URL}/api/late`)
         setData(fetch.data)
         setMoney(fetch.data.data.money)
         setIsLoading(false)
        } catch (error) {
         alert("Get failure")
         setIsLoading(false)
        }
     }

     useEffect(() =>{
        getData()
     },[])

     console.log(money)
  return (
    <div className="register">
    <Header />
    <div className="register__wrapper">
      {isLoading ? <Loading /> :<div className="register__form">
        <form>
          <h1>Late</h1>

          <div className="input_field">
            <input
              type="number"
              name="name"
              id="name"
              placeholder="Late money"
              required
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            />
          </div>

        </form>

        <div className="login-sucess" onClick={() => updateData(money)}>
          Update
        </div>
      </div>}
    </div>
  </div>
  )
}

export default AdminLateMoney
