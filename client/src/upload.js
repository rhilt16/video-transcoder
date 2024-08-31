import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function Upload() {
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("Choose File");
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState("");
    const [uploadData, setUploadData] = useState([]);

    let authToken = '';

    if(localStorage.getItem('authToken') !== undefined){
       authToken = localStorage.getItem('authToken');
    }  else {
       console.log("not authenticated");
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post("http://ec2-13-54-107-150.ap-southeast-2.compute.amazonaws.com:8080/videos/uploads/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${authToken}`,
                },
            });
            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
            setMessage("File Uploaded");
        } catch (err) {
            if (err.response && err.response.status === 500) {
                setMessage("There was a problem with the server");
            } else {
                setMessage(err.response?.data?.msg || "Error uploading file");
            }
        }
    };

    // Fetch uploaded files
    useEffect(() => {
        const getUploads = async () => {

            try {
            if(localStorage.getItem('user_id') !== undefined){
                const user_id = localStorage.getItem('user_id');
                const res = await axios.get(`http://ec2-13-54-107-150.ap-southeast-2.compute.amazonaws.com:8080/users/uploads/${user_id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                });
                if(res.status === 200){
            setUploadData(res.data)
            console.log(res.data)
            }
        }
                setMessage("Upload Data Retrieved");
            } catch (err) {
                if (err.response && err.response.status === 500) {
                    setMessage("There was a problem with the server");
                } else {
                    setMessage(err.response?.data?.msg || "Error fetching upload data");
                }
            }
        };
        getUploads();
    }, []);

    // Handle file input change
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    return (
        <div className="App">
            <div className='upload-container'>
                <h1>Video transcode</h1>
                <h2>Upload a video file</h2>
                <h5>Supported formats: ?</h5>
                <form onSubmit={onSubmit}>
                    <div className="custom-file mb-4">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            accept="video/*"
                            onChange={onChange}
                            required
                        />
                        <label className="custom-file-label" htmlFor="customFile">
                            {filename}
                        </label>
                    </div>

                    <input
                        type="submit"
                        value="Upload"
                        className="btn btn-primary btn-block mt-4"
                    />
                </form>

                {message && <p>{message}</p>}
                {uploadedFile.fileName && (
                    <div className="row mt-5">
                        <div className="col-md-6 m-auto">
                            <h3 className="text-center">{uploadedFile.fileName}</h3>
                            <video style={{ width: "100%" }} controls>
                                <source src={uploadedFile.filePath} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                )}
            </div>

            <div className="uploads-container">
                <table>
                    <thead>
                        <tr>
                            <th>Uploaded Files</th>
                        </tr>
                        <tr>
                        <td>Video ID</td><td>Time uploaded</td>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.video_id}</td>
                                <td>{data.time_uploaded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Upload;
