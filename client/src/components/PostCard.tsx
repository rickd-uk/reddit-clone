import React from 'react';
import Link from 'next/link';
import { Post } from '../types';
import ActionButton from './ActionButton';

import classNames from 'classNames';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Axios from 'axios';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  revalidate?: Function;
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
  },
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if (value === userVote) value = 0;
    try {
      const res = await Axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });
      if (revalidate) revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={identifier}
      className='flex mx-2 my-2 bg-white rounded md:mx-4 md:my-2'
      id={identifier}>
      {/*  Vote Section */}
      <div className='w-10 py-3 text-center bg-gray-200 rounded-l'>
        {/* Upvote */}
        <div
          className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(1)}>
          <i
            className={classNames('icon-arrow-up', {
              'text-red-500': userVote === 1,
            })}></i>
        </div>
        <p className='font-bold font-xs'>{voteScore}</p>

        {/* Downvote */}
        <div
          className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(-1)}>
          <i
            className={classNames('icon-arrow-down', {
              'text-blue-600': userVote === -1,
            })}></i>
        </div>
      </div>
      {/*  Data Section */}
      <div className='w-full p-2'>
        <div className='flex items-center'>
          <Link href={`/r/${subName}`}>
            <img
              src='https://fmo.unl.edu/utility-services/images/staff-information/y_u_no_photo_Square.png'
              className='w-6 h-6 mr-1 rounded-full cursor-pointer'
            />
            {/* <a className='text-xs font-bold hover:underline'>/r/{subName}</a> */}
          </Link>
          <Link href={`/r/${subName}`}>
            <a className='text-xs font-bold hover:underline'>/r/{subName}</a>
          </Link>

          <p className='text-xs text-gray-500'>
            <span className='mx-1'>•</span>
            Posted by
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline'>/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        {body && <p className='my-1 text-sm'>{body}</p>}

        <div className='flex'>
          <Link href={url}>
            <a>
              <ActionButton>
                <div className=''>
                  <i className='mr-1 fas fa-comment-alt fas-xs'></i>
                  <span className='font-bold'>{commentCount} Comments</span>
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
  );
}
