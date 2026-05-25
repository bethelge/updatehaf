const db = require('../config/db');

const LINK_HOSTS = new Set([
  'youtube.com',
  'youtu.be',
  'facebook.com',
  'fb.watch',
  'm.facebook.com',
]);

function isValidHttpUrl(value) {
  try {
    const u = new URL(String(value).trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isAllowedLinkHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (LINK_HOSTS.has(host)) return true;
    return [...LINK_HOSTS].some((h) => host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function resolveMediaPayload({ body, file, keepMediaUrl }) {
  const { title, description, media_type, youtube_link, external_link, media_url: bodyUrl } = body;
  const type = String(media_type || '').toLowerCase();

  if (!title || !description || !type) {
    return { error: 'Title, description, and media type are required' };
  }

  if (type === 'link') {
    const link = (external_link || youtube_link || bodyUrl || '').trim();
    if (!isValidHttpUrl(link)) {
      return { error: 'A valid YouTube or Facebook URL is required for link posts' };
    }
    if (!isAllowedLinkHost(link)) {
      return { error: 'Link must be a YouTube or Facebook URL' };
    }
    return {
      title,
      description,
      media_type: 'link',
      media_url: link,
      youtube_link: link,
    };
  }

  if (type !== 'image' && type !== 'video') {
    return { error: 'Media type must be image, video, or link' };
  }

  const media_url = file
    ? `/uploads/${file.filename}`
    : (keepMediaUrl || bodyUrl || '').trim() || null;
  if (!media_url) {
    return { error: 'An image or video file is required' };
  }

  const extra = (youtube_link || '').trim();
  if (extra && !isValidHttpUrl(extra)) {
    return { error: 'Optional link must be a valid URL' };
  }

  return {
    title,
    description,
    media_type: type,
    media_url,
    youtube_link: extra || null,
  };
}

exports.createMedia = (req, res) => {
  const payload = resolveMediaPayload({ body: req.body, file: req.file });
  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  const { title, description, media_type, media_url, youtube_link } = payload;

  const sql = 'INSERT INTO media_coverage (title, description, media_type, media_url, youtube_link) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, media_type, media_url, youtube_link], (err, result) => {
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
  if (!id) {
    return res.status(400).json({ message: 'Media ID is required' });
  }

  const payload = resolveMediaPayload({
    body: req.body,
    file: req.file,
    keepMediaUrl: req.body.media_url,
  });

  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  const { title, description, media_type, media_url, youtube_link } = payload;

  const sql = `
    UPDATE media_coverage
    SET title = ?, description = ?, media_type = ?, media_url = ?, youtube_link = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, media_type, media_url, youtube_link, id], (err, result) => {
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
