export default async (req, res) => {
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxtud-3jIpdPykYLQ88uKLwSbV9blvNUFaLZauOf896gFulWEmwseEKkdKwN3ZsUYmlJA/exec';

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end(); // No Content
    return;
  }

if (req.method === 'POST') {
  try {
    console.log('Request body:', req.body);

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    console.log('Response status:', response.status, response.statusText);

    const contentType = response.headers.get('Content-Type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      // Parse JSON response
      data = await response.json();
      console.log('Response from GAS (JSON):', data);

      // Handle specific JSON structures
      if (data.link) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ link: data.link });
      } else if (data.base64html) {
        // Pass the base64html as-is without decoding
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ base64html: data.base64html });
      } else {
        throw new Error('JSON response does not contain expected keys (link or base64html)');
      }
    } else if (contentType && contentType.includes('text/html')) {
      // Handle plain HTML response
      data = await response.text();
      console.log('Response from GAS (HTML):', data);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).send(data);
    } else {
      throw new Error(`Unexpected content type from GAS: ${contentType}`);
    }
  } catch (error) {
    console.error('Error communicating with GAS:', error.message);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      error: 'Error communicating with GAS',
      details: error.message,
    });
  }
} else {
  // Handle unsupported HTTP methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}

};
