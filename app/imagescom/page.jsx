"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState([]);

  const handleFileUpload = async (event) => {
    event.preventDefault();

    const files = Array.from(fileInputRef.current.files);
    const batchSize = 10;
    let results = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);

      const formData = new FormData();
      batch.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const response = await axios.post('http://localhost:8080/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        results = results.concat(response.data);
        setUploadStatus(prevStatus => [...prevStatus, ...response.data]);
        console.log('Batch upload successful:', response.data);
      } catch (error) {
        console.error('Error uploading batch:', error);
      }
    }

    console.log('All file uploads completed:', results);
  };

  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.ppt,.pptx"
        />
        <button type="submit">Upload Files</button>
      </form>
      <div>
        <h2>Upload Status:</h2>
        <ul>
          {uploadStatus.map((file, index) => (
            <li key={index}>File ID: {file.id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadForm;
