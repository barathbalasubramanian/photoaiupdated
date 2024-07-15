'use client';
import { Checkbox, Skeleton } from "@mui/material";
import Styles from "./page.module.css";
import Image from 'next/image';

const MapData_ = ({ Data, ScrollBtn, sel, selectedFiles }) => {
    const arrayOfUndefined = Array.from({ length: 5 });

    const handleCheckboxChange = (item) => {
        const segments = item.split('/');
        const [secondLast, last] = segments.slice(-2);
        const file = `${secondLast}/${last}`;

        const newSelectedItems = selectedFiles.includes(file)
            ? selectedFiles.filter((selectedItem) => selectedItem !== file)
            : [...selectedFiles, file];

        sel(newSelectedItems);
    };

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
                                <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleCheckboxChange(item)}
                                    className={Styles.CheckBox}
                                    style={{ position: 'absolute', top: "3.5em", left: "0px", color: 'white', width:"35px", height:"35px",backgroundColor: 'var(--blue)' }}
                                />
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
