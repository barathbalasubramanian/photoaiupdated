'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Style from "./edit.module.css"
import { DatePickerIcon } from './page';
import { CreateAmountWithUUIDEvent } from './AllFunctions';
export default function AddPaymentModes({uuid,name,GetAllAmount}) {
  const [Date, SetDate] = React.useState('')
  const [Payment, SetPayment] = React.useState('')
  const [Amount, SetAmount] = React.useState('')
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
  const HandelSubmit = async(e)=>{
    e.preventDefault();
    const response = await CreateAmountWithUUIDEvent(uuid,name,Date,Payment,Amount);
    if(response){
      GetAllAmount();
      setState({ ...state, 'right': false })
    }
  }
  const list = (anchor) => (
    <Box className={Style.DrawerCenter} style={{backgroundColor:"var(--bg)"}} sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '100vw' }} role="presentation">
        <div className={Style.MobileUiEdit} style={{width:'100vw',height:'100svh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <div className={Style.MobileUiEdit2} style={{position:"relative",boxShadow:"0px 72px 80px -48px rgba(0, 0, 0, 0.5)",backgroundColor:'var(--white)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:"50em",padding:"2em 5em",borderRadius:"20px"}}>
                <form onSubmit={HandelSubmit} style={{maxWidth:'500px',width:'100%',display:'flex',flexDirection:'column'}}>

                    {/* <div style={{display:'flex',justifyContent:'space-between',width:'100%',marginBottom:'60px'}}>
                        <div style={{color:'white',fontSize:'25px'}}>Add Payment</div>
                        <div><img src="/svg/Cross.svg" onClick={()=>{setState({ ...state, [anchor]: false })}} alt="" style={{cursor:'pointer'}} /></div>
                    </div> */}

                    <div style={{display:'flex',justifyContent:'space-between',width:'100%',marginBottom:'10px'}}>
                        <div style={{color:'var(--darkblue)',fontSize:'30px'}}>Add Payment</div>
                        <div onClick={()=>{setState({ ...state, [anchor]: false })}} className={Style.backBtn}> <img src="/assets/back.svg" alt="Back" style={{width:"12px",height:"12px"}} /> Back</div>
                    </div>

                    {/* <div style={{width:'96.5%',backgroundColor:'#13192f'}}><DatePickerIcon setValue={SetDate}/></div> */}
                    <div>
                      <label className="text-sm" htmlFor="date">Date</label>
                      <div style={{width:'90%',backgroundColor:'var(--white)',border:'none',borderRadius:'5px',fontSize:'15px',outline:'none',color:'black',margin:'5px 0'}} 
                      ><DatePickerIcon className={Style.eveDatepicker} setValue={SetDate}/></div>
                    </div>

                    {/* <input type='text' onChange={(e)=>{SetPayment(e.target.value)}} list='nameOptions' style={{width:'90%',backgroundColor:'#13192f',border:'1px solid gray',padding:'15px',borderRadius:'5px',fontSize:'15px',outline:'none',color:'white'}} placeholder="Mode Of Payment" required/>
                    <datalist id="nameOptions">
                      <option value="Cash"/>
                      <option value="Debit cards"/>
                      <option value="Wallets"/>
                      <option value="Bank transfers"/>
                      <option value="Cards"/>
                      <option value="UPI"/>
                    </datalist> */}

                    <div>
                      <label className='text-sm' htmlFor="modeofpayment">Mode of Payment</label>
                      <input type='text' list="nameOptions" onChange={(e)=>{SetPayment(e.target.value)}} style={{width:'90%',backgroundColor:'var(--white)',border:'none',padding:'.4em .6em',borderRadius:'5px',fontSize:'15px',outline:'none',color:'black',margin:'5px 0',border:"1px solid var(--blue)"}}  placeholder="Mode of Payment" required/>
                    </div>

                    <datalist id="nameOptions">
                      <option value="Cash"/>
                      <option value="Debit cards"/>
                      <option value="Wallets"/>
                      <option value="Bank transfers"/>
                      <option value="Cards"/>
                      <option value="UPI"/>
                    </datalist>

                    {/* <input type='number' onChange={(e)=>{SetAmount(e.target.value)}} style={{width:'90%',backgroundColor:'#13192f',border:'1px solid gray',padding:'15px',borderRadius:'5px',fontSize:'15px',outline:'none',color:'white'}} placeholder="Amount" required/> */}
                    <div>
                      <label className='text-sm' htmlFor="name">Amount</label>
                      <input type='text' onChange={(e)=>{SetAmount(e.target.value)}} style={{width:'90%',backgroundColor:'var(--white)',border:'none',padding:'.4em .6em',borderRadius:'5px',fontSize:'15px',outline:'none',color:'black',margin:'5px 0',border:"1px solid var(--blue)"}}  placeholder="Event Name" required/>
                    </div>

                    <button type='submit' style={{border:'none',borderRadius:'5px',fontSize:'13px',width:'150px',padding:'6px 20px', marginTop:'30px',cursor:'pointer',backgroundColor:'var(--pink)',color:'#fff'}}>Add Amount</button>
                </form>
            </div>
        </div>
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <div onClick={toggleDrawer(anchor, true)}><button className='px-2 py-1 lg:px-10' style={{border:'none',borderRadius:'5px',fontSize:'13px',cursor:'pointer',backgroundColor:'var(--pink)',color:'#fff'}}>Add Payment</button></div>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} transitionDuration={{ appear: 1000, enter: 1000, exit: 1000 }}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}