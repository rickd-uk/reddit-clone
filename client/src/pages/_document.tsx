import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Reddit</title>
          <link rel='icon' type='image/svg+xml' href='/reddit.svg'></link>
          <meta property='og:site_name' content='reddit' />
          {/* <meta property='twitter:site' content='@reddit' /> */}
          <meta property='twitter:card' content='summary' />
          <meta property='og:type' content='website' />
          <meta
            property='og:image'
            content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/reddit.svg`}
          />
          <meta
            property='twitter:image'
            content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/reddit.svg`}
          />
          <link rel='preconnect' href='https://fonts.gstatic.com' />

          <link
            href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css'
            integrity='sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=='
            crossOrigin='anonymous'
          />
        </Head>
        <body className='font-body' style={{ backgroundColor: '#DAE0E6' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
