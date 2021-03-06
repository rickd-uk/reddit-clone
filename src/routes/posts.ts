import { Request, Response, Router } from 'express';

import auth from '../middleware/auth';
import Post from '../entities/Post';
import Sub from '../entities/Sub';

// nfn - shortcut
const createPost = async (req: Request, res: Response) => {
  // dob - shortcut
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title.trim === '') {
    return res.status(400).json({ title: 'Title must not be empty' });
  }

  try {
    // find sub
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: 'DESC' },
    });

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const posts = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      { relations: ['sub'] },
    );

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'Post not found' });
  }
};

const router = Router();

router.post('/', auth, createPost);
router.get('/', getPosts);
router.get('/:identifier/:slug', getPost);

export default router;
