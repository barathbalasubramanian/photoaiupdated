'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Style from "./edit.module.css"
import downloadCSV,{downloadEXCEL,downloadPDF,searchFun} from './DownloadCSV';
import EditCreate from './EditCreate';
import EventDetailsToDownload from './EventDetailstoDownload';
import { DeleteCustomerFuntion, GetCustomerFuntion } from './AllFunctions';
import Confirm from './confirm';
import UpdateCustomer from './UpdateCustomer';
import Image from 'next/image';
import Link from 'next/link';
import TemporaryDrawer_ from './UserProfile';
export default function EditLeftDrawer(UserID) {
  const [Data,SetData] = React.useState([]);
  const [ConstData,SetConstData] = React.useState([]);
  const [ConstCheckedData,SetConstCheckedData] = React.useState(null);
  const [tot,totvalue] = React.useState(0);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const FetchCustomerData = async ()=>{
    const response = await GetCustomerFuntion();
    SetConstData(response)
    let total = 0
    response.map((item)=>{
      total = total + item.Balance;
    })
    totvalue(total);
    SetData(response);
  }
  const HandelDelete = async()=>{
    const result = window.confirm("Are you sure you want to delete?");
    if(result){
      const response = await DeleteCustomerFuntion(ConstCheckedData.Customer_ID);
      if(response){
        FetchCustomerData();
      }else{
        alert("Something went wrong");
      }
    }
  }
  React.useEffect(()=>{
    FetchCustomerData();
  },[]);

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const handleDownload = (format) => {
      switch (format) {
          case 'csv':
              downloadCSV(Data);
              break;
          case 'excel':
              downloadEXCEL(Data);
              break;
          case 'pdf':
              downloadPDF(Data);
              break;
          default:
              break;
      }
      setDropdownVisible(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const list = (anchor) => (
    <Box className={`${Style.DrawerCenter} min-h-screen`} style={{backgroundColor:"var(--bg)"}} sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '100vw' }} role="presentation">
        <div className='lg:flex hidden' onClick={handleRefresh}>
          <img src="assets/homeicon.svg" alt="Home" className={Style.homeIcon} />
        </div>
        <div className={`m-auto flex flex-col pt-4 gap-4 min-h-screen ${Style.MainCon}`} style={{width:"65em",margin:"auto"}}>

            {/* Header */}
            <div className='flex w-full items-center justify-between py-2 px-3'>
              <div className='w-full lg:px-4 py-2 flex gap-4 items-center'>
                <div className={Style.ForBackButton} onClick={()=>{setState({ ...state, [anchor]: false })}}>
                  <img src="/assets/backbtn.svg" alt="Back" style={{width:"20px",height:"20px"}}/>
                </div>
                <div style={{color:"var(--blue)",fontSize:"24px"}}>Customers</div>
              </div>
              <div><TemporaryDrawer_ UserID={UserID}/></div>
            </div>

            {/* Search */}
            <div className={`${Style.NavSearchModel} mb-4 px-3`}>
                <div className={Style.SearchModel} style={{width:"68%"}}>
                    <input type="text" placeholder="Search" onChange={(e)=>{SetData(searchFun(e.target.value,ConstData))}}/>
                    <div className={Style.searchBtn} style={{margin:"0em"}}>Search</div>
                </div>
                <div className={Style.AddModelButton}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button 
                        className={Style.searchBtn} 
                        style={{ display:"flex", gap:"1em",alignItems:"center",justifyContent:"space-between",border: "1px solid var(--pink)", color: "var(--pink)", backgroundColor: "var(--bg)" }}
                        onClick={() => setDropdownVisible(!dropdownVisible)} 
                    >
                        Download as <img src="/assets/downarr.svg" alt="Down Arrow" />
                    </button>
                    {dropdownVisible && (
                        <div className={`${Style.dropdown} flex flex-col py-2`} style={{ position: 'absolute', top: '100%', left: "85px", zIndex: 1 }}>
                            <div style={{borderBottom:"1px solid black",width:"4em"}}>
                              <button style={{padding:"0em .7em",fontSize:"14px"}} onClick={() => handleDownload('csv')}>CSV</button>
                            </div>
                            <div style={{borderBottom:"1px solid black",width:"4em"}}>
                              <button style={{padding:"0em .7em",fontSize:"14px"}} onClick={() => handleDownload('excel')}>EXCEL</button>
                            </div>
                            <div style={{borderBottom:"1px solid black",width:"4em"}} >
                              <button style={{padding:"0em .7em",fontSize:"14px"}} onClick={() => handleDownload('pdf')}>PDF</button>
                            </div>
                        </div>
                    )}
                  </div>
                  <EditCreate FetchCustomerData={FetchCustomerData}/>
                </div>  
            </div>

            <div className={Style.TableTag} style={{maxHeight: "60vh", overflow: "scroll" }}>
              <div className={Style.customTable} style={{width:"fit-content",backgroundColor:"var(--white)",borderRadius:"10px"}}>
                <div className={`${Style.customThead}`}>
                  <div className={Style.customTr}>
                    <div className={Style.customTh} style={{borderBottom:"1px solid #9AC5F4"}}>#</div>
                    <div>
                      <div style={{borderBottom:"1px solid #9AC5F4"}}>
                        <div className={Style.customTh} style={{minWidth:"10em"}}>Customer Name</div>
                        <div className={Style.customTh} style={{minWidth:"8em"}}>Mobile</div>
                        <div className={Style.customTh} style={{width:"18em"}} >Mail</div>
                        <div className={Style.customTh} style={{minWidth:"8em"}}>Location</div>
                        <div className={Style.customTh} style={{minWidth:"10em"}}>Balance</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={Style.customTbody}>
                  {Data.map((item, index) => {
                    return (
                      <div className={`${Style.customTr} flex`} key={index}>
                        <div className={Style.customTd} style={{borderBottom:"1px solid #9AC5F4"}}>
                          <img
                            style={{ width: '20px', cursor: 'pointer' }}
                            onClick={() => {
                              if (ConstCheckedData) {
                                SetConstCheckedData(null);
                              } else {
                                SetConstCheckedData(item);
                              }
                            }}
                            src={ConstCheckedData?.Customer_ID !== item.Customer_ID ? '/svg/CheckedFalse.svg' : '/svg/CheckedTrue.svg'}
                            alt=""
                          />
                        </div>
                        <div className='flex gap-5 items-center' style={{borderBottom:"1px solid #9AC5F4"}}>
                          <EventDetailsToDownload MobileUi={false} UserID={UserID} id={item.Customer_ID} name={item.Customer_Name} Mobile={item.Mobile} Location={item.Location} Email_ID={item.Email_ID} Balance={item.Balance} verbose={false}/>
                          <div>
                            <button className={Style.searchBtn} style={{padding:"4px 16px",margin:'0 2em 0 0'}}><Confirm ConstCheckedData={ConstCheckedData}/></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={Style.customTbodyMob}>
                  {Data.map((item, index) => {
                    return (
                      <div className='flex flex-col gap-1 '>
                        <div className={`flex gap-3 justify-between py-2`} key={index}>
                            <div className='flex flex-col pl-4 py-2 gap-2'>
                              <div className='flex gap-2'>
                                <div>
                                  <img
                                    style={{ width: '20px', cursor: 'pointer' }}
                                    onClick={() => {
                                      if (ConstCheckedData) {
                                        SetConstCheckedData(null);
                                      } else {
                                        SetConstCheckedData(item);
                                      }
                                    }}
                                    src={ConstCheckedData?.Customer_ID !== item.Customer_ID ? '/svg/CheckedFalse.svg' : '/svg/CheckedTrue.svg'}
                                    alt=""
                                  />
                                </div>
                                <div>{item.Customer_Name}</div>
                              </div>
                              <div style={{paddingLeft:"4px"}}>
                                <div className='flex gap-2 items-center' style={{fontSize:"13px"}}><img src="/assets/phoneui1.svg" alt="1" />{item.Mobile}</div>
                                <div className='flex gap-2 items-center' style={{fontSize:"13px"}}><img src="/assets/phoneui2.svg" alt="2" />{item.Location}</div>
                                <div className='flex gap-2 items-center' style={{fontSize:"13px"}}><img src="/assets/phoneui3.svg" alt="3" />{item.Email_ID}</div>
                              </div>
                            </div>
                            <div className='flex flex-col items-start justify-evenly py-2' style={{gap:"10px",fontSize:"14px !important"}}>
                              <div style={{fontSize:"18px !important"}} > Balance : <span style={{color:"crimson"}}>${item.Balance}</span></div>
                              <button className={Style.searchBtn} style={{padding:"4px 16px",margin:'0 2em 0 0'}}><Confirm ConstCheckedData={ConstCheckedData}/></button>
                              <EventDetailsToDownload MobileUi={true} UserID={UserID} id={item.Customer_ID} name={item.Customer_Name} Mobile={item.Mobile} Location={item.Location} Email_ID={item.Email_ID} Balance={item.Balance} verbose={false} />
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                          <div className={Style.line}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'20px'}}>
                {ConstCheckedData?<>
                  <div className='flex gap-3'>
                      <div><UpdateCustomer FetchCustomerData={FetchCustomerData} Data={ConstCheckedData}/></div>
                      <div>
                        <div onClick={HandelDelete} className={Style.searchBtn} style={{cursor:"pointer",color:"var(--pink)",backgroundColor:"var(--white)",border:"1px solid var(--pink)"}}>Delete</div>
                      </div>
                </div>
                </>:<>
                <div>
                      <div></div>
                      <div></div>
                </div>
                </>}
            </div>
        </div>
    </Box>
  );

  return (

    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <div 
            onClick={toggleDrawer(anchor, true)} 
            className={`flex gap-4 items-center ${Style.NavOptions}`} 
            style={{ cursor: "pointer" }}
          >
            <div className={Style.CustomerIcon}></div>
            <div>Customers</div>
          </div>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} transitionDuration={{ appear: 1000, enter: 1000, exit: 1000 }}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}