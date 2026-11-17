
import { useEffect, useRef, useState } from 'react';
import './App.css';
import CustomAlert from './CustomAlert';
import Header from './Header';
import axios from "axios";

function App() {
  const [signFile,setSignFile]=useState(null)
  const [errors,setErrors]=useState({})
    const [images, setImages] = useState([]);
  const [disableFields,setDisableFields]=useState(false)
const alertRef = useRef();

useEffect(()=>{
if(signFile?.signFile){
  setErrors(null)
}
},[signFile])
      const handleChange = (e) => {
        if(e.target.name=='signFile'){
             const maxSizeInMB = 2;
  const allowedTypes = ['image/jpeg','image/jpg', 'image/png'];

  if (e.target.files[0] && !allowedTypes.includes(e.target?.files[0]?.type)) {
   alertRef.current.triggerAlert("Invalid file type","error"); 
    return;
  }

            setSignFile({[e.target.name]:e.target.files[0]})
            console.log(signFile)
        }
          
  };

   const getShortFileName = (fileName) => {
  if (!fileName) return 'Choose a file';
  const maxLength = 25;
  if (fileName.length <= maxLength) return fileName;

  const dotIndex = fileName.lastIndexOf('.');
  const name = fileName.slice(0, dotIndex);
  const ext = fileName.slice(dotIndex);
  const visibleChars = 18; // Adjust based on desired length

  return name.slice(0, visibleChars) + '...' + ext;
};


const handleClick=async(e)=>{
e.preventDefault();

         let newErrors = {};

  if (!signFile || signFile.signFile=="") {
    newErrors.signFile = true;
  }
   setErrors(newErrors);

  if (!(Object.keys(newErrors).length === 0)) {
    return;

  }
   setDisableFields(true)
   const formData = new FormData();
    formData.append("file", signFile.signFile); // key must match FastAPI parameter name

    try {
      const res = await axios.post(
        "http://localhost:8000/detect-signatures/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDisableFields(false)
if(res.data.signatures_found==0){
   alertRef.current.triggerAlert("signature not detected","error");

}
      // Extract crops (base64 strings)
      setImages(res.data.crops.map((c) => c.base64));
      console.log(res)
    } catch (err) {
      console.error(err);
      setDisableFields(false)
       alertRef.current.triggerAlert("Upload failed","error");
    }
}
  return (
    <>
    <CustomAlert ref={alertRef}></CustomAlert>
    <Header></Header>
   <div className='d-flex justify-content-center align-items-center' style={{position:"relative",top:"20px",right:"14px"}}>
<label
      style={{
        display: 'inline-block',
        padding: '0px 80px',
        border: `${signFile?'2px dashed #00a859':'2px dashed #999'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#555',
        textAlign: 'center',
          width: '275px',           /* fixed or max width */
         wordWrap: 'break-word',   // allow breaking long words
    overflow: 'auto',       // hide anything extra
    height: '80px',        // control height (optional)
    lineHeight: '1.2em', 
      wordBreak: 'break-word',   // break long words
    whiteSpace: 'normal'
      }}
    className={`d-flex justify-content-center align-items-center bank-proof-file-label ${errors?.signFile? 'is-invalid' : ''}`} >
      {signFile?.signFile?.name?getShortFileName(signFile.signFile.name):'Choose a file'}
      <input
        type="file"
        name='signFile'
        onChange={handleChange}
        style={{ display: 'none' }}
        accept=".jpeg, .jpg, .png"
          disabled={disableFields}
      />
    </label>
</div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  <button
    style={{
      width: "120px",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      backgroundColor:`${disableFields?"#898787ff":"#4CAF50"}` ,
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop:"10px"
    }}
    onClick={handleClick}
      disabled={disableFields}
  >
    PROCEED
  </button>
</div>
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  padding: "10px"
}}>
  {images.map((img, idx) => (
    <div key={idx} style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "120px",   // fixed small box
      background: "#fff"
    }}>
      <img
        src={`data:image/png;base64,${img}`}
        alt={`signature-${idx}`}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain"
        }}
      />
    </div>
  ))}
</div>


</>
  );
}

export default App;
