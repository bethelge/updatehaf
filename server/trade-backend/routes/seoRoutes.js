const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dynamic Sitemap Endpoint
router.get('/sitemap.xml', async (req, res) => {
  try {
    // Fetch products and media for sitemap
    db.query('SELECT id FROM products', (err, products) => {
      if (err) return res.status(500).send('DB error');
      db.query('SELECT id FROM media_coverage', (err2, media) => {
        if (err2) return res.status(500).send('DB error');
        const baseUrl = 'https://hafist.com';
        let urls = [
          { loc: `${baseUrl}/`, priority: '1.0' },
          { loc: `${baseUrl}/about`, priority: '0.8' },
          { loc: `${baseUrl}/products`, priority: '0.8' },
          { loc: `${baseUrl}/success-stories`, priority: '0.8' },
          { loc: `${baseUrl}/media-coverage`, priority: '0.8' },
          { loc: `${baseUrl}/contact`, priority: '0.8' },
        ];
        products.forEach(p => urls.push({ loc: `${baseUrl}/products/${p.id}`, priority: '0.7' }));
        media.forEach(m => urls.push({ loc: `${baseUrl}/media-coverage/${m.id}`, priority: '0.6' }));
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      });
    });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// SEO Data API Endpoint
router.get('/meta/:type/:id', (req, res) => {
  const { type, id } = req.params;
  if (type === 'product') {
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
      if (err || !results.length) return res.status(404).json({ error: 'Not found' });
      const product = results[0];
      res.json({
        title: product.title,
        description: product.description,
        keywords: `${product.title}, ${product.category}, HAF Import`,
        url: `https://hafist.com/products/${product.id}`,
        image: JSON.parse(product.image)[0] || '',
        canonical: `https://hafist.com/products/${product.id}`
      });
    });
  } else if (type === 'media') {
    db.query('SELECT * FROM media_coverage WHERE id = ?', [id], (err, results) => {
      if (err || !results.length) return res.status(404).json({ error: 'Not found' });
      const media = results[0];
      res.json({
        title: media.title,
        description: media.description,
        keywords: `${media.title}, HAF Media Coverage`,
        url: `https://hafist.com/media-coverage/${media.id}`,
        image: media.media_url,
        canonical: `https://hafist.com/media-coverage/${media.id}`
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid type' });
  }
});

module.exports = router;
