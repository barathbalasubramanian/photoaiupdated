import { google } from "googleapis";
import { NextResponse } from "next/server";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export const POST = async (req, res) => {
  const { SelectedFolder } = await req.json()
  console.log(SelectedFolder);
  try {
      const folderId = await GetFolderId(folderName)
      console.log(folderId)
      const downloadLink = await getDownloadLinkFromName(filename, folderId);
      console.log(downloadLink)
      return NextResponse.json({
          status:200,link: downloadLink })
  } catch (error) {
      return NextResponse.json({
          status:500
      },{ error: "Error Fetching ..." })
  }
};
