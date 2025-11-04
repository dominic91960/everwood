import express from 'express';
import { ContentService } from './service';

const router = express.Router();

// POST /contents -- create content
router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2)); // Debug log
    console.log('Tags in request:', req.body.tags); // Debug log
    const saved = await ContentService.createContent(req.body);
    res.status(201).json({ message: 'Content saved successfully!', data: saved });
  } catch (e: unknown) {
    console.error('Error creating content:', e); // Debug log
    const errorMessage = e instanceof Error ? e.message : 'Failed to save content';
    res.status(500).json({ error: errorMessage });
  }
});

// GET /contents -- list all (with filters)
router.get('/', async (req, res) => {
  try {
    const { mode, type, category } = req.query;
    const result = await ContentService.listContents({
      mode: mode as string,
      type: type as string,
      category: category as string,
    });
    res.json(result);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to get contents';
    res.status(500).json({ error: errorMessage });
  }
});

// GET /contents/:id -- get content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await ContentService.getContentById(req.params.id);
    res.json(content);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Not found';
    res.status(404).json({ error: errorMessage });
  }
});

// PUT /contents/:id -- update content
router.put('/:id', async (req, res) => {
  try {
    const updated = await ContentService.updateContent(req.params.id, req.body);
    res.json({ message: 'Content updated successfully', data: updated });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Update failed';
    res.status(400).json({ error: errorMessage });
  }
});

// DELETE /contents/:id -- delete content
router.delete('/:id', async (req, res) => {
  try {
    await ContentService.deleteContent(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Delete failed';
    res.status(404).json({ error: errorMessage });
  }
});

// GET /contents/upcoming-blog
router.get('/upcoming-blog', async (_req, res) => {
  try {
    const allBlogs = await ContentService.listContents({ mode: 'PUBLISHED', type: 'BLOG' });
    const now = new Date();
    const upcoming = allBlogs
      .filter(blog => blog.time && blog.time instanceof Date && new Date(blog.time) > now)
      .sort((a, b) => {
        const timeA = a.time instanceof Date ? a.time.getTime() : new Date(a.time || 0).getTime();
        const timeB = b.time instanceof Date ? b.time.getTime() : new Date(b.time || 0).getTime();
        return timeA - timeB;
      });
    if (upcoming.length === 0) {
      res.status(404).json({ error: 'No upcoming news updates found' });
      return;
    }
    res.json(upcoming[0]);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch';
    res.status(500).json({ error: errorMessage });
  }
});

// GET /contents/upcoming-event
router.get('/upcoming-event', async (_req, res) => {
  try {
    const allEvents = await ContentService.listContents({ mode: 'PUBLISHED', type: 'EVENTS' });
    const now = new Date();
    const upcoming = allEvents
      .filter(event => event.time && event.time instanceof Date && new Date(event.time) > now)
      .sort((a, b) => {
        const timeA = a.time instanceof Date ? a.time.getTime() : new Date(a.time || 0).getTime();
        const timeB = b.time instanceof Date ? b.time.getTime() : new Date(b.time || 0).getTime();
        return timeA - timeB;
      });
    if (upcoming.length === 0) {
      res.status(404).json({ error: 'No upcoming events found' });
      return;
    }
    res.json(upcoming[0]);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch';
    res.status(500).json({ error: errorMessage });
  }
});

// GET /contents/upcoming-events (max 5)
router.get('/upcoming-events', async (_req, res) => {
  try {
    const allEvents = await ContentService.listContents({ mode: 'PUBLISHED', type: 'EVENTS' });
    const now = new Date();
    const upcoming = allEvents
      .filter(event => event.time && event.time instanceof Date && new Date(event.time) > now)
      .sort((a, b) => {
        const timeA = a.time instanceof Date ? a.time.getTime() : new Date(a.time || 0).getTime();
        const timeB = b.time instanceof Date ? b.time.getTime() : new Date(b.time || 0).getTime();
        return timeA - timeB;
      });
    if (upcoming.length === 0) {
      res.status(404).json({ error: 'No upcoming events found' });
      return;
    }
    res.json(upcoming.slice(0, 5));
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
