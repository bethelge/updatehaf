const db = require('../config/db');

exports.createMedia = (req, res) => {
  const { title, description, media_type } = req.body;
  
  const media_url = req.file ? `/uploads/${req.file.filename}` : req.body.media_url;

  if (!title || !description || !media_url || !media_type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO media_coverage (title, description, media_type, media_url) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, media_type, media_url], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'Media posted successfully' });
  });
};
exports.getAllMedia = (req, res) => {
  const sql = 'SELECT * FROM media_coverage ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
};
exports.deleteMedia = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Media ID is required' });
  }

  const sql = 'DELETE FROM media_coverage WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting media:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.json({ message: 'Media deleted successfully' });
  });
};
exports.updateMedia = (req, res) => {
  const { id } = req.params;
  const { title, description, media_type, media_url } = req.body;

  const updatedUrl = req.file ? `/uploads/${req.file.filename}` : media_url;

  if (!id) {
    return res.status(400).json({ message: 'Media ID is required' });
  }

  const sql = `
    UPDATE media_coverage
    SET title = ?, description = ?, media_type = ?, media_url = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, media_type, updatedUrl, id], (err, result) => {
    if (err) {
      console.error('Error updating media:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.json({ message: 'Media updated successfully' });
  });
};
