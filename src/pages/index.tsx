import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { type NextPage } from "next";
import { env } from "../env.mjs";

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
      posts(first: 5) {
        edges {
          node {
            id
            website
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_DATA);
  if (loading) return <p>Loading...</p>;
  console.log(data);
  return data.posts.edges.map((elem: any) => {
    return <li key={elem.node.id}>{elem.node.id}</li>;
  });
};

const Home: NextPage = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <MainData />
        </main>
      </ApolloProvider>
    </>
  );
};

export default Home;
