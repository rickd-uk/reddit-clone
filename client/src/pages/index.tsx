import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useSWR from 'swr';

import PostCard from '../components/PostCard';

import { Post } from '../types';
import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR('/posts');
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get('/posts')
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>Reddit: the front page of the Internet</title>
      </Head>
      <div className='container flex pt-4'>
        {/*  Posts Feed */}
        <div className='w-160'>
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>

        {/* Sidebar */}
      </div>
    </Fragment>
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
