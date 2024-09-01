import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
    // Set all useState variables for the different functions
    const navigate = useNavigate();
    const [file, setFile] = useState("");
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState("");
    const [uploadData, setUploadData] = useState([]);
    const [userData, setUserData] = useState([]);

    // Get variables from local storage to determine what content to show the user
    let authToken = '';
    let isAdmin = '';
    if(localStorage.getItem('authToken') !== undefined){
       authToken = localStorage.getItem('authToken');
    }  else {
       console.log("not authenticated");
    }
    if(localStorage.getItem('role') === 'admin'){
	    isAdmin = true;
    } else {
	    isAdmin = false;
    }
    // Handles the video upload
    const onSubmit = async (e) => {
        e.preventDefault();

	// Set the form data, the video to convert in this case
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        try {
	    // Send upload request with the video in the form and the authorization token recieved from login page 
            const res = await axios.post("http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/videos/uploads/upload", formDataFile, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${authToken}`,
                },
            });
	    // If successful, displays the uploaded video and confirmation message 
            const fileName = res.data.fileName;
            const filePath = res.data.filePath;
            setUploadedFile({ fileName, filePath });
            setMessage("File successfully uploaded");
        } catch (err) {
	    // Handle errors
            if (err.response && err.response.status === 500) {
                setMessage("There was a problem with the server");
            } else {
                setMessage(err.response?.data?.msg || "Error uploading file");
            }
        }
    };

    // Get uploaded files
    useEffect(() => {
        const getUploads = async () => {

        try {
	   // If the role of the user is 'user', then send an authorized request for the uploads associated with that user
           if(localStorage.getItem('role') === 'user' && localStorage.getItem('user_id') !== undefined){
                const user_id = localStorage.getItem('user_id');
                const res = await axios.get(`http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/users/uploads/${user_id}`, {
                	headers: {
                    		"Content-Type": "application/json",
                    		"Authorization": `Bearer ${authToken}`,
                	},
                });
		// If successful, store in uploadData to display to the user
                if(res.status === 200){
            		setUploadData(res.data)
            	}
            } else {
		// Otherwise, the role is admin, so all upload data is retrieved instead
		const res = await axios.get("http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/videos/uploads", {
			headers: {
				"Content-Type": "application/json",
                		"Authorization": `Bearer ${authToken}`,
			},
		});

                if(res.status === 200){
			setUploadData(res.data);
                }

	    }
            	setMessage("Upload Data Retrieved");

	    } catch (err) {
		// Handle errors
                if (err.response && err.response.status === 500) {
                    setMessage("There was a problem with the server");
                } else {
                    setMessage(err.response?.data?.msg || "Error fetching upload data");
                }
            }
        };
        getUploads();
    }, []);

// Fetch User data
useEffect(() => {
        const getUser = async () => {
        try {
	   // If the role of the user is 'user', then send an authorized request for that user's profile data
           if(localStorage.getItem('role') === 'user' && localStorage.getItem('user_id') !== undefined){
                const user_id = localStorage.getItem('user_id');
                const res = await axios.get(`http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/users/select/${user_id}`, {
                	headers: {
                    		"Content-Type": "application/json",
                    		"Authorization": `Bearer ${authToken}`,
                	},
                });

                if(res.status === 200){
            		setUserData(res.data)
            	}
            } else {
		// Otherwise, since the user is an admin, display a brief overview of all user's data
		const res = await axios.get("http://ec2-52-65-40-9.ap-southeast-2.compute.amazonaws.com:8080/users", {
			headers: {
				"Content-Type": "application/json",
			},
		});

                if(res.status === 200){
			setUserData(res.data);
                }

	    }

            	setMessage("User Data Retrieved");

	    } catch (err) {
		// Handle errors
                if (err.response && err.response.status === 500) {
                    setMessage("There was a problem with the server");
                } else {
                    setMessage(err.response?.data?.msg || "Error fetching user data");
                }
            }
        };
        getUser();
    }, []);

    // File input change
    const onChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (

        <div className="App">
        <button onClick={() => navigate('/login')} className='signOutBtn'>Sign out</button>
	    <h1>Video Transcoder</h1>
	    
	    <h2>{userData ? `Logged in as: ${userData.firstName}` : "Not logged in"} </h2>

	    
	    <div className='upload-container'>
                <h2>Upload a video file</h2>
                <h5>Supported formats: MP4, AVI, MOV, WebM, etc.</h5>
                <form onSubmit={onSubmit}>
                    <div className="upload-file">
                        <input
                            type="file"
                            className="file-input"
                            id="customFile"
                            accept="video/*"
                            onChange={onChange}
                            required
                        />
                        <br></br>
                        <label className="custom-file-label">
                        <br></br>
                           {file.name ? ("File:",file.name) : "Upload a file..."}
                           <br></br>
                        </label>
                    
                    
                    <br></br>
                    <input type="submit" value="Upload" className="submitBtn" />
                    </div>
                </form>

                {message && <p>{message}</p>}
            </div>
	<br></br>

	
        <h2>User Info</h2>
	
        {uploadData && uploadData.length > 0 ? (
        <div className = 'user-container'>
		
		{isAdmin ? (
                <table>
                    <thead> 
                        <tr>
                            <th></th><th>User data overview</th><th></th>
                        </tr>
                        <tr>
                        <th>ID</th><th>Email</th><th>First Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((data, index) => (
                            <tr key={index}>
                                <td>{data._id}</td>
                                <td>{data.email}</td>
                                <td>{data.firstName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
		
                
                <table>
             <tr>
			 <td><h3>Account info</h3></td><td></td>
		     </tr>
		     <tr>
			 <td>Email</td> <td>{userData.email}</td>
		     </tr>
             <tr>
			 <td>Name</td> <td>{userData.firstName}</td>
		     </tr>
             <tr>
			 <td>Last Name</td> <td>{userData.familyName}</td>
		     </tr>
		</table>
            )}
	    </div>
        ): (
            <div className="user-container">
                <h3>Sign in to display user info</h3>
            </div>
        )}
		
        {uploadData && uploadData.length > 0 ? (
            <div className="uploads-container">
		<h2>Uploaded Files</h2>
        
                <table>
                    <thead>
                        <tr>
                            <th></th><th>{isAdmin ? "All uploads by users" : "Your uploaded files"}</th><th></th>
                        </tr>
                        <tr>
                        <th>Video ID</th><th>User ID</th><th>Time uploaded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.video_id}</td>
                                <td>{data.user_id}</td>
                                <td>{data.time_uploaded}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
        
            </div>
            ): (
                <div className="uploads-container">
                    <h3>Sign in to display uploads</h3>
                </div>
            )}
        </div>
    );
}

export default Upload;
