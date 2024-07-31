'use client'
import { useState,useRef, useEffect } from "react"
import Styles from "./Components/page.module.css"
import MapData from "./Components/MapData/page"
import Swal from "sweetalert2"
import SearchModel from "./Components/Search/page"
import ExploreComp from "./Components/explore"
import Loader from "@/app/loader/page";
import imageCompression from 'browser-image-compression';
import { S3Client, ListObjectsV2Command, PutObjectCommand,GetObjectCommand } from '@aws-sdk/client-s3';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import Paper from '@mui/material/Paper';
import axios from "axios"
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { createClient } from '@supabase/supabase-js'
import { useDispatch, useSelector } from "react-redux"
import { FetchExploreSelfieData } from "./eventfetchdata"
import ConfirmDelete from "./confirm"
import Link from "next/link"
import { FetchUserInFo } from "@/app/crm/Components/Home/AllFunctions"
import Skeleton from '@mui/material/Skeleton';
import Image from "next/image"
import { resolveStyleConfig } from "@chakra-ui/react"
import MapData_ from "./Components/MapData/photos"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard({ event, UserID }){
  const SuperValue = useSelector((state)=>state.Login.Is_SuperAdmin);
    const sliderRef = useRef(null);
    const [nexttoken,tokenvalue] = useState(null);
    const [AllSupaFavourite,AllSupaFavouritevalue] = useState([]);
    const [scrollamount,scrollvalue] = useState();
    const [loadeer,loadderevalue] = useState(false);
    const [DobeMaped,DobeMappedData] = useState([]);
    const [pagetext,pagetextvalue] = useState('All Photos');
    const [dropdown,dropdownvalue] = useState(false);
    const [WhichPhoto,WhichPhotoValue] = useState(0);
    const [stackone,stackonevalue] = useState([]);
    const [stacktwo,stacktwovalue] = useState([]);
    const [stackthree,stackthreevalue] = useState([]);
    const [stackfour,stackfourvalue] = useState([]);
    const [screenframe,screenframevalue] = useState();
    const [ExploreSlfies,ExploreSelfiesvalue] = useState([]);
    const [ConstData,SetConstData] = useState([])
    const [ExploreSlfieData,ExploreSelfieDatavalue] = useState([]);
    const [Slider,SliderValue] = useState(false)
    const [isituser,uservalue] = useState(false);
    const [upload,uploadvalue] = useState([]);
    const [i_user,i_uservalue] = useState('');
    const [AllFolders,SetAllFolders] = useState([]);
    const [userInfo,SetuserInfo] = useState({});
    const [KeyState,KeyStateValue] = useState(-1);
    const [folderSelect,setfolderSelect] = useState("");
    const [videos, setVideos] = useState([]);
    const [photos,setPhotos] = useState(true)
    const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 2000, timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer;}});
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
      }
    });
    const PushToStacks = (ArrayData)=>{
      if(window.innerWidth >= 1000){
        const stacks = [[], [], [], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 4;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        stackthreevalue(prevData => [...new Set([...prevData, ...stacks[2]])]);
        stackfourvalue(prevData => [...new Set([...prevData, ...stacks[3]])]);
        screenframevalue(4);
      }else if(window.innerWidth >= 550){
        const stacks = [[], [], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 3;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        stackthreevalue(prevData => [...new Set([...prevData, ...stacks[2]])]);
        screenframevalue(3);
      }else{
        const stacks = [[], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 2;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        screenframevalue(2);
      }
    }
    const Fetchuserinfo = async()=>{
      const res = await FetchUserInFo();
      SetuserInfo(res);
    }
    const FetchDashboard = async(continuationtoken)=>{
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        MaxKeys: 30,
        ContinuationToken: continuationtoken,
        Prefix: `${event}/COMPRESS_IMAGES`
      };
      try {
        const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
        const fetchedImages = FetchedImages.Contents.map(obj => obj.Key).filter((key)=>{if(key != `${event}/COMPRESS_IMAGES/`){ return key}});
        DobeMappedData([...new Set([...DobeMaped,...fetchedImages])]);
        tokenvalue(FetchedImages.NextContinuationToken);
        PushToStacks(fetchedImages);
      } catch (error) {
        // console.error('Error fetching images:', error);
      }
    }

    const [SelectedFolder,setSelectedFolder] = useState("");
    const FetchImagesByFolderName = async(continuationtoken,key,firsttime)=>{
      setSelectedFolder(key)
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        MaxKeys: 10,
        ContinuationToken: continuationtoken,
        Prefix: `${event}/COMPRESS_IMAGES/${key}`
      };
      try {
        const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
        const fetchedImages = FetchedImages.Contents.map(obj => obj.Key);
        tokenvalue(FetchedImages.NextContinuationToken);
        if (firsttime){ 
          stackonevalue([]);
          stacktwovalue([]);
          stackthreevalue([]);
          stackfourvalue([]);
          DobeMappedData([]);
          DobeMappedData(fetchedImages);
        }
        else {
          DobeMappedData([...new Set([...DobeMaped,...fetchedImages])]);
        }
        PushToStacks(fetchedImages);
        setfolderSelect(key)
      } catch (error) {
        // console.error('Error fetching images:', error);
      }
    }

    const GetAllFavourite = async()=>{
      const result = await supabase.from('UserEvents').select('Favourite_Images').eq("EventName",`${event}`);
      AllSupaFavouritevalue(result.data[0].Favourite_Images);
    }
    const UpdateSupaData = async(Array)=>{
        const selfieData = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${event}/Favorites.json`,
          Body: JSON.stringify(Array),
          ContentType: 'application/json',
          ACL: 'public-read'
        };
        const resonse = await s3Client.send(new PutObjectCommand(selfieData));
        const data = await supabase.from('UserEvents').update({ 'Favourite_Images': Array }).eq('EventName', `${event}`).select('Favourite_Images');
        return data.data[0].Favourite_Images;
    }
    const getAllFolders = async(prefix = `${event}/COMPRESS_IMAGES/`) => {
      let folders = [];
      let continuationToken = null;
      do {
          const command = new ListObjectsV2Command({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Delimiter: '/',
              Prefix: prefix,
              ContinuationToken: continuationToken
          });
          try {
              const response = await s3Client.send(command);
              folders = folders.concat(response.CommonPrefixes.map(prefix => prefix.Prefix));
              continuationToken = response.NextContinuationToken;
          } catch (error) {
              // console.error('Error listing objects:', error);
              throw error;
          }
      } while (continuationToken);
      SetAllFolders(folders)
    };
    useEffect(()=>{
      FetchDashboard(null);
      GetAllFavourite();
      Fetchuserinfo();
      getAllFolders();
    },[])
    useEffect(() => {
      if (upload.length > 0) {
        UploadImages();
      }
    }, [upload]);
    useEffect(() => {
      if (pagetext == "All Videos") {
        setPhotos(false);
      }
      else { setPhotos(true) }
    },[pagetext])
    const OnExploreClickFun = (async()=>{
      window.scrollTo(0, 0);
      loadderevalue(true)
      uservalue(false)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([]);
      AllSupaFavouritevalue([]);
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Prefix: `${event}/selfie/`
      };
      const response = await s3Client.send(new ListObjectsV2Command(listParams));
      if(response.KeyCount != 0){const jpgPngFiles = response.Contents.filter(obj => obj.Key.endsWith('.jpeg') || obj.Key.endsWith('.png')).map(obj => obj.Key);
      ExploreSelfiesvalue(jpgPngFiles);SetConstData(jpgPngFiles);}
      ExploreSelfieDatavalue([])
      FetchDashboard(null);
      GetAllFavourite();
      pagetextvalue('Explore')
      loadderevalue(false)
    })
    const OnHomeClickFun = (async()=>{

      window.scrollTo(0, 0);
      loadderevalue(true)
      uservalue(false)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([]);
      AllSupaFavouritevalue([]);
      FetchDashboard(null);
      GetAllFavourite();
      pagetextvalue('All Photos')
      ExploreSelfieDatavalue([])
      loadderevalue(false)
    })
    const OnFavouriteClickFun = (async()=>{
      window.scrollTo(0, 0);
      loadderevalue(true)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([...new Set(AllSupaFavourite)]);
      PushToStacks([...new Set(AllSupaFavourite)]);
      ExploreSelfieDatavalue([])
      pagetextvalue('Favorites')
      loadderevalue(false)
    })
    const OnExploreClickProfile = (async(name)=>{
      loadderevalue(true)
      uservalue(true)
      var fetchedImages = await FetchExploreSelfieData(event,name);
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([...new Set(fetchedImages)]);
      PushToStacks([...new Set(fetchedImages)]);
      i_uservalue(name)
      SliderValue(false)
      ExploreSelfieDatavalue([...new Set(fetchedImages)])
      loadderevalue(false)
    })
    useEffect(()=>{
      if (sliderRef.current) {
        const container = sliderRef.current;
        container.scrollLeft += window.innerWidth*scrollamount;
      }
    },[Slider])
    const scrollToPosition = (path) => {
      SliderValue(true);
      scrollvalue(DobeMaped.indexOf(path))
    };
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight && pagetext !== 'Favorites' && !isituser) {
        if (folderSelect == "") {
          // console.log("Querying ...",folderSelect) 
          FetchDashboard(nexttoken);
        }
        else {
          FetchImagesByFolderName(nexttoken,folderSelect,false);
        }
      }
    };
    const DeleteFunction = async(item)=>{
      loadderevalue(true)
      var attt = [];
      const fetchedImages = DobeMaped.map(key => {
        if (key !== item) {
            const parts = key.split('/');
            attt.push(parts[2]+"/"+parts[3]);
        }
      });
      const selfieData = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `${event}/Output/${i_user}/Data.json`,
        Body: JSON.stringify(attt),
        ContentType: 'application/json',
        ACL: 'public-read'
      };
      const response = await s3Client.send(new PutObjectCommand(selfieData));
      if(response.$metadata.httpStatusCode === 200 ){
        Toast.fire({icon: 'success',title: `Image in ${i_user} is Deleted ...`})
        OnExploreClickProfile(i_user)
      }else{
        Toast.fire({icon: 'error',title: `Something went wrong ...`})
      }
      loadderevalue(false)
    }
    const UploadImages = async () => {
          loadderevalue(true)
          const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1000,
              useWebWorker: true,
          }
          var Compresedimage = upload[0];
          if(upload[0].size/(1024 * 1024) > 1){
              Compresedimage = await imageCompression(upload[0], options);
          }
          const uniqueFileName = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_");
          const uploadCommand = new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${event}/COMPRESS_IMAGES/Others/${event+uniqueFileName}.jpg`,
          Body: Compresedimage,
          ACL: 'public-read'
          });
          const respo = await s3Client.send(uploadCommand);
          if(respo.$metadata.httpStatusCode == 200){
          const uploadd = new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: `${event}/photographers_images/Others/${event+uniqueFileName}.jpg`,
              Body: upload[0],
              ACL: 'public-read'
          });
          const response = await s3Client.send(uploadd);
          var attt = [`Others/${event+uniqueFileName}.jpg`];
          const fetchedImages = DobeMaped.map(key => {
                const parts = key.split('/');
                attt.push(parts[2]+"/"+parts[3]);
                // console.log(parts[2]+"/"+parts[3],parts)
          });
          const selfieData = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${event}/Output/${i_user}/Data.json`,
            Body: JSON.stringify(attt),
            ContentType: 'application/json',
            ACL: 'public-read'
          };
          const resonse = await s3Client.send(new PutObjectCommand(selfieData));
          if(resonse.$metadata.httpStatusCode === 200 ){
            Toast.fire({ icon: 'success', title: 'Upload Success ...' });
            OnExploreClickProfile(i_user)
            uploadvalue([])
          }else{
            Toast.fire({icon: 'error',title: `Something went wrong ...`})
          }
        }
          loadderevalue(false)
    };
    const QueryVideos = async() => {
      pagetextvalue("All Videos");
      loadderevalue(true)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      setPhotos(false);
      
      // Querying Videos
      const command = new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Delimiter: '/',
        Prefix: `${event}/photographers_videos/`
        });
        try {
            const response = await s3Client.send(command);
            const videoKeys = response.Contents.map((content) => content.Key);
            setVideos(videoKeys);
        } catch (error) {
            loadderevalue(false);      
        }
      loadderevalue(false);
    }

    const HandleDownload = async(item) => {
      loadderevalue(true);
      console.log(item)
      const parts = item.split('/');
      const folderName = parts[parts.length - 2]; 
      const imageName = parts[parts.length - 1];
      console.log(folderName,imageName,"--")
      const response = await axios.post('https://clickai.anthillnetworks.com/downloadfile', {
        filename: imageName,
        folderName: folderName,
        UserID: UserID
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = response.data
        console.log(data.link);
        const link = document.createElement('a');
        link.href = data.link;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loadderevalue(false);
      }
    }

    const HandleZip = async () => {
      loadderevalue(true);
      const response = await axios.post(`http://localhost:8080/downloadall`, {
        folderName: SelectedFolder,
        UserID: UserID
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data.downloadLink)
      if (response.status === 200) {
        const data = response.data
        console.log(data)
        const link = document.createElement('a');
        link.href = data.downloadLink;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loadderevalue(false);
      }
      else {
        loadderevalue(false)
      }
    }

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleDownloadClick = async () => {
      loadderevalue(true)
      if (selectedFiles.length === 0) {
        return;
      }
      try {
          const response = await axios.post('https://clickai.anthillnetworks.com/selected', {
              selectedFiles: selectedFiles,
              UserID: UserID
          }, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          console.log(response.data);
          const data = response.data
          console.log(data.link);
          const link = document.createElement('a');
          link.href = data.link;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setSelectedFiles([]);
          loadderevalue(false)
        } catch (error) {
          loadderevalue(false)
          // console.error('Error Download batch:', error);
      }
    };

    const handleSelectionChange = async(newSelectedFiles) => {
        setSelectedFiles(newSelectedFiles);
    };

  return(
        <>
        {loadeer?<Loader/>:""}
        <ToastContainer className={Styles.toastDiv}/>
        <div className={`${Styles.Dashboard} min-h-screen max-h-screen overflow-hidden`}> 
            <div className="flex flex-col items-center justify-start gap-8">
                <div className={Styles.Logo}><img src={userInfo?.Logo||''} style={{width:'100px',borderRadius:'5px'}}/></div>
                <div className={`${Styles.LeftNavIcons} w-full flex flex-col items-center gap-2`}>
                    <div onClick={OnHomeClickFun}  style={pagetext === 'All Photos'?{color:'#fff',backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'All Photos'?'/assets/photo.svg':'/assets/inphoto.svg'}/><div>Photos</div></div>
                    <div onClick={QueryVideos} style={pagetext === 'All Videos'?{color:'#fff',backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'All Videos'?'/assets/videos.svg':'/assets/invideos.svg'}/><div>Videos</div></div>
                    <div onClick={OnExploreClickFun} style={pagetext === 'Explore'?{color:'#fff',backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'Explore'?'/assets/explore.svg':'/assets/inexplore.svg'}/><div>Explore</div></div>
                    <div onClick={OnFavouriteClickFun} style={pagetext === 'Favorites'?{color:'#fff',backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'Favorites'?'/assets/fav.svg':'/assets/infav.svg'}/><div>Favorites</div></div>
                </div>
            </div>
            <div>
                <div className={Styles.MakeNavFixed}>
                    <div className={`${Styles.NavOneForMenu} mb-2`} style={{borderBottom:"1px solid var(--blue)"}}>
                        <div className="text-xl sm:text-lg" style={{color:"var(--blue)"}}>{pagetext === 'All Photos' ? 'Event Photos' : pagetext === 'All Videos' ? 'Event Videos' : pagetext === 'Explore' ? "Find your moments with fav people" : pagetext === 'Favorites' ? 'Your Favorites' : '' }</div>
                        <div>
                            <div className="flex items-center gap-4" style={{border:"1px solid #D8D8D8",borderRadius:'5px'}}><Image src={userInfo?.Logo || "/assets/profile.svg"} alt="Logo" width={100} height={100} className={Styles.profile} /><div className="hidden lg:flex pr-6 text-sm font-bold">{userInfo?.UserID}</div></div>
                        </div>
                    </div>
                    <div className={`${Styles.FoldersCss} text-black mb-1`}>
                      {pagetext === 'All Photos'?<div className="flex flex-col gap-4" style={{width:"100%"}}>
                      <div className="flex w-full gap-4 overflow-scroll lg:mb-1">
                        {AllFolders.map((item,index)=>{
                            return <div className={Styles.FolderName} onClick={()=>{FetchImagesByFolderName(null,item.split('/')[2],true);KeyStateValue(index)}} style={KeyState == index?{borderBottom:'2px solid var(--blue)'}:{}}>{item.split('/')[2]}</div>
                        })}
                      </div>
                      {
                        SelectedFolder || selectedFiles.length != 0  ?
                        <div className="w-full flex items-center justify-between">
                              {
                                SelectedFolder ? 
                                <div onClick={HandleZip} className={Styles.downloadZip}>Download All</div> : <></>
                              }
                              <div 
                                  onClick={handleDownloadClick} 
                                  className={`${Styles.downloadZip} ${selectedFiles.length === 0 ? Styles.disabled : ''}`}
                                  style={{ cursor: selectedFiles.length === 0 ? 'not-allowed' : 'pointer' }}
                              >
                                  Download Selected Files
                              </div>
                        </div> 
                        : <></>
                      }
                      </div>:<></>}
                    </div>

                    {
                      pagetext === 'Favorites' || pagetext === 'Explore' ?
                      <div className={`${Styles.NavOneForSearch}`}>
                        <div className={Styles.DownFav} style={{width:"90%"}}>
                          {pagetext === 'Explore'?<SearchModel constData={ExploreSlfies} SetConstData={SetConstData}/>
                          :
                          <>{pagetext == 'Favorites'? 
                          <div className="sm: mt-4 mb-4">
                            <Link href={`/dashboard/${event}/favorites/download`} className={Styles.NavBtn} style={{backgroundColor:"var(--pink)"}}>Download</Link>
                          </div>
                          :<></>
                          }</>
                          }
                        </div>
                      </div> : <></>
                    }

                    {
                      pagetext === 'Explore'
                      ?
                      <div className={`${Styles.MainContaine}`}><ExploreComp Data={ConstData} EpxFun={OnExploreClickProfile}/></div>
                      :<></>
                    }

                    <div style={{overflow:'scroll !important'}}>
                    {
                      photos ? pagetext === "All Photos" ? 
                      <>
                      {screenframe === 4?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackone} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stacktwo} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackthree} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackfour} ScrollBtn={scrollToPosition}/></div>
                          </div>
                        </>:<></>}
                        {screenframe === 3?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackone} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stacktwo} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackthree} ScrollBtn={scrollToPosition} /></div>
                          </div>
                        </>:<></>}
                        {screenframe === 2?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stackone} ScrollBtn={scrollToPosition} /></div>
                            <div><MapData_ sel={handleSelectionChange} selectedFiles={selectedFiles} Data={stacktwo} ScrollBtn={scrollToPosition} /></div>
                          </div>
                        </>:<></>}
                      </> :
                      <>
                          {screenframe === 4?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stackthree} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stackfour} ScrollBtn={scrollToPosition}/></div>
                          </div>
                        </>:<></>}
                        {screenframe === 3?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stackthree} ScrollBtn={scrollToPosition}/></div>
                          </div>
                        </>:<></>}
                        {screenframe === 2?<>
                          <div className={Styles.MainContainer}>
                            <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
                            <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
                          </div>
                        </>:<></>}
                      </> : 
                      <>
                        <div>
                        {videos.length > 0 ? (
                            <div className={`${Styles.videoCon}`}>
                              {videos.map((videoKey) => (
                                <video key={videoKey} controls style={{maxHeight:"20em",maxWidth:"20em",objectFit:"contain"}}> 
                                  <source src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${videoKey}`} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )) }
                            </div>
                          ) : (
                            <div className={`${Styles.empty}`} style={{color:"var(--blue)"}}>No Videos Found !</div>
                          )}
                        </div>  
                      </>
                    }
                    </div>

                </div>
            </div>
        </div>

        {/* Navigation Bar */}
        <div className={Styles.BelowNav}>
          <div className={`${Styles.LeftNavIconsUI} py-2 px-4 cursor-pointer flex w-full justify-between items-center gap-2`}>
              <div className="flex flex-col items-center" onClick={OnHomeClickFun}  style={pagetext === 'All Photos'?{color:'#fff',padding:"4px",borderRadius:"5px",backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'All Photos'?'/assets/photo.svg':'/assets/inphoto.svg'}/><div style={{fontSize:"15px"}}>Photos</div></div>
              <div className="flex flex-col items-center" onClick={QueryVideos} style={pagetext === 'All Videos'?{color:'#fff',padding:"4px",borderRadius:"5px",backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'All Videos'?'/assets/videos.svg':'/assets/invideos.svg'}/><div style={{fontSize:"15px"}}>Videos</div></div>
              <div className="flex flex-col items-center" onClick={OnExploreClickFun} style={pagetext === 'Explore'?{color:'#fff',padding:"4px",borderRadius:"5px",backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'Explore'?'/assets/explore.svg':'/assets/inexplore.svg'}/><div style={{fontSize:"15px"}}>Explore</div></div>
              <div className="flex flex-col items-center" onClick={OnFavouriteClickFun} style={pagetext === 'Favorites'?{color:'#fff',padding:"4px",borderRadius:"5px",backgroundColor:"var(--blue)"}:{color:'#000'}}><img style={{width:"15px",height:"15px"}} src={pagetext === 'Favorites'?'/assets/fav.svg':'/assets/infav.svg'}/><div style={{fontSize:"15px"}}>Favorites</div></div>
          </div>
        </div>

        {Slider?<div className={Styles.OverflowScrollAnimation} ref={sliderRef}>
          {DobeMaped.map((item,index)=>{
            return <div key={index} className={Styles.FullscreenImage}>
              <span onClick={()=>{SliderValue(false)}}>&#x2716;</span>
              <span className={Styles.FullscrennnnImage}>
                <div><img src={AllSupaFavourite.includes(item)?'/svg/FavTrue.svg':'/svg/FavSelected.svg'} onClick={async()=>{if(AllSupaFavourite.includes(item)){const newArray = AllSupaFavourite.filter((element) => `${element}` !== item);const respos = await UpdateSupaData(newArray);AllSupaFavouritevalue(respos)}else{const respos = await UpdateSupaData([...AllSupaFavourite,`${item}`]);AllSupaFavouritevalue(respos)}}} className={Styles.CheckBox}/></div>
                <div>
                  {SuperValue && pagetext === 'Explore'&& ExploreSlfieData.length!=0?<div style={{marginBottom:'10px'}}>
                    <input type="file" name="Image_Files" multiple onChange={(e)=>{uploadvalue(e.target.files)}}/>
                    <ConfirmDelete DeleteFunction={DeleteFunction} item={item} />
                  </div>:<></>}
                  {/* <a className={Styles.DownloadBtnOnSlider} href={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item}`} target="_blank" download>Download</a> */}
                  <div className={Styles.DownloadBtnOnSlider} onClick={()=>HandleDownload(item)} >Download</div>
                </div>
              </span>
              <div>
                <img src={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item}`} alt="Fullscreen Image" className={Styles.FullscrenImage}/>
              </div>
            </div>
          })}
        </div>:<></>}
        </>
    )
}
