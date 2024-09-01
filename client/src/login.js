import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    // The message useState used for error testing and development
    const [message, setMessage] = useState("Login");
    // Navigate used for redirecting to the uploads page upon successful login
    const navigate = useNavigate();
    if(localStorage.getItem('authToken')){
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');
    }

    // Handles the login submit
    const onSubmit = async (e) => {
        e.preventDefault();
	// Get the login data from the form and append it to formData 
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
	   // Send login request, and store the response in the necessary parts
           const res = await axios.post("http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/users/login", formData);
           const authToken = res.data.authenticationToken;
           const user_id = res.data.payload.user_id;
           const role = res.data.payload.role;
	   // Set the success message, and store the response parts in local storage for later use
           setMessage("successfully authenticated");
	   
	   if(localStorage.getItem('authToken')){
              localStorage.removeItem('authToken');
              localStorage.removeItem('user_id');

           }
           localStorage.setItem('authToken', authToken);
           localStorage.setItem('user_id', user_id);
           localStorage.setItem('role', role);
	   // Once login is complete, navigate to next page
	   navigate('/upload');
        } catch (err) {
	    // Handle errors
            if (err.response && err.response.status === 500) {
                setMessage("There was a problem with the server");
            } else {
                setMessage(err.response?.data?.msg || "Error logging in");
            }
        }
    };
    // Basic login page
    return (
        <div className="App">

           <div className="login-container">
              <h1>Account Login </h1>

              <form onSubmit={onSubmit}>
                 <input type="text" className="text-input" id="emailInput" placeholder="email" />
                 <br></br>
                 <input type="text" className="text-input" id="passwordInput" placeholder="Password" />
                 <br></br>
                 <input type="submit" value="Login" />
              </form>

           </div>

        </div>
    );
}

export default Login;
