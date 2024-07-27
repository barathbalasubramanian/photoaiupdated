'use client'
import React, { useState } from "react";
import Webcam from "react-webcam";
import Styles from "./page.module.css"
const videoConstraints = {
    width: 4000,
    height: 4000,
    facingMode: "user"
};
  const TakeSelfi = ({setSelfie,captureselfivalue}) => {
    const webcamRef = React.useRef(null);
    const [Retake,retakevalue] = useState(false);
    const [image,imagevalue] = useState('');
    const capture = (async() => {
        const imageSrc = await webcamRef.current.getScreenshot();
        const encodedData = imageSrc.split(',')[1];
        const binaryData = atob(encodedData);
        const blob = new Blob([new Uint8Array(Array.from(binaryData).map(char => char.charCodeAt(0)))], { type: 'image/jpeg' });
        imagevalue(imageSrc);
        setSelfie(blob);
      }
    );
    return (
      <>
        <div className={Styles.TakeSelfi}>
            <div>
                <div><h4>Capture Selfie</h4><strong>Keep Face in the Center</strong><div>and</div><div className={Styles.SecondStrong}>Press Capture</div><div className={Styles.CrossIcon} onClick={()=>{captureselfivalue(false)}}>&#x2716;</div></div>
                <div className={Styles.PositionRelative}>
                    {/* <div className={Styles.Overlay}><svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%"><defs><mask id="image-mask"><rect width="100%" height="100%" fill="#fff"></rect><rect width="79%" height="90%" x="10%" y="0" rx="120" ry="120" style={{transform: 'translate(0%, 10px)'}}></rect></mask></defs><rect className="webcam-mask" x="0" y="0" width="100%" height="100%" mask="url(#image-mask)" fillOpacity="1"></rect></svg></div> */}
                    {!Retake?<><div className={Styles.LottiePlayerDiv}>
                        <lottie-player src="/svg/facescan.json" className={Styles.LottiePlayer} background="transparent" speed="0.5" style={{width: '300px', height: '300px'}} direction="0" mode="normal" loop autoplay></lottie-player>
                    </div>
                    <div className={Styles.mwfhbwjhChED}>
                        <div className={Styles.mChED}>
                            <div>
                                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" screenshotQuality={1} videoConstraints={videoConstraints}/>
                            </div>
                        </div>
                    </div></>:<><img src={image} alt="" style={{height:"300px",width:"300px",objectFit:"cover",borderRadius:"30%",transform: "scaleX(-1)"}}/></>}
                </div>
                <div className={Styles.capturebtn}>
                    {Retake?<div onClick={()=>{retakevalue(false)}}>Re-Take</div>:<></>}
                    <div onClick={()=>{if(Retake){captureselfivalue(false)}else{capture();retakevalue(true)}}}>{Retake?"Submit":"Capture"}</div>
                </div>
            </div>
        </div>
      </>
    );
  };
  export default TakeSelfi;