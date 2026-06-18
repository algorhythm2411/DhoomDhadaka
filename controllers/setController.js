const drive = require('../config/drive');

// Google Drive se DILR Set ka JSON data fetch karne ka function
const getDILRSet = async (req, res) => {
  try {
    const { fileId } = req.params; // Google Drive ki File ID URL se aayegi

    if (!fileId) {
      return res.status(400).json({ message: 'Google Drive File ID is required' });
    }

    // Google Drive API se file content download karo
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    // Agar data successfully fetch ho gaya hai toh send karo
    res.json({
      success: true,
      setData: response.data
    });

  } catch (error) {
    console.error(`❌ Google Drive Fetch Error: ${error.message}`);
    res.status(500).json({ 
      message: 'Failed to fetch DILR set from Google Drive', 
      error: error.message 
    });
  }
};

module.exports = { getDILRSet };
