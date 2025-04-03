import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useGetVideosQuery } from "../apis/videoApi";
import { Volume2, VolumeX, MessageSquare, Heart } from "lucide-react";
import throttle from "lodash.throttle";
import "./VideoFeed.css";
import { remove as removeDiacritics } from "diacritics";
import { useNavigate } from "react-router-dom";
import { useCreateCommentMutation, useGetCommentsForVideoQuery } from "../apis/commentApi";
import { UserIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

const VideoFeed = () => {
    const [searchTerm, setSearchTerm] = useState(""); // State để lưu thông tin tìm kiếm
    const [restaurantName, setRestaurantName] = useState(""); // Lưu thông tin tên nhà hàng để tìm kiếm
    const [suggestions, setSuggestions] = useState([
        "Khao Lao",
        "Sườn Mười",
        "Cơm niêu Sài Gòn",
        "Nhà hàng Pendolasco",
        // Các gợi ý khác
      ]);
    const { data: videos = [], isLoading, isError } = useGetVideosQuery({ restaurantName }); // Gọi dữ liệu dựa vào `searchTerm`
    const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [progress, setProgress] = useState(0);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showSeekbar, setShowSeekbar] = useState(false);

    const navigate = useNavigate();
    const { data: commentsData, isFetching } = useGetCommentsForVideoQuery(videos[currentIndex]?._id, {
        skip: !videos[currentIndex]?._id,
    });

    const handleScroll = throttle(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const viewportHeight = container.clientHeight;

        const newIndex = Math.floor((scrollPosition + viewportHeight / 2) / viewportHeight);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    }, 200);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    useEffect(() => {
        videoRefs.current.forEach((player, index) => {
            if (player) {
                if (index === currentIndex) {
                    player.seekTo(0);
                    player.getInternalPlayer().play();
                } else {
                    player.getInternalPlayer().pause();
                    player.seekTo(0);
                }
            }
        });
    }, [currentIndex]);

    useEffect(() => {
        // Cập nhật giá trị progress khi video thay đổi
        if (videoRefs.current[currentIndex]) {
            const interval = setInterval(() => {
                setProgress(videoRefs.current[currentIndex]?.getCurrentTime() || 0);
            }, 500); // Cập nhật mỗi nửa giây

            return () => clearInterval(interval);
        }
    }, [currentIndex]);
    useEffect(() => {
        if (videoRefs.current[currentIndex]) {
            const interval = setInterval(() => {
                // Chỉ cập nhật progress khi video đang phát
                if (videoRefs.current[currentIndex].getInternalPlayer().getPaused() === false) {
                    setProgress(videoRefs.current[currentIndex]?.getCurrentTime() || 0);
                }
            }, 100); // Cập nhật mỗi nửa giây

            return () => clearInterval(interval);
        }
    }, [currentIndex]);

    const handleSeekbarChange = (e, index) => {
        const newTime = e.target.value;
        videoRefs.current[index]?.seekTo(parseFloat(newTime));
        setProgress(newTime);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleCommentSubmit = async (e, videoId) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                await createComment({ videoId, content: newComment }).unwrap();
                setNewComment(""); // Clear the input after submitting
            } catch (error) {
                console.error("Failed to post comment:", error);
            }
        }
    };

    const formatRestaurantName = (name) => {
        if (!name) return "";
        const noDiacritics = removeDiacritics(name);
        return `#${noDiacritics.toLowerCase().replace(/\s+/g, "").replace(/-/g, "#")}`;
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);  // Chuyển trạng thái bật/tắt âm thanh
    };
    const handleSearch = () => {
        // Gán search term khi nhấn nút Search
        setRestaurantName(searchTerm);
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (isError) return <div className="h-screen flex items-center justify-center">Error loading videos.</div>;
    if (!videos.length) {
        return (
            <div>

                <div className="h-screen flex items-center justify-center">
                    <p className="text-xl text-gray-500">Không có video nào hiện tại.</p>
                </div>
            </div>
        );
    }
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        handleSearch();
      };
    return (
        <>
            <div className=" inset-0 bg-transparent flex justify-center">
                {!showComments && (
                  <div className="col-span-1 p-4 bg-gray-100 rounded-lg shadow-md">
                  {/* Ô tìm kiếm */}
                  <div className="flex w-full bg-white rounded-lg shadow-md overflow-hidden mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
                      placeholder="Nhập tên nhà hàng..."
                      className="flex-1 border-none px-4 py-2 focus:outline-none"
                    />
                    <button
                      onClick={handleSearch} // Gọi hàm tìm kiếm khi nhấn nút
                      className="bg-blue-500 text-white px-5 py-2 hover:bg-blue-600 transition-all"
                    >
                      🔍 Tìm
                    </button>
                  </div>
                
                  {/* Danh sách gợi ý nhà hàng */}
                  <Typography variant="h5" className="mb-2">Mọi người quan tâm</Typography>
                  <ul className="list-disc pl-5">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="mb-2">
                        <button
                          onClick={() => handleSuggestionClick(suggestion)} // Cập nhật tìm kiếm khi chọn gợi ý
                          className="flex items-center w-full p-2 rounded-lg bg-white hover:bg-gray-200 transition-all"
                        >
                          <span className="text-base font-thin text-black">{suggestion}</span> {/* Làm chữ đậm */}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                )}



                <div
                    ref={containerRef}
                    className={`${showComments ? "h-[70vh]" : "h-[70vh]"
                        } ${showComments ? "w-[90vw]" : "w-[60vw]"} ${showComments ? "mt-8" : "mt-2"
                        } overflow-y-scroll snap-y snap-mandatory scrollbar-hide rounded-lg shadow-lg mx-auto`}
                    style={{ scrollBehavior: "smooth" }}
                >
                    {videos.map((video, index) => (
                        <div
                            key={video._id}
                            className="h-[70vh] snap-start relative flex transition-all duration-300"
                            onMouseEnter={() => setShowSeekbar(true)} // Show seekbar on hover
                            onMouseLeave={() => setShowSeekbar(false)} // Hide seekbar when mouse leaves
                        >
                            <div
                                className={`h-full pt-2 ${showComments ? "w-[60vw]" : "w-full"} transition-all duration-300 border-r-4 border-gray-300 ${showComments ? "border-solid" : ""}`}
                            >
                                <div className="relative h-full w-full bg-black rounded-lg overflow-hidden shadow-lg">
                                    {!showComments && (
                                        <div
                                            className={`absolute bottom-4 left-4 text-white p-2 rounded-lg text-sm max-w-[90%] transition-all duration-300 z-50`}
                                        >
                                            <p className={`description ${showFullDescription ? 'line-clamp-none' : ''}`}>
                                                {video.description ? video.description : "No description available"}
                                            </p>
                                            {video.description?.length > 200 && (
                                                <span
                                                    className="text-blue-500 cursor-pointer"
                                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                                >
                                                    {showFullDescription ? " Ẩn bớt" : " Xem thêm"}
                                                </span>
                                            )}
                                            <p className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/restaurant/" + video.restaurant)}>
                                                {formatRestaurantName(video.restaurantName)}
                                            </p>
                                        </div>
                                    )}

                                    <ReactPlayer
                                        ref={(el) => (videoRefs.current[index] = el)}
                                        url={video.videoUrl}
                                        playing={index === currentIndex}
                                        controls={false} // Disable default controls
                                        width="100%"
                                        height="100%"
                                        muted={isMuted}
                                        style={{ cursor: "pointer" }}  // Thêm dòng này để thay đổi con trỏ thành pointer

                                        loop={true}
                                        playsinline={true}
                                        config={{
                                            file: {
                                                attributes: {
                                                    preload: "auto",
                                                },
                                            },
                                        }}
                                    />

                                    {showSeekbar && (
                                        <div className="absolute bottom-0 w-full bg-opacity-50 bg-black">
                                            <input
                                                type="range"
                                                min="0"
                                                max={videoRefs.current[index]?.getDuration() || 100}
                                                value={progress}
                                                onChange={(e) => handleSeekbarChange(e, index)}
                                                className="w-full h-2"
                                            />
                                        </div>
                                    )}
                                    <button
                                        //onClick={toggleComments}
                                        className="absolute bottom-40 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <Heart className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        onClick={toggleComments}
                                        className="absolute bottom-28 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="absolute bottom-16 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-6 h-6 text-white" />  // Icon khi tắt âm
                                        ) : (
                                            <Volume2 className="w-6 h-6 text-white" />  // Icon khi bật âm
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Phần bình luận */}
                            {showComments && (
                                <div className="h-full w-[40vw] bg-white p-4 overflow-y-auto shadow-lg relative flex flex-col justify-between">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold mb-4">{video.description}</h2>
                                        <p className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/restaurant/" + video.restaurant)}>
                                            {formatRestaurantName(video.restaurantName)}
                                        </p>
                                        <p className="border-b-2 border-gray-300">Bình luận</p>

                                        {isFetching ? (
                                            <p>Hiển thị bình luận...</p>
                                        ) : commentsData?.comments?.length > 0 ? (
                                            <div className="mb-24">
                                                {commentsData.comments.map((comment) => (
                                                    <div className="mb-3 mt-2" key={comment._id}>
                                                        <div className="flex items-center">
                                                            <UserIcon className="h-8 w-8 mb-1 text-gray-500 mr-2 border-2 border-gray-300 rounded-full p-1" /> {/* Thêm viền */}
                                                            <p className="font-semibold">{comment?.user?.username}</p>
                                                        </div>
                                                        <p className="ml-4">{comment.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Chưa có bình luận nào.</p>
                                        )}
                                    </div>

                                    {/* Form to submit comment, positioned at the bottom */}
                                    <div className="sticky bottom-0 left-0 w-full bg-white p-4 shadow-lg z-10">
                                        <form
                                            onSubmit={(e) => handleCommentSubmit(e, video._id)}
                                            className="flex items-center space-x-2"
                                        >
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Viết bình luận của bạn..."
                                                className="flex-1 border rounded-lg p-2 resize-none"
                                                rows={3}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white p-2 rounded-lg"
                                                disabled={isCreatingComment}
                                            >
                                                {isCreatingComment ? "Đang đăng tải..." : "Đăng"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


export default VideoFeed;