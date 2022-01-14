import Link from "next/link";
import Head from "next/head";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_GET_VIDEO_URL = "https://www.googleapis.com/youtube/v3/videos";

export async function getStaticPaths() {
  const response = await fetch(
    `${YOUTUBE_SEARCH_URL}?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=snippet,id&type=video&order=date&maxResults=15`
  );
  const data = await response.json();
  return {
    paths: data.items.map((item) => {
      return {
        params: {
          id: `${item.id.videoId}`,
        },
        
      };
    }),
    fallback: false,
    
  };
}

export async function getStaticProps({ params }) {
  // fetch single post detail
  const response = await fetch(
    `${YOUTUBE_GET_VIDEO_URL}?id=${params.id}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`
  );
  const video = await response.json();
  return {
    props: video,
  };
  revalidate: 60
}

export default function Video(video) {
  const videoId = video.items[0].id;
  const title = video.items[0].snippet.title;
  const publishDate = video.items[0].snippet.publishedAt;

  // console.log("video", videoId, title, publishDate);
  return (
    <main style={{ padding: "20px" }}>
      <Head>
        <title>title</title>
      </Head>

      <section>
        <Link href="/">
          <a>Ana Sayfa</a>
        </Link>
      </section>
      <hr />
      <p>{title}</p>
      <p>{publishDate}</p>

      <iframe
        loading="lazy"
        width="800"
        height="500"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&enablejsapi=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </main>
  );
}
