import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});


export const POST = async (req, res) => {

  return NextResponse.json({
    status: 200
  });

  // try {
  //   const { folderName } = await req.json();
  //   console.log(folderName);

  //   const fileMetadata = {
  //     name: folderName,
  //     mimeType: 'application/vnd.google-apps.folder',
  //   };

  //   const file = await drive.files.create({
  //     requestBody: fileMetadata,
  //     fields: 'id',
  //   });

  //   console.log('Folder Id:', file.data.id);

  //   return NextResponse.json({
  //     status: 200,
  //     data: 'Folder Creation Success ...',
  //   });
  // } catch (err) {
  //   console.error('Error creating folder:', err);
  //   return NextResponse.json({
  //     status: 500,
  //     data: err.message,
  //   });
  // }
};
