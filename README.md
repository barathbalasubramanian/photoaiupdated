


# Photo AI

Hi this project is done in next.js
## Authors

- [@barathbalasubramanian](https://github.com/barathbalasubramanian)
- [@jitenderji1137](https://github.com/jitenderji1137)



## Documentation

[Documentation](https://github.com/jitenderji1137)

## Explanation of Web Structure

1. Home
2. create-event ( To Create New Event)
3. dashboard ( To veiw all the photos )
4. digitalinvite ( To invite Peoples digitaly )
5. Qrcode ( To Show QrCode )
6. Search ( To Search Any Fun )
7. upload ( To Upload Photos To S3 Bucket )
8. User ( User Can Get There Photos )
9. Download ( to download any csv file or photos )

## Dependecies used for this project 
    "@aws-sdk/client-s3": "^3.509.0",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/icons-material": "^5.15.14",
    "@mui/joy": "^5.0.0-beta.32",
    "@mui/lab": "^5.0.0-alpha.161",
    "@mui/material": "^5.15.14",
    "@mui/styled-engine-sc": "^6.0.0-alpha.12",
    "@mui/x-date-pickers": "^7.1.0",
    "@reduxjs/toolkit": "^2.2.1",
    "@supabase/supabase-js": "^2.39.3",
    "axios": "^1.6.5",
    "browser-image-compression": "^2.0.2",
    "dayjs": "^1.11.10",
    "file-saver": "^2.0.5",
    "image-to-base64": "^2.2.0",
    "jszip": "^3.10.1",
    "next": "14.0.4",
    "nextjs-toploader": "^1.6.4",
    "qrcode": "^1.5.3",
    "rc-progress": "^3.5.1",
    "react": "^18",
    "react-datepicker": "^6.6.0",
    "react-dom": "^18",
    "react-minimal-pie-chart": "^8.4.0",
    "react-qr-code": "^2.0.12",
    "react-redux": "^9.1.0",
    "react-toastify": "^10.0.5",
    "react-webcam": "^7.2.0",
    "styled-components": "^6.1.8",
    "sweetalert2": "^11.10.3",
    "xlsx": "^0.18.5"


## Installation

Install my-project with npm

```bash
  git clone <Repo>
  cd <Repo>
  npm install
```
Open browser and visit :- http://localhost:3000
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_KEY`

`NEXT_PUBLIC_APP_PHOTO_AI_SECRET_WORD`

`NEXT_PUBLIC_API_BASE_URL`

`NEXT_PUBLIC_WEB_APP_BASE_URL`

`NEXT_PUBLIC_AWS_ACCESS_KEY`

`NEXT_PUBLIC_AWS_SECRET_KEY`

`NEXT_PUBLIC_AWS_BUCKET_NAME`

`NEXT_PUBLIC_AWS_BUCKET_REGION`


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

# Web Software Documentation

## Welcome Page

Firstly, users are prompted to authenticate by providing a valid user ID and password.

---

## Homepage

Upon successful authentication, users are directed to the homepage, which offers two main options: "Create Event" and "Search Event."

---

## Create Event

Users can create events by inputting three essential details: Event name, event date, and location. Optionally, they can generate digital invites for the event, including a countdown timer to the event day and Google Maps integration for navigation. Event data is stored in the "userevents" collection in Supabase. Upon event creation, several files are automatically generated and stored in an S3 bucket: Photograph_Encoded.json, Selfie_Encoded.json, WhatsApp_Send_Messages.json, WhatsApp_UnSend_Messages.json, and Uploaded_Images.json.

To generate a digital invitation, users must provide the groom's name, bride's name, event location, and a link to the location. Additionally, a QR code can be generated for easy sharing of personal data, including name, phone number, email address, and photo. All digital invitation data is stored in the "userevents" collection in Supabase.

---

## Search Event

Administrators can search for events using a search bar, which displays event details such as event name, date, location, bride name, and groom name. Additionally, there are six options available on this page: "Upload Folder," "Dashboard," "Digital Invite," "Report," "QR Code," and "Secret Key."

---

## Upload Folder

Users can create folders for each event to organize images. When a folder is double-clicked, a dialog box opens allowing users to upload images. Images are stored in compressed format and in photographer-specific folders.

---

## Dashboard

The dashboard features three sections: "All Photos," "Explore," and "Favorites." In "All Photos," images are listed according to folders selected in the navbar, with options to download images or add them to favorites. The "Explore" section lists all images, with filters available based on QR code-scanned data. "Favorites" allows users to download all favorited images stored in favorite.json in the S3 bucket.

---

## Digital Invite

Generates digital invitations with bride and groom names and event location details, including navigation.

---

## Report

Provides customer data entered via QR code forms.

---

## QR Code

Generates QR code images for events.

---

## Secret Key

Allows setting a secret key for each event, which users must provide to access the dashboard. The key is generated using this option.

---

## SuperUser

Super users have access to view all studio events and their respective dashboards.



# Supabase Table Schemas

This document outlines the schemas for various tables in a Supabase database.

## Studio-Admin Table

The `Studio-Admin` table stores information about administrators of the studio.

| Column Name          | Data Type | Description                                        |
|----------------------|-----------|----------------------------------------------------|
| :key: UserID               | TEXT      | User's ID                                          |
| :lock: Password             | TEXT      | User's password                                    |
| :ballot_box_with_check: is_verified          | TEXT      | Verification status of the user                    |
| :calling: WhatsApp_API         | TEXT      | WhatsApp API details                               |
| :star: Is_Prime_User        | BOOLEAN   | Indicates if the user is a prime user or not (Default : false)       |
| :framed_picture: Logo                 | TEXT      | URL or path for the user's logo                    |
| :phone: Phone_No             | NUMERIC   | User's phone number                                |
| :round_pushpin: Location             | TEXT      | User's location                                    |
| :globe_with_meridians: Website              | TEXT      | User's website URL                                 |
| :white_check_mark: Is_Whatsapp_Verified| BOOLEAN   | Indicates if user's WhatsApp is verified or not (Default : false)    |

Studio-Admin Has CLIENT_ID CLIENT_SECRET REDIRECTED_URL REFRESHTOKEN For each Client

## UserEvents Table

The `UserEvents` table records various events associated with users.

| Column Name          | Data Type | Description                                        |
|----------------------|-----------|----------------------------------------------------|
| :id: EventID              | INT8      | Unique event identifier                            |
| :bust_in_silhouette: UserID               | TEXT      | Reference to user's ID                              |
| :calendar: EventDate            | DATE      | Date of the event                                  |
| :bulb: EventName            | TEXT      | Name of the event                                  |
| :memo: EventDetail          | JSON      | Detailed information about the event               |
| :heart: FavouriteImages      | JSON      | Favorite images related to the event               |
| :card_index: Customer_ID_UUID     | TEXT      | Reference to customer's ID                          |
| :moneybag: Mode_Of_Payment      | TEXT      | Mode of payment for the event                      |
| :currency_exchange: Full_Amount          | INT8      | Full amount paid for the event                     |
| :money_with_wings: Advance_Payment      | JSONB     | Information about any advance payment made         |
| :bar_chart: Status               | TEXT      | Status of the event (Default : '')                              |
| :e-mail: DigitalInvite        | JSONB     | Digital invite details                             |
| :round_pushpin: Location             | TEXT      | Location of the event                              |
| :file_folder: Folders              | JSONB     | Folders related to the event                       |
| :camera: SelfieData           | JSONB     | Selfie data related to the event (Default : [])                  |
| :key: Secret_Key           | TEXT      | Secret key related to the event                    |

## GreetingName Table

The `GreetingName` table stores information about greetings.

| Column Name          | Data Type | Description                                        |
|----------------------|-----------|----------------------------------------------------|
| :id: Greeting_ID          | UUID      | Unique greeting identifier                         |
| :speech_balloon: Desc                 | TEXT      | Description of the greeting                        |
| :frame_with_picture: Photo                | TEXT      | URL or path for the greeting's photo               |
| :bust_in_silhouette: User_Name            | TEXT      | User's name associated with the greeting           |
| :label: Greeting_Name        | TEXT      | Name of the greeting                               |

## CustomerName Table

The `CustomerName` table stores information about customers.

| Column Name          | Data Type | Description                                        |
|----------------------|-----------|----------------------------------------------------|
| :id: Customer_ID          | UUID      | Unique customer identifier                         |
| :bust_in_silhouette: Customer_Name        | TEXT      | Customer's name                                    |
| :iphone: Mobile               | INT8      | Customer's mobile number                           |
| :bust_in_silhouette: User_Name            | TEXT      | User's name associated with the customer           |
| :e-mail: Email_ID             | TEXT      | Customer's email address                           |
| :round_pushpin: Location             | TEXT      | Customer's location                                |




# S3 Selfie-bucket Schema

```bash

Buckets
    └── Selfie-bucket
        └──  Studio-admin 1
        │   ├── Compressed Images ( Contains compressed images of all photos in folder format. )
        │   │   ├── All Available Folders
        │   │   │   └── Images
        │   ├── Favourites.json ( JSON file containing favorite photos. )
        │   ├── Favourites
        │   │   └── Photos in zip format ( Zip file containing favorite photos. )
        │   ├── PhotographEncoded.json ( JSON file containing all photos in the studio for processing in AI model. )
        │   ├── Selfie_Encoded.json ( JSON file containing photos in encoded format for processing in AI model. ) 
        │   └── Selfie
        │       └── All Users ( Username bacame the name of the folder. ) ( Contains images in JPEG format for the specific user. ) 
        │           └── Images in jpeg format
        │           └── Data.json ( JSON file containing user information. ) 
        ├── Studio-admin 2
        │   ├── ...
        │   
        └── Studio-admin 3
            ├── ... 

```
## GOOGLE DRIVE 

For Each Client We will Create one google drive account and it credentails are stored in Supabase Studio-Admin
Raw Images are stored in the respective client google drive
When Creating Folder, it will create folders in google drive
Whenever uploading images process, it will store image according to the folername

All Google Drive Integration code written in Node js Backend and Deployed in Ec2.