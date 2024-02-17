import Banner from "@/components/Banner";
import Header from "@/components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Link from "next/link";
interface Props {
  posts: Post[];
}

async function getData() {
  const query = `*[_type=="post"]{_id,title,author->{name,image},description,mainImage,slug}`;

  const res = await sanityClient.fetch(query);

  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }

  return res;
}
export default async function Home() {
  const posts: Post[] = await getData();
  console.log(posts);
  return (
    <main className="">
      <Header />
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()}
                alt=""
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p>{post.title}</p>
                  <p>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={urlFor(post.author.image).url()}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

// export const getServerSideProps = async () => {
//   const query = `*[_type=="post"]{_id,title,author->{name,image},description,mainImage,slug}`;

//   const posts = await sanityClient.fetch(query);

//   return {
//     props: {
//       posts,
//     },
//   };
// };
