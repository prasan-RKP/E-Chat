import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const PostCarousel = ({ posts, onClose, initialIndex }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50"
    >
      <div className="relative w-[90%] max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-50 shadow-lg transition-transform transform hover:scale-110"
        >
          <X size={24} />
        </button>

        {/* Swiper Carousel */}
        <Swiper
          initialSlide={initialIndex}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          effect="creative"
          grabCursor={true} // ✅ Improves dragging feel
          simulateTouch={true} // ✅ Enables touchpad gestures
          touchEventsTarget="container" // ✅ Detects touch gestures correctly
          centeredSlides={true}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-120%", 0, -500],
            },
            next: {
              shadow: true,
              translate: ["120%", 0, -500],
            },
          }}
          modules={[Navigation, Pagination, EffectCreative]}
          className="w-full h-[450px] md:h-[550px] lg:h-[600px] rounded-lg overflow-hidden"
        >
          {posts.map((post) => (
            <SwiperSlide key={post._id}>
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4 rounded-lg">
                <img
                  src={post.postImage}
                  alt={post.title}
                  className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-lg shadow-md"
                />
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-white">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mt-2">{post.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  );
};

export default PostCarousel;
