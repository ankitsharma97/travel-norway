import React, { useState, useRef, useEffect } from "react";
import {
  ArrowBack,
  Expand,
  Search,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowUpward,
} from "@mui/icons-material";
import { User, MessageSquare, Map, Download, Route } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import MapView from "./components/MapView";
import { Car, Utensils, Mountain, ArrowLeft, ArrowRight } from "lucide-react";
import { Globe, Instagram, Twitter } from "lucide-react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ChevronLeft, Menu, X } from "lucide-react";

function App() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [favorites, setFavorites] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Refs for each section to enable smooth scrolling
  const homeRef = useRef(null);
  const thingsToDoRef = useRef(null);
  const mapRef = useRef(null);
  const itineraryRef = useRef(null);
  const bookingRef = useRef(null);
  const chatRef = useRef(null);

  // Handle resize event to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Update how many cards to show based on screen size
      if (window.innerWidth < 640) {
        // Small mobile
        setEndIndex(startIndex + 1);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setEndIndex(startIndex + 2);
      } else {
        // Desktop
        setEndIndex(startIndex + 3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [startIndex]);

  // Handle scroll event to update active section and show/hide scroll-to-top button\
  const [showHeader, setShowHeader] = useState(true);
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100;

    // Show scroll-to-top button when scrolled down
    if (scrollPosition > 500) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }

    // Update active section based on scroll position
    if (
      thingsToDoRef.current &&
      scrollPosition >= thingsToDoRef.current.offsetTop &&
      mapRef.current &&
      scrollPosition < mapRef.current.offsetTop
    ) {
      setActiveSection("thingstodo");
      setShowHeader(false);
    } else if (
      mapRef.current &&
      scrollPosition >= mapRef.current.offsetTop &&
      itineraryRef.current &&
      scrollPosition < itineraryRef.current.offsetTop
    ) {
      setActiveSection("map");
      setShowHeader(true);
    } else if (
      itineraryRef.current &&
      scrollPosition >= itineraryRef.current.offsetTop &&
      chatRef.current &&
      scrollPosition < chatRef.current.offsetTop
    ) {
      setActiveSection("itinerary");
      setShowHeader(false);
    } else if (chatRef.current && scrollPosition >= chatRef.current.offsetTop) {
      setActiveSection("chat");
      setShowHeader(false);
    } else {
      setActiveSection("home");
      setShowHeader(true);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 20,
      behavior: "smooth",
    });
  };

  // Toggle favorite status for activities
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll to top button handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activities = [
    {
      id: 1,
      img: "https://cdn.prod.rexby.com/image/7d1ae366-da86-4bff-95dd-a0c12b5c160e",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "One of my favourite spots",
    },
    {
      id: 2,
      img: "https://cdn.prod.rexby.com/image/79f7722f-946c-4676-a746-7071caff82d9",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "Swing with amazing views",
    },
    {
      id: 3,
      img: "https://cdn.prod.rexby.com/image/e5d98dda-0943-4ad9-b33c-ac41d1721742",
      icon: <Mountain size={16} />,
      category: "Hike",
      title: "Beautiful view point",
    },
    {
      id: 4,
      img: "https://cdn.prod.rexby.com/image/c2c3b8f2-2542-42bb-bd67-355cf1726aa9",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "Hidden waterfall",
    },
    {
      id: 5,
      img: "https://cdn.prod.rexby.com/image/fd88e63f-f474-4619-a0a1-2144303657a6",
      icon: <Utensils size={16} />,
      category: "Food",
      title: "Local cuisine experience",
    },
    {
      id: 6,
      img: "https://cdn.prod.rexby.com/image/d80440c7-36f3-49f7-b69b-b390f0cf7b8f",
      icon: <Mountain size={16} />,
      category: "Hike",
      title: "Mountain top experience",
    },
  ];

  const next = () => {
    if (endIndex < activities.length) {
      setStartIndex((prev) => prev + 1);
      setEndIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
      setEndIndex((prev) => prev - 1);
    }
  };

  const [bookingStart, setBookingStart] = useState(0);
  const [bookingEnd, setBookingEnd] = useState(3); // Show 3 cards at a time

  // Update booking card count based on screen size
  useEffect(() => {
    const updateBookingCardCount = () => {
      if (window.innerWidth < 640) {
        // Small mobile
        setBookingEnd(bookingStart + 1);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setBookingEnd(bookingStart + 2);
      } else {
        // Desktop
        setBookingEnd(bookingStart + 3);
      }
    };

    window.addEventListener("resize", updateBookingCardCount);
    updateBookingCardCount(); // Call once on mount

    return () => window.removeEventListener("resize", updateBookingCardCount);
  }, [bookingStart]);

  const bookingActivities = [
    {
      id: 1,
      img: "https://cdn.prod.rexby.com/image/bf78c0b2-474b-42bb-813c-3d554812e474",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "One of my favourite spots",
    },
    {
      id: 2,
      img: "https://cdn.prod.rexby.com/image/0eb73fc4-23fe-400f-82e9-876972b90d3a",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "Swing with amazing views",
    },
    {
      id: 3,
      img: "https://cdn.prod.rexby.com/image/13e041ce-a581-4fb7-acbc-eafd6360ae90",
      icon: <Mountain size={16} />,
      category: "Hike",
      title: "Beautiful view point",
    },
    {
      id: 4,
      img: "https://cdn.prod.rexby.com/image/fd0d5c6f-6937-44a4-bb52-3fb9bae306ea",
      icon: <Car size={16} />,
      category: "Sightseeing",
      title: "Hidden waterfall",
    },
    {
      id: 5,
      img: "https://cdn.prod.rexby.com/image/74bed1d6-0da0-4fec-a95d-723160bc3e76",
      icon: <Utensils size={16} />,
      category: "Food",
      title: "Local cuisine experience",
    },
    {
      id: 6,
      img: "https://cdn.prod.rexby.com/image/d80440c7-36f3-49f7-b69b-b390f0cf7b8f",
      icon: <Mountain size={16} />,
      category: "Hike",
      title: "Mountain top experience",
    },
  ];

  const nextBooking = () => {
    if (bookingEnd < bookingActivities.length) {
      setBookingStart(bookingStart + 1);
      setBookingEnd(bookingEnd + 1);
    }
  };

  const prevBooking = () => {
    if (bookingStart > 0) {
      setBookingStart(bookingStart - 1);
      setBookingEnd(bookingEnd - 1);
    }
  };

  //
  const [openItems, setOpenItems] = useState({
    access: true,
    internet: false,
    duration: false,
    sharing: false,
  });

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqItems = [
    {
      id: "access",
      question: "How do I access the Guide and Map?",
      answer:
        "You can sign in using your email address, Facebook, or Google account. The guide page, including the map, is accessible through your mobile or computer browser. Additionally, offline access is available via the Rexby app!",
    },
    {
      id: "internet",
      question: "Do I need internet connection?",
      answer:
        "When you download the Rexby app and purchase my guide, you can access it offline. If you're using a web browser, an internet connection is required.",
    },
    {
      id: "duration",
      question: "How long will I have access?",
      answer: "Once you buy access, it is forever.",
    },
    {
      id: "sharing",
      question: "Can I share it with my travel buddy?",
      answer: "Yes, you can invite one travel buddy.",
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="font-sans min-h-screen bg-white">

<div className="fixed top-24 md:left-4 leff-1 z-20">
  <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
    <ArrowLeft className="w-6 h-6 text-gray-800" />
  </button>
</div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-2 sm:px-4 py-1 z-10"
      style={{
        zIndex: 1000,
      }}
        >
        {showHeader ? (
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo in center for mobile, left side for desktop */}
            <div className="flex-1 flex items-center justify-between sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] rounded-full flex items-center justify-center">
                  <div className="text-white font-bold text-lg sm:text-xl">
                    @
                  </div>
                </div>
                <span className="ml-1 sm:ml-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] bg-clip-text text-transparent">
                  Rexby
                </span>
              </div>
            </div>

            {/* Right side with login and language buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto font-semibold text-title border border-[#D6D8E7] h-8 sm:h-9 px-2 sm:px-6 text-xs sm:text-sm">
                Log in
              </button>

              <button className="p-1 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <Globe size={isMobile ? 16 : 20} />
              </button>

              <button
                className="p-1 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 ml-1 sm:ml-2"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={isMobile ? 24 : 32} />
                ) : (
                  <Menu size={isMobile ? 24 : 32} />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex-1 flex items-center justify-between sm:justify-start">
              <span className="ml-1 sm:ml-2 text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] bg-clip-text text-transparent truncate">
                Unclear? Ask me a question
              </span>
            </div>

            {/* Right side with login and language buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto font-semibold text-title border border-[#D6D8E7] h-8 sm:h-9 px-2 sm:px-6 text-xs sm:text-sm whitespace-nowrap">
                Preview
              </button>
              <button className="relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto font-semibold text-white border border-[#D6D8E7] h-8 sm:h-9 px-2 sm:px-6 text-xs sm:text-sm bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] whitespace-nowrap">
                Get access
              </button>
            </div>
          </div>
        )}

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-14 sm:top-16 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-3 sm:p-4 mr-2 sm:mr-4">
            <div className="text-gray-400 uppercase text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              REXBY
            </div>

            <nav className="flex flex-col space-y-3 sm:space-y-4">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base"
              >
                About us
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base"
              >
                Start exploring
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base"
              >
                Become a travel creator
              </a>
            </nav>

            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
              <button className="w-full text-left text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base">
                Log in
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with continuous scroll */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20">
        {/* Home Section */}
        <section ref={homeRef} className="py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Hero Image */}
            <div className="w-full lg:w-1/3 lg:pr-8 mb-4 sm:mb-6 lg:mb-0 px-4 sm:px-8 lg:pl-12 flex justify-center lg:justify-start">
              <div className="relative rounded-lg overflow-hidden group max-w-xs">
                <img
                  src="https://cdn.prod.rexby.com/image/d80440c7-36f3-49f7-b69b-b390f0cf7b8f"
                  alt="Person in hammock with mountains view"
                  className="rounded-[12px] object-cover  sm:h-80 md:h-96 w-full sm:w-[320px] transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-2/3 px-4 sm:px-6">
              <div className="bg-white pr-4 sm:pr-8 lg:pr-24 pb-4 sm:pb-6 pt-2 rounded-lg">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  Norway Guide
                </h1>

                <div className="flex items-center mb-4 sm:mb-6">
                  <img
                    src="https://cdn.prod.rexby.com/image/90ca806e-c988-4993-8bcb-302fff6b27db"
                    alt="Åsa Steinars"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 border-2 border-white shadow-sm"
                  />
                  <div>
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">
                      Guide by Åsa Steinars
                    </span>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span>Norway</span>
                      <span className="mx-1 sm:mx-2">•</span>
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span> New
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-[14px] leading-relaxed">
                  Norway is my second home. I was born in Norway and I lived
                  there until I was 7 years old. I often come back and I love
                  this country almost as much as Iceland. Last summer I spent 3
                  months on the road with my van exploring everything from the
                  south tip up to Lofoten.
                </p>

                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-[14px] leading-relaxed">
                  This guide is my best tips for Norway to make sure you get the
                  most out of your trip. It's focused around the fjords in the
                  west and Lofoten in the north. In my opinion, it's the best
                  areas to explore in Norway.
                </p>
                <div className="border-b border-gray-200 my-4 sm:my-8"></div>

                <div className="flex space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                  <button className="w-1/2 relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto font-semibold text-title border border-title h-10 sm:h-12 text-xs sm:text-sm">
                    Preview
                  </button>
                  <button className="w-1/2 relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto font-semibold text-white bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] h-10 sm:h-12 text-xs sm:text-sm uppercase">
                    GET ACCESS
                  </button>
                </div>

                <div className="text-gray-500 text-center text-xs sm:text-sm flex items-center justify-center">
                  <span className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full">
                    Used for 100+ trips
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-gray-200 my-6 sm:my-8"></div>

        <div className="px-4 sm:px-8 md:px-12 border-gray-200 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="text-gray-700" size={isMobile ? 16 : 20} />
                <span className="text-xs md:text-base text-rexbygray-700">
                  161 things to do
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <MessageSquare
                  className="text-gray-700"
                  size={isMobile ? 16 : 20}
                />
                <span className="text-xs md:text-base text-rexbygray-700">
                  Priority in chat
                </span>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Map className="text-gray-700" size={isMobile ? 16 : 20} />
                <span className="text-xs md:text-base text-rexbygray-700">
                  Interactive Map
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Download className="text-gray-700" size={isMobile ? 16 : 20} />
                <span className="text-xs md:text-base text-rexbygray-700">
                  Offline usage in app
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Route className="text-gray-700" size={isMobile ? 16 : 20} />
                <span className="text-xs md:text-base text-rexbygray-700">
                  1 itinerary
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Route className="text-gray-700" size={isMobile ? 16 : 20} />
                <span className="text-xs md:text-base text-rexbygray-700">
                  Itinerary Builder access
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 my-6 sm:my-8"></div>

        {/* Interactive Map Section */}
        <section
          ref={mapRef}
          className="py-4 sm:py-6 scroll-mt-20 px-4 sm:px-0"
        >
          <h2 className="text-[#14142b] text-lg sm:text-xl font-semibold lg:text-2xl">
            Interactive Map
          </h2>
          <p className="text-xs leading-relaxed lg:text-sm lg:leading-loose text-[#a0a3bd] pt-1 sm:pt-2 pb-3 sm:pb-4">
            Get an Interactive, playful and visually appealing map that helps
            you navigate the noise
          </p>

          <div className="rounded-lg overflow-hidden border border-gray-200 mb-6 sm:mb-8 shadow-md">
            <div className="relative">
              <MapView />
              <button className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                <Expand className="text-gray-700" size={isMobile ? 16 : 20} />
              </button>
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white bg-opacity-90 px-3 sm:px-4 py-2 sm:py-3 rounded-lg max-w-xs shadow-md text-xs sm:text-sm">
                <h3 className="font-medium text-gray-900 mb-1">Map Legend</h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-700 mb-1">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-1 sm:mr-2"></span>
                  <span>Hiking Trails</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-700 mb-1">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                  <span>Camping Spots</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1 sm:mr-2"></span>
                  <span>Must-see Locations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Things To Do Section */}
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
                          className="w-full h-64 sm:h-80 object-cover rounded-[16px] ml-8 sm:ml-0"
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

        {/* Itinerary Section */}
        <section ref={itineraryRef} className="py-12 scroll-mt-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4 px-4 sm:px-6 md:px-8">
            {/* Left Section */}
            <div className="col-span-1">
              <h2 className="text-[#14142b] text-xl sm:text-2xl font-semibold">
                1 itinerary
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed sm:leading-loose text-[#a0a3bd] mt-2">
                Get expertly curated itineraries that help you organise all the
                'things to do' in an ideal time order
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
              <div className="overflow-x-auto">
                <div className="flex gap-4 sm:gap-6 min-w-full px-1 sm:px-4 md:px-6">
                  {/* Itinerary Builder Card */}
                  <div className="min-w-[250px] flex-shrink-0 h-80 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition duration-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6 sm:p-8">
                      <div className="flex justify-center mb-4">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 6L9 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M15 6L15 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9 12L15 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-1 sm:mb-2">
                        Itinerary Builder
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Create your own itinerary
                      </p>
                    </div>
                  </div>

                  {/* Activity Cards */}
                  {[
                    {
                      id: 1,
                      img: "https://cdn.prod.rexby.com/image/a19df367-fd98-4195-851c-8e4f2bfa065f",
                    },
                    {
                      id: 2,
                      img: "preview",
                      icon: "🚗",
                      category: "Sightseeing",
                      title: "One of my favourite spots",
                    },
                  ].map((activity) =>
                    activity.img !== "preview" ? (
                      <div
                        key={activity.id}
                        className="relative min-w-[250px] flex-shrink-0"
                      >
                        <img
                          src={activity.img}
                          alt={activity.title || "Activity image"}
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
                    ) : (
                      <div
                        key={activity.id}
                        className="min-w-[250px] flex-shrink-0 h-80 rounded-[16px] border border-gray-300 hover:border-gray-400 transition duration-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <div className="tracking-wider font-semibold text-title text-sm text-center px-4">
                          Preview for FREE
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* booking section */}
        <section ref={bookingRef} className="py-12 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mb-8 px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="col-span-1">
              <h2 className="text-[#14142b] text-xl font-semibold lg:text-2xl mb-2">
                Booking Page
              </h2>
              <p className="text-xs sm:text-sm lg:text-sm leading-relaxed text-[#a0a3bd] mb-4">
                Get a curated list of reliable options when booking tours,
                hotels, and car rentals
              </p>
              <a
                href="#"
                className="text-blue-600 font-medium hover:underline inline-block transition duration-200"
              >
                Preview for FREE
              </a>
            </div>

            {/* Right Section */}
            <div className="col-span-1 lg:col-span-3 relative w-full">
              {/* Scroll Buttons (Hidden on mobile) */}
              <button
                onClick={prevBooking}
                disabled={bookingStart === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextBooking}
                disabled={bookingEnd >= bookingActivities.length}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowRight size={18} />
              </button>

              {/* Scrollable Cards */}
              <div className="overflow-x-auto -mx-4 sm:-mx-0">
                <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 min-w-full">
                  {bookingActivities
                    .slice(bookingStart, bookingEnd)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="w-[220px] sm:w-[250px] flex-shrink-0"
                      >
                        <div className="relative  ">
                          <img
                            src={activity.img}
                            alt={activity.title}
                            className="w-full h-56 sm:h-80 object-cover rounded-[16px] ml-12 sm:ml-0"
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
                        <div className="p-2 sm:p-4">
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1 gap-1">
                            <span>{activity.icon}</span>
                            {activity.category}
                          </div>
                          <h3 className="font-medium text-base sm:text-lg text-[#14142b]">
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

        <div className="border-b border-gray-200 my-8"></div>
        <div className="flex flex-col">
          {/* Main Content */}
          <main className="flex-grow max-w-screen-xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 mt-8 items-center md:items-start">
              {/* Left Column - Image Card */}
              <div className="w-full md:w-96 self-start p-2 pb-4 rounded-2xl bg-white shadow-[0px_0px_10px_2px_rgba(0,0,0,0.25)]">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://cdn.prod.rexby.com/image/d80440c7-36f3-49f7-b69b-b390f0cf7b8f"
                      alt="Person relaxing in hammock with mountain view"
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500">
                      161 things to do | 1 itinerary | 0 travel tips
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold mt-2">
                      Norway Guide
                    </h2>
                    <div className="text-gray-600 mt-1">Norway</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Guide Info */}
              <div className="w-full md:flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left">
                  Guide by Åsa Steinars
                </h1>
                <p className="text-gray-500 mt-1 text-center md:text-left">
                  Joined in April 2022
                </p>

                {/* Social Media Icons */}
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <a
                    href="#"
                    className="p-2 border border-gray-300 rounded-full"
                  >
                    <Globe size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-2 border border-gray-300 rounded-full"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-2 border border-gray-300 rounded-full"
                  >
                    <Twitter size={20} />
                  </a>
                </div>

                {/* Bio Description */}
                <div className="mt-6">
                  <p className="text-[#4e4b66] leading-relaxed text-sm sm:text-base text-center md:text-left">
                    Åsa Steinars is an adventure photographer and videographer
                    from Iceland. Growing up in the north, surrounded by extreme
                    landscapes and forever changing weather has given her a
                    tight bond to nature and its forces. This you can clearly
                    see in her photography. She works as a full-time content
                    creator, helping people to travel Iceland like she does. She
                    has a total following of almost 2 million across her social
                    media platforms.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  <button className="rounded-lg font-semibold border border-title text-title hover:text-label h-9 px-4 sm:px-6 text-sm transition-all">
                    Message
                  </button>
                  <button className="rounded-lg font-semibold border border-title text-title hover:text-label h-9 px-4 sm:px-6 text-sm transition-all">
                    Storefront
                  </button>
                  <button className="rounded-lg font-semibold border border-title text-title hover:text-label h-9 px-4 sm:px-6 text-sm transition-all">
                    Guide Affiliate Program
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>

      {/* Bottom Navigation */}
      <section ref={chatRef} className="py-6 scroll-mt-20">
        <div className="px-4 sm:px-8 md:px-12 border-t py-6 bg-white flex flex-col md:flex-row items-start gap-6 md:justify-between">
          {/* Left Column - Title */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14142b] text-center md:text-left">
              Your questions, answered
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="w-full md:w-2/3 divide-y divide-gray-200">
            {faqItems.map((item) => (
              <div key={item.id} className="py-5">
                <button
                  className="flex w-full justify-between items-center text-left"
                  onClick={() => toggleItem(item.id)}
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#4e4b66]">
                    {item.question}
                  </h3>
                  {openItems[item.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {openItems[item.id] && (
                  <div className="mt-3 font-poppins text-[#6e7191] text-sm leading-relaxed">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          className="fixed bottom-20 right-6 bg-white rounded-full p-3 shadow-md border border-gray-200 hover:bg-gray-100 transition duration-200 z-10"
          onClick={scrollToTop}
        >
          <ArrowUpward className="text-gray-700" />
        </button>
      )}
    </div>
  );
}

export default App;
