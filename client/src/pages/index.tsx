import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../types';
import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='pt-12'>
      <Head>
        <title>Reddit: the front page of the Internet</title>
      </Head>
      <div className='container flex pt-4'>
        {/*  Posts Feed */}
        <div className='w-160'>
          {posts.map((post) => (
            <div key={post.identifier} className='flex mb-4 bg-white rounded'>
              {/*  Vote Section */}
              <div className='w-10 text-center bg-gray-200 rounded-l'>
                <p>V</p>
              </div>
              {/*  POst Data Section */}
              <div className='w-full p-2'>
                <div className='flex items-center'>
                  <Link href={`/r/${post.subName}`}>
                    <Fragment>
                      <img
                        src='https://fmo.unl.edu/utility-services/images/staff-information/y_u_no_photo_Square.png'
                        className='w-6 h-6 mr-1 rounded-full cursor-pointer'
                      />
                      <a className='text-xs font-bold hover:underline'>
                        /r/{post.subName}
                      </a>
                    </Fragment>
                  </Link>

                  <p className='text-xs text-gray-500'>
                    <span className='mx-1'>•</span>
                    Posted by
                    <Link href={`/u/${post.username}`}>
                      <a className='mx-1 hover:underline'>/u/{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className='mx-1 hover:underline'>
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className='my-1 text-lg font-medium'>{post.title}</a>
                </Link>
                {post.body && <p className='my-1 text-sm'>{post.body}</p>}

                <div className='flex'>
                  <Link href={post.url}>
                    <a>
                      <div className='px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                        <i className='mr-1 fas fa-comment-alt fas-xs'></i>
                        <span className='font-bold'>20 Comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                    <i className='mr-1 fas fa-share fas-xs'></i>
                    <span className='font-bold'>Share</span>
                  </div>
                  <div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                    <i className='mr-1 fas fa-bookmark fas-xs'></i>
                    <span className='font-bold'>Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
      </div>
    </div>
  );
}

// SERVER-SIDE RENDERING

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts');

//     return { props: { posts: res.data } };
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } };
//   }
// };
