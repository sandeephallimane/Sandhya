import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Receive data from the frontend
      const data = req.body;

      // Send data to Google Apps Script (replace YOUR_GAS_URL with the GAS endpoint)
      const gasResponse = await fetch('https://script.google.com/macros/s/YOUR_GAS_URL/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!gasResponse.ok) {
        throw new Error('Failed to contact GAS');
      }

      // Wait for response from GAS
      const gasData = await gasResponse.json();

      // Return the response from GAS to the frontend
      res.status(200).json({
        status: 'success',
        message: 'Data processed successfully by GAS',
        data: gasData, // This is the response from GAS, if needed
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  } else {
    res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed',
    });
  }
}
