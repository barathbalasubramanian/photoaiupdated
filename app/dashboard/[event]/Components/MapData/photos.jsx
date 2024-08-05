'use client';
import { Skeleton } from "@mui/material";
import Styles from "./page.module.css";
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MapData_ = ({ Data, ScrollBtn, sel, selectedFiles, event }) => {
    const arrayOfUndefined = Array.from({ length: 5 });
    const [AllSupaFavourite_, AllSupaFavourite_value] = useState([]);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }
    });

    const handleCheckboxChange = (item) => {
        const segments = item.split('/');
        const [secondLast, last] = segments.slice(-2);
        const file = `${secondLast}/${last}`;

        const newSelectedItems = selectedFiles.includes(file)
            ? selectedFiles.filter((selectedItem) => selectedItem !== file)
            : [...selectedFiles, file];

        console.log(newSelectedItems)
        sel(newSelectedItems);
    };

    const AddFav = async (item) => {
        try {
            const isItemSelected = AllSupaFavourite_.includes(item);
            let updatedFavorites;
            if (isItemSelected) {
                updatedFavorites = AllSupaFavourite_.filter((selectedItem) => selectedItem !== item);
            } else {
                updatedFavorites = [...AllSupaFavourite_, item];
            }
            await UpdateSupaData(item);
            GetAllFavourite()
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };
    
    const GetAllFavourite = async () => {
        try {
            const { data, error } = await supabase
                .from('UserEvents')
                .select('Favourite_Images')
                .eq("EventName", event);
            if (error) throw error;
            if (data && data[0] && data[0].Favourite_Images) {
                AllSupaFavourite_value(data[0].Favourite_Images);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const UpdateSupaData = async (item) => {

        const QueryFavPhotos = await supabase.from('UserEvents').select('Favourite_Images').eq("EventName", `${event}`);
        let newFavPhotos = QueryFavPhotos.data[0].Favourite_Images;
        if (newFavPhotos.includes(item)) {
            newFavPhotos = newFavPhotos.filter((favPhoto) => favPhoto !== item);
        }
        else {
            newFavPhotos.push(item);
        }
        const data = await supabase.from('UserEvents').update({ 'Favourite_Images': newFavPhotos  }).eq('EventName',`${event}`).select('Favourite_Images');
        let Array = data.data[0].Favourite_Images

        try {
            const selfieData = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Key: `${event}/Favorites.json`,
                Body: JSON.stringify(Array),
                ContentType: 'application/json',
                ACL: 'public-read'
            };
            await s3Client.send(new PutObjectCommand(selfieData));
            return data[0].Favourite_Images;
        } catch (error) {
            console.error('Error updating data:', error);
            return AllSupaFavourite_;
        }
    };

    useEffect(() => {
        GetAllFavourite();
    }, []);

    return (
        <>
            {Data.length === 0 ? (
                <>
                    {arrayOfUndefined.map((_, index) => {
                        const height = Math.floor(Math.random() * (250 - 100 + 1)) + 200;
                        return (
                            <div key={index} className={Styles.OneDiv}>
                                <Skeleton
                                    variant="rectangular"
                                    style={{ backgroundColor: 'rgba(23, 123, 229,0.4)', borderRadius: '7px', margin: '3px' }}
                                    animation="wave"
                                    width='100%'
                                    height={height}
                                />
                            </div>
                        );
                    })}
                </>
            ) : (
                <>
                    {Data.map((item) => {
                        const segments = item.split('/');
                        const [secondLast, last] = segments.slice(-2);
                        const file = `${secondLast}/${last}`;
                        const isSelected = selectedFiles.includes(file);
                        return (
                            <div key={item} className={Styles.OneDiv} style={{ position: 'relative' }}>
                                <div
                                    onClick={() => handleCheckboxChange(item)}
                                    style={{ position: 'absolute', top: "15px", left: "15px", cursor: 'pointer' }}
                                >
                                    <Image
                                        src={isSelected ? "/assets/selected.svg" : "/assets/unselected.svg"}
                                        width={18}
                                        height={18}
                                        alt={isSelected ? "Selected" : "Unselected"}
                                    />
                                </div>

                                <div>
                                    <img 
                                        style={{ position: 'absolute', width:"1.5em" , bottom: "15px", left: "15px", cursor: 'pointer' }}
                                        src={AllSupaFavourite_.includes(item) ? "/assets/addfav.svg" : "/assets/addedfav.svg"}
                                        onClick={() => AddFav(item)}
                                    />
                                </div>

                                <Image
                                    src={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item}`}
                                    width={200}
                                    height={200}
                                    className={Styles.Image}
                                    loading="lazy"
                                    onClick={() => { ScrollBtn(item); }}
                                    alt=""
                                />
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
};

export default MapData_;
