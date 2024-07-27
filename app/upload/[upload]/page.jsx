'use client'
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Styles from './Components/page.module.css';
import Loader from "@/app/loader/page";
import HandelUploadSubmit from './Components/upload';
import TakeSelfi from './Components/takeselfi';
import StoreSelfieData from './Components/selfiedata';
export default function YourComponent({ params }) {
  const [selfie, setSelfie] = useState(null);
  const [loadeer,loadderevalue] = useState(false);
  const [captureselfi,captureselfivalue] = useState(false);
  
  const HandelSubmit = async (name,email,phno) => {

      loadderevalue(true)
      const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 5000, timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer;}});
      
      const Array = {"email": email, "phno": phno, "name": name};
      console.log(Array,"Arr",params.upload)
      const setSelfieData = await StoreSelfieData(Array,params.upload)
      console.log(setSelfieData,"AHH")
      
      const message = await HandelUploadSubmit(Array,selfie,params.upload,name);
      if(message){Toast.fire({icon: 'success',title: 'Selfie Successfuly Uploaded ...'});
      setSelfie(null);
      loadderevalue(false)}else{
      Toast.fire({icon: 'error',title: 'Error during form submission'});
      loadderevalue(false)}
  };

  return (
    <>
    {loadeer?<Loader/>:""}
    <div className={Styles.MainContainer}>
      <div className={Styles.container}>
        <div className={Styles.title}>Anthill Networks</div>
        <div className={Styles.subtitle}>AI Photo Tool Registration</div>
        <form onSubmit={(e)=>{e.preventDefault();HandelSubmit(e.target.UserName.value,e.target.UserEmail.value,e.target.UserPhno.value)}}>
          <div className={Styles.marginbottom}>
            <label className={Styles.formlabel}>Name</label>
            <input type="text" name='UserName' className={Styles.forminput} required/>
          </div>
          <div className={Styles.marginbottom}>
            <label className={Styles.formlabel}>Email</label>
            <input type="email" name='UserEmail' className={Styles.forminput} required/>
          </div>
          <div className={Styles.marginbottom}>
            <label className={Styles.formlabel}>Mobile</label>
            <input type="number" name='UserPhno' className={Styles.forminput} required/>
          </div>
          <div className={Styles.marginbottom}>
            <label className={Styles.formlabel}>Upload Selfie</label>
            <button type='button' className={Styles.forminputselfi} onClick={()=>{captureselfivalue(true)}}>{!selfie?'Open Camera':'Uploded! Done'}</button>
          </div>
          <button type="submit" className={Styles.submitbutton}>Submit</button>
        </form>
      </div>
    </div>
    {captureselfi?<TakeSelfi setSelfie={setSelfie} captureselfivalue={captureselfivalue}/>:''}
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    </>
  );
}
