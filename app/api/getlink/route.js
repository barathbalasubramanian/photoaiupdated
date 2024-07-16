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

const GetFolderId = async (folderName) => {
  try {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: "files(id, name)",
      spaces: "drive",
    });
    const folders = response.data.files;
    if (folders.length > 0) {
      return folders[0].id;
    }
  } catch (error) {
    console.error("Error getting folder:", error);
    throw error;
  }
};

const getDownloadLinkFromName = async (fileName, folderId) => {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
      fields: "files(id, name, webContentLink)",
    });
    const files = res.data.files;
    if (files.length === 0) {
      throw new Error("No files found");
    }
    return files[0].webContentLink;
  } catch (error) {
    console.error("Error fetching download link:", error);
    throw error;
  }
};

export const POST = async (req, res) => {

  // return NextResponse.json({
  //   status:200,link: "downloadLink" })

  const { filename, folderName } = await req.json()
  console.log(filename,folderName);

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
