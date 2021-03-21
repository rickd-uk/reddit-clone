import React, {
  ChangeEvent,
  createRef,
  Fragment,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import Head from 'next/head';

import classNames from 'classnames';

import { Sub } from '../../types';
import { useAuthState } from '../../context/auth';

import PostCard from '../../components/PostCard';
import Axios from 'axios';

import Sidebar from '../../components/SideBar';

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();

  const subName = router.query.sub;

  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null,
  );

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  // redirect to hompage if reddit not found
  if (error) router.push('/');

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className='text-lg text-center'>Loading...</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = <p className='text-lg text-center'>No posts submitted yet</p>;
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>

      {sub && (
        <Fragment>
          <input
            type='file'
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* Sub info & images */}
          <div>
            {/* Banner Image */}

            {sub.bannerUrl ? (
              // <div
              //   className='h-56 bg-blue-500'
              //   style={{
              //     backgroundImage: `url(${sub.bannerUrl})`,
              //     backgroundRepeat: 'no-repeat',
              //     backgroundSize: 'cover',
              //     backgroundPosition: 'center',
              //   }}></div>
              <Image
                src={sub.bannerUrl}
                alt='Banner'
                className={classNames('h-56 bg-blue-500')}
                onClick={() => openFileInput('banner')}
                layout='responsive'
                width={70}
                height={10}
              />
            ) : (
              <div className='h-20 bg-blue-500'></div>
            )}

            {/* Sub-meta data */}
            <div className='h-20 bg-white'>
              <div className='container relative flex'>
                <div className='absolute' style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt='Sub'
                    className={classNames('rounded-full', {
                      'cursor-pointer': ownSub,
                    })}
                    onClick={() => openFileInput('image')}
                    width={70}
                    height={70}
                  />
                </div>
                <div className='pt-2 pl-40'>
                  <div className='flex items-center'>
                    <h1 className='mb-1 text-2xl font-bold'>{sub.title}</h1>
                  </div>
                  <p className='text-sm font-bold text-gray-500'>
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Posts & Sidebar */}
          <div className='container flex pt-5'>
            <div className='w-160'>{postsMarkup}</div>
            <Sidebar sub={sub}></Sidebar>
          </div>
        </Fragment>
      )}
    </div>
  );
}
