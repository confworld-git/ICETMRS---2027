import React from "react";
import SpeakersData from "./SpeakersData";

const ROLE_ORDER = [
  "Welcome Address",
  "Guest of Honour",
  "Conference Chair",
  "Keynote Speakers",
  "Session Speakers",
  "Session Chairs",
];

const ROLE_COLORS = {
  "Welcome Address": "text-[#1F06AC]",
  "Guest of Honour": "text-[#1F06AC]",
  "Conference Chair": "text-[#1F06AC]",
  "Keynote Speakers": "text-[#1F06AC]",
  "Session Speakers": "text-[#1F06AC]",
  "Session Chairs": "text-[#1F06AC]",
};

const BADGE_COLORS = {
  "Welcome Address": "bg-[#1F06AC] text-[#1F06AC] border border-[#1F06AC]",
  "Guest of Honour": "bg-[#1F06AC] text-[#1F06AC] border border-[#1F06AC]",
  "Conference Chair": "bg-[#1F06AC] text-[#1F06AC] border border-[#1F06AC]",
  "Keynote Speakers": "bg-[#1F06AC] text-[#1F06AC] border border-[#1F06AC]",
  "Session Speakers": "bg-green-50 text-green-700 border border-green-200",
  "Session Chairs": "bg-orange-50 text-orange-700 border border-orange-200",
};

const Speakers = () => {
  const speakersByRole = SpeakersData.reduce((acc, speaker) => {
    const role = speaker.role || "Session Speakers";
    if (!acc[role]) acc[role] = [];
    acc[role].push(speaker);
    return acc;
  }, {});

  const sortedRoles = ROLE_ORDER.filter((role) => speakersByRole[role]);

  const SpeakerSkeleton = () => {
    return (
      <div className="mt-12">
        {/* Heading Skeleton */}
        <div className="flex flex-col items-center text-center mb-8 px-4">
          <h1 className="text-lg md:text-2xl font-semibold text-[#1F06AC]">
            Information about our speakers will be updated soon.
          </h1>
        </div>

        {/* Speaker Cards Skeleton */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12 mb-12">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center border border-gray-100 animate-pulse"
            >
              {/* Image */}
              <div className="w-[200px] h-[200px] rounded-full bg-gray-200 mb-4" />

              {/* Name */}
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />

              {/* Details */}
              <div className="w-full space-y-2 flex flex-col items-center">
                <div className="h-3 w-4/5 bg-gray-200 rounded" />
                <div className="h-3 w-3/5 bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      {/* <div className="relative" data-aos="fade-up">
        <img
          className="absolute z-[-10] h-full w-full object-cover"
          src="/images/speakers-banner.webp"
          alt="speakers-banner"
          width={800}
          height={400}
          loading="lazy"
        />
        <h1 className="relative">
          <svg
            viewBox="0 0 500 60"
            className="w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              style={{
                fontSize: "45px",
                fontWeight: "bold",
                fill: "none",
                stroke: "white",
                strokeWidth: "2px",
                paintOrder: "stroke",
                strokeLinejoin: "round",
              }}
              className="text-[30px] sm:text-[45px]"
            >
              Conference Speakers
            </text>
          </svg>
        </h1>
      </div> */}

      {/* Role Sections */}
      {/* Role Sections */}
      {SpeakersData.length === 0 ? (
        <div className="mt-12">
          <SpeakerSkeleton />
        </div>
      ) : (
        sortedRoles.map((role, roleIndex) => (
          <div
            key={role}
            className={`${
              roleIndex > 0 ? "mt-16 pt-8 border-t border-gray-200" : "mt-12"
            }`}
          >
            {/* Role Title */}
            <div className="text-center mb-8">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-3 ${ROLE_COLORS[role]}`}
              >
                {role}
              </h2>
            </div>

            {/* Speakers Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12 mb-12">
              {speakersByRole[role].map(
                (
                  {
                    image,
                    name,
                    title,
                    title2,
                    title3,
                    title4,
                    title5,
                    title6,
                    back,
                  },
                  index,
                ) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 p-5 flex flex-col items-center h-auto border border-green-100"
                  >
                    <img
                      src={image}
                      alt={name}
                      style={{
                        objectPosition: back === "top" ? "top" : "center",
                      }}
                      width={200}
                      height={200}
                      loading="lazy"
                      className="w-[200px] h-[200px] rounded-full object-cover border-4 border-indigo-400 p-1 mb-3"
                    />

                    <h2 className="text-base font-semibold text-center text-[#1F06AC]">
                      {name}
                    </h2>

                    <div className="text-center text-xs space-y-0.5 flex-1 w-full">
                      {title && <p>{title}</p>}
                      {title2 && <p>{title2}</p>}
                      {title3 && <p>{title3}</p>}
                      {title4 && <p>{title4}</p>}
                      {title5 && <p>{title5}</p>}
                      {title6 && <p>{title6}</p>}
                    </div>
                  </div>
                ),
              )}
            </section>
          </div>
        ))
      )}
    </div>
  );
};

export default Speakers;
