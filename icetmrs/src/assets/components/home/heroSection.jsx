import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  const mobileSwiperRef = useRef(null);
  const desktopSwiperRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2027-10-18T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    "/images/commonhero/10.webp",
    "/images/commonhero/1.webp",
    "/images/commonhero/2.webp",
    "/images/commonhero/3.webp",
    "/images/commonhero/4.webp",
  ];

  return (
    <section>
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 overflow-hidden">
        {/* Simple Wave Background */}
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-64 opacity-10"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#4f46e5"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            className="absolute top-0 right-0 w-full h-64 opacity-10 transform rotate-180"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#f59e0b"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="z-10 w-full px-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 py-4 lg:py-8">
              {/* Main Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F06AC]">
                2<sup>nd</sup> International Conference on Emerging Trends in
                Multidisciplinary Research Studies
                <span className="text-lg sm:text-xl lg:text-3xl text-[#aa0053] mt-2">
                  {" "}
                  (ICETMRS-2027)
                </span>
              </h1>

              {/* Theme */}
              <div className="flex flex-col">
                <p className="text-base sm:text-lg">
                  <span className="font-bold">Theme: </span>
                  <span className="font-semibold">
                    "Sustainable Learning Through Multidisciplinary Research and
                    Technological Innovation"
                  </span>
                </p>
                <p className="text-base sm:text-lg font-semibold text-[#aa0053]">
                  Hybrid Conference: In Person + Online
                </p>
                <p className="text-base sm:text-lg">
                  <span className="font-bold">Organized by: </span>
                  <span className="font-semibold">
                    {" "}
                    GlobalNxt University, Malaysia and
                  </span>{" "}
                  <br />
                  <span className="font-semibold">
                    {" "}
                    Confworld Educational Research and Development Association
                  </span>
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  <span className="font-bold">ISBN: </span>
                  <span className="font-semibold">978-37-977929-3-8</span>
                </p>
              </div>

              {/* Conference Details - Simple Modern Cards */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
                {/* Date Card */}
                <div className="flex items-center gap-3 bg-[#1F06AC] px-4 py-3 rounded-xl shadow-md border-l-4 border-indigo-600 hover:shadow-lg transition-shadow">
                  <div className="bg-[#fff] p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-[#aa0053]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-calendar-days preview-icon"
                    >
                      <path d="M8 2v3" />
                      <path d="M16 2v3" />
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M8 13h.01" />
                      <path d="M12 13h.01" />
                      <path d="M16 13h.01" />
                      <path d="M8 17h.01" />
                      <path d="M12 17h.01" />
                      <path d="M16 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-200 font-medium block">
                      Date
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white">
                      18–19 Oct, 2027
                    </p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-3 bg-[#aa0053] px-4 py-3 rounded-xl shadow-md border-l-4 border-[#aa0053] hover:shadow-lg transition-shadow">
                  <div className="bg-[#ffffff] p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-[#1F06AC]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-map-pin preview-icon"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-200 font-medium block">
                      Location
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white">
                      Seoul, South Korea
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Elegant Countdown */}
              <div className="flex justify-center md:justify-start">
                <div className=" px-4">
                  <div className="flex gap-4 sm:gap-6">
                    {[
                      { label: "Days", value: timeLeft.days, color: "[#1F06AC]" },
                      {
                        label: "Hours",
                        value: timeLeft.hours,
                        color: "[#1F06AC]",
                      },
                      {
                        label: "Minutes",
                        value: timeLeft.minutes,
                        color: "[#aa0053]",
                      },
                      {
                        label: "Seconds",
                        value: timeLeft.seconds,
                        color: "[#aa0053]",
                      },
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`text-3xl sm:text-4xl font-bold text-${item.color} mb-1`}
                        >
                          {item.value.toString().padStart(2, "0")}
                        </div>
                        <span className="text-xs text-[#1F06AC] font-medium uppercase tracking-wide">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Video */}
            <div className="flex w-full min-w-0 justify-center lg:justify-end py-6 lg:py-0">
              <div className="relative w-full min-w-0 max-w-lg lg:max-w-none">
                {/* Mobile Video */}
                <div className="lg:hidden relative group w-full min-w-0 max-w-full mx-auto aspect-[16/10] sm:aspect-video overflow-hidden border border-indigo-800 sm:border-2 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl">
                  <Swiper
                    onSwiper={(swiper) => (mobileSwiperRef.current = swiper)}
                    modules={[Autoplay, EffectFade, Navigation, Pagination]}
                    effect="fade"
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    loop={true}
                    className="!w-full !max-w-full h-full [&_.swiper-pagination]:bottom-1 sm:[&_.swiper-pagination]:bottom-2 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:h-1.5 sm:[&_.swiper-pagination-bullet]:w-2 sm:[&_.swiper-pagination-bullet]:h-2"
                    style={{
                      "--swiper-navigation-color": "#fbbf24",
                      "--swiper-pagination-color": "#fbbf24",
                      "--swiper-navigation-size": "20px",
                    }}
                  >
                    {heroSlides.map((src, index) => (
                      <SwiperSlide key={index} className="!w-full !max-w-full">
                        <img
                          src={src}
                          alt={`Conference Slide ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {/* Mobile Navigation Buttons */}
                  <button
                    onClick={() => mobileSwiperRef.current?.slidePrev()}
                    aria-label="Previous conference slide"
                    className="hero-mobile-prev absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md text-indigo-800 hover:bg-white transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => mobileSwiperRef.current?.slideNext()}
                    aria-label="Next conference slide"
                    className="hero-mobile-next absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md text-indigo-800 hover:bg-white transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Desktop Video */}
                <div className="hidden py-12 lg:block w-full h-[500px] mx-auto">
                  <div className="w-full mx-auto h-auto bg-gradient-to-br from-indigo-700 to-indigo-600 rounded-2xl shadow-2xl p-1">
                    <div className="w-full h-[400px] bg-indigo-800 overflow-hidden ring-2 ring-[#aa0053] ring-offset-2 ring-offset-indigo-700 rounded-xl relative group">
                      <Swiper
                        onSwiper={(swiper) =>
                          (desktopSwiperRef.current = swiper)
                        }
                        modules={[Autoplay, EffectFade, Navigation, Pagination]}
                        effect="fade"
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full h-full"
                        style={{
                          "--swiper-navigation-color": "#fbbf24",
                          "--swiper-pagination-color": "#fbbf24",
                          "--swiper-navigation-size": "30px",
                        }}
                      >
                        {heroSlides.map((src, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={src}
                              alt={`Conference Slide ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {/* Desktop Navigation Buttons */}
                      <button
                        onClick={() => desktopSwiperRef.current?.slidePrev()}
                        className="hero-desktop-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl text-indigo-800 hover:bg-indigo-50 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => desktopSwiperRef.current?.slideNext()}
                        className="hero-desktop-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl text-indigo-800 hover:bg-indigo-50 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
