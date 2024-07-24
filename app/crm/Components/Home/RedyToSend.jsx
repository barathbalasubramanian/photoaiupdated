'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Style from "./edit.module.css"
import { isEqual } from 'lodash';
import { GetCustomerFuntion } from './AllFunctions';
import { sendgreatingmessages } from '../../SendSMS';
import { searchFun } from './DownloadCSV';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GreetingSendBtn from './GreetingSendBtn';
import Image from 'next/image';
export const TableCkeckBox = ({item,CheckValue,SetArrayValue})=>{
    return <div className='gap-4' style={{display:'flex',backgroundColor:"var(--white)",maxHeight:"60vh",borderBottom:'1px solid var(--blue)',justifyContent:'space-between',padding:'10px 20px'}}>
        <img style={{ cursor: "pointer" }} 
              src={
                !CheckValue.some(val => isEqual(val, [item.Mobile, item.Customer_Name]))
                  ? '/svg/CheckedFalse.svg'
                  : '/svg/CheckedTrue.svg'
              }
              onClick={() => {
                CheckValue.some(val => isEqual(val, [item.Mobile, item.Customer_Name]))
                  ? SetArrayValue(
                      CheckValue.filter(it => !isEqual(it, [item.Mobile, item.Customer_Name]))
                    )
                  : SetArrayValue([[item.Mobile, item.Customer_Name], ...CheckValue]);
              }} alt="" />   
        <div style={{width:"8em",maxWidth:"8em",overflow:"scroll",textAlign:'center'}}>{item.Customer_Name}</div>
        <div style={{width:"8em",maxWidth:"8em",overflow:"scroll",textAlign:'center'}}>{item.Mobile}</div>
    </div>
}

export default function ReadyToSendSMS({SendingData}) {
    console.log(SendingData,"Data")
    const [ArrayOfNumbers,SetArrayValue] = React.useState([]);
    const [ConstData,SetConstData] = React.useState([]);
    const [CustomerData,SetCustomerData] = React.useState([]);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const GetAllCutomers = async()=>{
    const response = await GetCustomerFuntion();
    SetCustomerData(response);
    SetConstData(response);
  }
  React.useEffect(()=>{
    GetAllCutomers();
  },[])
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const HandelSelectAll = async()=>{
    if(ArrayOfNumbers.length == 0){
      const ar = [];
      CustomerData.map((item)=>{
          ar.push([item.Mobile,item.Customer_Name])
      })
      SetArrayValue([...ar]);
    }else{
      SetArrayValue([]);
    }
  }
  const handleRefresh = () => {
    window.location.reload();
  };
  const list = (anchor) => (
    <Box className={`${Style.DrawerCenter} min-h-screen pb-10`}  style={{backgroundColor:"var(--bg)"}} sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '100vw' }} role="presentation">
        <ToastContainer className={Style.toastDiv}/>
        <div className='hidden lg:flex' onClick={handleRefresh}>
          <img src="assets/homeicon.svg" alt="Home" className={Style.homeIcon} />
        </div>
        <div className='mb-10 lg:w-10/12 m-auto flex items-center min-h-screen flex-col pt-4 gap-4' style={{margin:"auto",overflow:"scroll"}}>
            {/* Header */}
            <div className='flex w-full items-center justify-between py-2' style={{borderBottom:"1px solid #4F55C3"}}>
              <div className='w-full px-4 py-2 flex gap-4 items-center'>
                <div className={Style.ForBackButton} onClick={()=>{setState({ ...state, [anchor]: false })}}>
                  <img src="/assets/backbtn.svg" alt="Back" style={{width:"20px",height:"20px"}}/>
                </div>
                <div style={{color:"var(--blue)",fontSize:"24px"}} className=''>List of customers</div>
              </div>
              <div className="flex items-center gap-4 w-fit" style={{border:"1px solid #D8D8D8",borderRadius:'5px',minWidth:"fit-content"}}><Image src="/assets/profile.svg"  alt="Logo" width={100} height={100} className={Style.profile} /><div className="pr-6 text-sm font-bold hidden lg:block">Studio name</div></div>
            </div>  

            <div className='w-9/10 flex flex-col-reverse gap-8 lg:flex-row lg:items-center justify-between lg:w-10/12 mt-6'>
              {/* List of cutomers */}
              <div style={{display:'flex',flexDirection:'column'}}>
                  <div className='flex flex-col lg:flex-row gap-4 lg:items-center'>
                      <div className='bg-white flex gap-2 px-3 items-center' style={{boxShadow:"0px 4px 4px 0px rgba(0, 0, 0, 0.25)",borderRadius:'8px'}}>
                        <img src="/assets/srh.svg" alt="Search" style={{width:"20px",height:'20px'}}/>
                        <input type="text" style={{padding:'6px 24px',outline:"none",border:"none"}} placeholder="Search" onChange={(e)=>{SetCustomerData(searchFun(e.target.value,ConstData))}}/>
                      </div>
                      <div>
                        <button onClick={()=>{HandelSelectAll()}} style={{border:'none',borderRadius:'5px',fontSize:'13px',padding:'7px 24px',cursor:'pointer',backgroundColor:'var(--blue)',color:'#fff'}}>{ArrayOfNumbers.length != 0?'Unselect':'Select All'}</button>
                      </div>
                  </div>
                  <div className={Style.ContainerTable}>
                      <div>
                          <div className='flex mt-6 gap-4 bg-white' style={{display:'flex',borderBottom:'1px solid var(--blue)',justifyContent:'space-between',padding:'10px 20px'}}>
                            <div style={{width:"2em"}}>#</div>
                            <div style={{width:"8em",maxWidth:"8em",overflow:"scroll",textAlign:'center'}}>Customername</div>
                            <div style={{width:"8em",maxWidth:"8em",overflow:"scroll",textAlign:'center'}}>Mobilenumber</div>
                          </div>
                          <div className={Style.cusCon}>
                            {CustomerData.map((item,index)=>{
                                return <TableCkeckBox item={item} CheckValue={ArrayOfNumbers} SetArrayValue={SetArrayValue} key={index}/>
                            })}
                          </div>
                      </div>
                  </div>
              </div>

              {/* GreetingCon */}
              <div className='flex lg:flex-col gap-4'>
                    <div><img src={`${SendingData.Photo}`} alt="" className={Style.greetImg} /></div>
                    <div className='flex flex-col gap-1 mt-2'>
                      <div className='flex' style={{fontSize:"25px",fontWeight:"540px",color:"var(--black)",fontWeight:"400"}}>{SendingData.Greeting_Name}</div>
                      <div className='hidden lg:flex' >{SendingData.Desc}</div>
                      <div className='flex lg:hidden'>
                        <GreetingSendBtn SendingData={SendingData} ArrayOfNumbers={ArrayOfNumbers} />
                      </div>
                    </div>
                    <div className='hidden lg:block'>
                      <GreetingSendBtn SendingData={SendingData} ArrayOfNumbers={ArrayOfNumbers} />
                    </div>
              </div>
            </div>
        </div>
    </Box>
  );

  return (
    <div>
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
          <div onClick={toggleDrawer(anchor, true)}><button style={{backgroundColor:'var(--pink)',padding:'6px 50px',border:'none',borderRadius:'6px',color:'white',cursor:'pointer'}}>Send</button></div>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} transitionDuration={{ appear: 1000, enter: 1000, exit: 1000 }}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}