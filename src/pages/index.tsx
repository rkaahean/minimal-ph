import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { type NextPage } from "next";
import { env } from "../env.mjs";
import {
  ChatBubbleBottomCenterIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";

const client = new ApolloClient({
  uri: "https://api.producthunt.com/v2/api/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${env.NEXT_PUBLIC_PH_API_TOKEN}`,
  },
});

const MainData = () => {
  const GET_DATA = gql`
    query GetData {
      posts(first: 10) {
        edges {
          node {
            id
            name
            website
            url
            commentsCount
            votesCount
            thumbnail {
              url(width: 100, height: 100)
            }
            tagline
            makers {
              id
              name
              url
              profileImage(size: 100)
            }
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_DATA);
  if (loading) return <p>Loading...</p>;

  console.log(data);

  return data.posts.edges.map((elem: any) => {
    return (
      <Post
        id={elem.node.name}
        name={elem.node.name}
        icon={elem.node.thumbnail.url}
        tagline={elem.node.tagline}
        links={{
          ph: elem.node.url,
          website: elem.node.website,
        }}
        makers={elem.node.makers}
        commentsCount={elem.node.commentsCount}
        votesCount={elem.node.votesCount}
      />
    );
  });
};

const Home: NextPage = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <main className="items-left flex min-h-screen flex-col justify-center bg-black bg-gradient-to-b from-[#000000] to-[#0a0101] pl-20">
          <MainData />
        </main>
      </ApolloProvider>
    </>
  );
};

const Post = (post: Post) => {
  return (
    <div
      className="my-0.5 flex w-3/5 border border-[#0D0D0D] bg-[#0D0D0D] p-4 text-white hover:border-stone-600 "
      key={post.id}
    >
      <img className="h-14 w-14 rounded-full" src={post.icon} />
      <div className="font-mono ml-5 mr-3 w-4/12 truncate text-left text-3xl font-thin text-neutral-300">
        <span className="align-middle">{post.name}</span>
      </div>
      <div className="mx-1 flex w-4/12 flex-col">
        <div className="truncate text-lg tracking-tight text-slate-400">
          {post.tagline}
        </div>
        <div className="mt-2 flex flex-row font-montserrat text-sm font-medium text-sky-600">
          <a href={post.links.ph} target="_blank" className="mr-4">
            Product Hunt Link
          </a>
          <a href={post.links.website} target="_blank">
            Website
          </a>
        </div>
      </div>
      <div className="mb-1 mt-0 ml-5 flex w-2/12 -space-x-4">
        {post.makers.map((maker) => {
          return (
            <a href={maker.url} target="_blank">
              <img
                className="h-10 w-10 rounded-full border-white dark:border-gray-800"
                src={maker?.profileImage}
                alt={maker?.name}
              />
            </a>
          );
        })}
      </div>
      <div className="flex w-2/12 flex-col items-end">
        <div className="flex flex-row">
          <div className="mx-2 text-lg text-sky-800">{post.commentsCount}</div>
          <ChatBubbleBottomCenterIcon className="mt-1 h-5 w-5 text-gray-700" />
        </div>
        <div className="flex flex-row">
          <div className="mx-2 text-lg text-green-800">{post.votesCount}</div>
          <ArrowUpIcon className=" mt-1 h-5 w-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

interface Post {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  links: {
    ph: string;
    website: string;
  };
  makers: Makers[];
  votesCount: number;
  commentsCount: number;
}

interface Makers {
  id: string;
  name: string;
  url: string;
  profileImage: string;
}
export default Home;
