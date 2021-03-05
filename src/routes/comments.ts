import { Request, Response, Router } from 'express';
import Post from '../entities/Post';
import Comment from '../entities/Comment';
import auth from '../middleware/auth';

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  console.log(identifier, ' ', slug);

  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    });

    await comment.save();

    return res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'Post not found' });
  }
};

const router = Router();

router.post('/:identifier/:slug', auth, commentOnPost);

export default router;
