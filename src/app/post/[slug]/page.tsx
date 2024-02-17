import { GetStaticProps } from "next";
import { sanityClient } from "../../../../sanity";
import { Post } from "../../../../typings";
import Header from "@/components/Header";
import { notFound } from "next/navigation";

interface Props {
  post: Post;
}
export const generateStaticParams = async () => {
  const query = `*[_type=="post"]{
    _id,
    slug {
      current
    }
  }`;
  const posts = await sanityClient.fetch(query);
  // const paths = posts.map((post: Post) => ({
  //   params: {
  //     slug: post.slug.current,
  //   },
  // }));
  // return {
  //   paths,
  //   fallback: "blocking",
  // };
  return posts.map((post: Post) => ({
    slug: post.slug.current,
  }));
};

async function getData(postSlug) {
  const query = `*[_type=="post" && slug.current==$slug][0]{
    _id,
    _createdAt,
    title,
    author->{
      name,
      image
    },
    'comments':*[
      _type=="comment" &&
      post._ref==^._id &&
      approved==true],
      description,
      mainImage,
      slug,
      body
  }`;
  const post = await sanityClient.fetch(query, {
    slug: postSlug,
  });

  if (!post) {
    return notFound();
  }

  return {
    props: {
      post,
    },
  };
}
const Page = async ({ params }) => {
  console.log(params);
  const post = await getData(params.slug);
  console.log(post);
  return (
    <main>
      <Header />
    </main>
  );
};

export default Page;

// export const generateStaticParams = async ({ params }) => {
// const query = `*[_type=="post" && slug.current==$slug][0]{
//   _id,
//   _createdAt,
//   title,
//   author->{
//     name,
//     image
//   },
//   'comments':*[
//     _type=="comment" &&
//     post._ref==^._id &&
//     approved==true],
//     description,
//     mainImage,
//     slug,
//     body
// }`;
// const post = await sanityClient.fetch(query, {
//   slug: params?.slug,
// });

// if (!post) {
//   return {
//     notFound: true,
//   };
// }

// return {
//   props: {
//     post,
//   },
// };
// };
