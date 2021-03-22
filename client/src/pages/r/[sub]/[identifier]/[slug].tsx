import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Image from 'next/image';

import classNames from 'classNames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../../../../types';
import React from 'react';
import SideBar from '../../../../components/SideBar';

import ActionButton from '../../../../components/ActionButton';

import { useAuthState } from '../../../../context/auth';

dayjs.extend(relativeTime);

export default function PostPage() {
  // Local state

  // Global state
  const { authenticated } = useAuthState();

  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null,
  );

  if (error) router.push('/');

  const vote = async (value: number) => {
    // If not logged in, go to login
    if (!authenticated) router.push('/login');

    // If vote is the same, reset vote
    if (value === post.userVote) value = 0;

    try {
      const res = await Axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className='flex items-center w-full h-20 p-8 bg-blue-500'>
            <div className='container flex'>
              {post && (
                <div className='w-8 h-8 mr-2 overflow-hidden rounded-full'>
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}></Image>
                </div>
              )}
              <p className='text-xl text-white font-semi-bold'>/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className='container flex pt-5'>
        {/* Post */}
        <div className='w-160'>
          <div className='bg-white rounded'>
            {post && (
              <div className='flex'>
                {/*  Vote Section */}
                <div className='w-10 py-3 text-center rounded-l'>
                  {/* Upvote */}
                  <div
                    className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(1)}>
                    <i
                      className={classNames('icon-arrow-up', {
                        'text-red-500': post.userVote === 1,
                      })}></i>
                  </div>
                  <p className='font-bold font-xs'>{post.voteScore}</p>

                  {/* Downvote */}
                  <div
                    className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(-1)}>
                    <i
                      className={classNames('icon-arrow-down', {
                        'text-blue-600': post.userVote === -1,
                      })}></i>
                  </div>
                </div>
                <div className='p-2'>
                  <div className='flex items-center'>
                    <p className='text-xs text-gray-500'>
                      Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className='mx-1 hover:underline'>
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={post.url}>
                        <a className='mx-1 hover:underline'>
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* Post Title */}
                  <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                  {/* Post Body */}
                  <p className='my-3 text-sm'>{post.body}</p>
                  {/* Actions */}
                  <div className='flex'>
                    <Link href={post.url}>
                      <a>
                        <ActionButton>
                          <div className=''>
                            <i className='mr-1 fas fa-comment-alt fas-xs'></i>
                            <span className='font-bold'>
                              {post.commentCount} Comments
                            </span>
                          </div>
                        </ActionButton>
                      </a>
                    </Link>
                    <ActionButton>
                      <i className='mr-1 fas fa-share fas-xs'></i>
                      <span className='font-bold'>Share</span>
                    </ActionButton>
                    <ActionButton>
                      <i className='mr-1 fas fa-bookmark fas-xs'></i>
                      <span className='font-bold'>Save</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <SideBar sub={post.sub} />}
      </div>
    </>
  );
}
