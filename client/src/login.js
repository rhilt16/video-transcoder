import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function Login() {
    const [message, setMessage] = useState("Login");

    // Create OnSubmit function
    const onSubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("emailInput");
        const password = document.getElementById("passwordInput");
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        console.log(formData);
        try {
            const res = await axios.post("http://ec2-54-252-242-85.ap-southeast-2.compute.amazonaws.com:8080/users/login", {
                headers: {
                    "Content-Type": "multipart/form-data",
                }, data: {
                   "data": formData
                }
            });
            const authToken = res.data;
            setMessage("successfully authenticated");
        } catch (err) {
            if (err.response && err.response.status === 500) {
                setMessage("There was a problem with the server");
            } else {
                setMessage(err.response?.data?.msg || "Error uploading file");
            }
        }
    };

    return (
        <div className="App">

           <div className="login-container">
              <h1>Login</h1>

              <form onSubmit={onSubmit}>
                 <input type="text" className="text-input" id="emailInput" placeholder="email" />
                 <input type="text" className="text-input" id="passwordInput" placeholder="Password" />
                 <input type="submit" value="Login" />
              </form>

           
           <p>{message}</p>
           </div>

        </div>
    );
}

export default Login;
