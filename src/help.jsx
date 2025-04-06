<section ref={thingsToDoRef} className="py-12 scroll-mt-20 w-full">
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4 px-4 sm:px-6 md:px-8">
  {/* Left Section */}
  <div className="col-span-1">
    <h2 className="text-[#14142b] text-xl font-semibold sm:text-2xl">
      161 things to do
    </h2>
    <p className="text-xs sm:text-sm leading-relaxed sm:leading-loose text-[#a0a3bd] mt-2">
      Get a curated list of all the best things to do with exact
      location, detailed info and inspiring content
    </p>

    <a
      href="#"
      className="text-blue-600 font-medium hover:underline mt-4 inline-block transition duration-200"
    >
      Preview for FREE
    </a>
  </div>

  {/* Right Section */}
  <div className="col-span-1 lg:col-span-3 relative">
    {/* Scroll Buttons */}
    <button
      onClick={prev}
      disabled={startIndex === 0}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 disabled:opacity-30"
    >
      <ArrowLeft size={18} />
    </button>
    <button
      onClick={next}
      disabled={endIndex >= activities.length}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 disabled:opacity-30"
    >
      <ArrowRight size={18} />
    </button>

    {/* Activity Cards */}
    <div className="overflow-x-auto">
      <div className="flex gap-4 sm:gap-6 min-w-full px-1 sm:px-4 md:px-6">
        {activities.slice(startIndex, endIndex).map((activity) => (
          <div
            key={activity.id}
            className="min-w-[250px] sm:min-w-[300px] max-w-[90vw] flex-shrink-0"
          >
            <div className="relative">
              <img
                src={activity.img}
                alt={activity.title}
                className="w-full h-64 sm:h-80 object-cover rounded-[16px]"
              />
              <button
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                onClick={() => toggleFavorite(activity.id)}
              >
                {favorites[activity.id] ? (
                  <Favorite
                    className="text-red-500"
                    fontSize="small"
                  />
                ) : (
                  <FavoriteBorder
                    className="text-gray-500"
                    fontSize="small"
                  />
                )}
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1 gap-1">
                {activity.icon} {activity.category}
              </div>
              <h3 className="font-medium text-base sm:text-lg">
                {activity.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
</section>