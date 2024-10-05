import ftp from 'basic-ftp';
import fs from 'fs'; // Required to check file existence locally

async function connectToFtp() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging

    try {
        // Replace these with your actual FTP server credentials
        await client.access({
            host: "", // Your local FTP server IP
            port: 21,                // FTP default port for FTP or 990 for FTPS
            user: "",            // FTP username
            password: "",  // FTP password
            secure: true,            // Enable FTPS (FTP over TLS)
            secureOptions: {         // Optional: for TLS configurations if needed
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });

        console.log("Connected to the FTP server");

        // List files in the root directory ("/")
        const list = await client.list("/");
        console.log("Directory listing: ", list);

        // // Example 1: Download a file from the FTP server to your local machine
        const remoteFilePath = "/ResumeAlgo.pdf"; // FTP file path
        const localDownloadPath = "C:\\Users\\vaibh\\OneDrive\\Desktop\\node\\code\\ResumeAlgo.pdf"; // Local path to save the file
        await client.downloadTo(localDownloadPath, remoteFilePath);
        console.log(`Downloaded file from ${remoteFilePath} to ${localDownloadPath}`);

        // Example 2: Upload a file from your local machine to the FTP server
        const localUploadPath = "C:\\Users\\vaibh\\OneDrive\\Desktop\\tick.png"; // Local file to upload
        const remoteUploadPath = "/tick.png"; // FTP path where to upload

        // Ensure the file exists locally before attempting to upload
        if (fs.existsSync(localUploadPath)) {
            await client.uploadFrom(localUploadPath, remoteUploadPath);
            console.log(`Uploaded file from ${localUploadPath} to ${remoteUploadPath}`);
        } else {
            console.error(`File ${localUploadPath} does not exist.`);
        }

    } catch (err) {
        console.error("Error connecting to the FTP server:", err);
    } finally {
        client.close(); // Always close the connection
    }
}

connectToFtp();
