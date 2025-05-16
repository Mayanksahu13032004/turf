'use client';
import Image from "next/image";
import vollyball from "../../app/_components/assets/volley.png.jpg";
import circket from "../../app/_components/assets/circket.jpg";
import badminto from "../../app/_components/assets/badminton.jpg";
import golf from "../../app/_components/assets/golf.png";

const Vlog = () => {
  const blogs = [
    { title: "Learn Volleyball in 5!", image: vollyball },
    { title: "Names Celebrated by Cr...", image: circket },
    { title: "Easy-to-Learn Badminton...", image: badminto },
    { title: "A Spectator’s Guide to G...", image: golf },
  ];

  return (
    <div className="bg-gray-100 p-10 rounded-2xl">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">
        Blogs to Keep You Fit!
      </h2>

      <div className="flex overflow-x-auto space-x-8 pb-6 scrollbar-thin scrollbar-thumb-gray-400">
        {blogs.map((blog, idx) => (
          <div
            key={idx}
            className="min-w-[320px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
          >
            <div className="relative h-60 overflow-hidden rounded-t-2xl">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition duration-300"></div>
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-semibold text-gray-800">
                {blog.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vlog;
