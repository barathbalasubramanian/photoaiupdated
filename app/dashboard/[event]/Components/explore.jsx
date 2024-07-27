'use client'
import Image from 'next/image';
import Style from "./page.module.css"
export default function ExploreComp({Data,EpxFun}){
    return(
        <>
          <span className={Style.ExploreSlider}>
            {Data.map((item)=>{
                return <div key={item} className='flex flex-col items-center justify-center'>
                    <div onClick={()=>{EpxFun(item.split("/")[2])}} className={Style.SlidreImage}>
                      <Image src={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item}`} width={50} height={50} alt=''/>
                    </div>
                    <div style={{color:"var(--black)"}}>{item.split("/")[2]}</div>
                </div>
            })}
          </span>
        </>
    )
}
