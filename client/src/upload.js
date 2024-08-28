import './App.css';
// Import axios to post Request
import axios from 'axios'
// Create State for variables
import { useState} from 'react';


function Upload() {
    console.log("die");
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("Choose File");
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState("");
    const [uploadData, setUploadData] = useState("uploadData");

 // Create OnSubmit function
 const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8080/videos/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }

    }
  };

 const getUploads = async (e) => {
    try {
     const res = await axios.get("http://localhost:8080/videos/uploads", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadData(res.data);
      setMessage("Upload Data");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }

    }
  };
getUploads();
  // Create OnChange Event for Input Box
 const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    console.log(filename);  
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
        </div>

        <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block mt-4"
        />
    </form>

  {message? <p> msg={message} </p> : null}
Uploaded File:
  {uploadedFile.fileName? <p> msg={uploadedFile.filePath} </p> : null}
  
  {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </div>
    <div className = "uploads-container">
    <table>
    <tr><td>{uploadData}</td></tr>
    </table>
    </div>
    </div>

  );
}

export default Upload;
