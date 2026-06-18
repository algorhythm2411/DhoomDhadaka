const { google } = require('googleapis');

// Google Drive Credentials ko .env se load karenge
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
  SCOPES
);

const drive = google.drive({ version: 'v3', auth });

module.exports = drive;
