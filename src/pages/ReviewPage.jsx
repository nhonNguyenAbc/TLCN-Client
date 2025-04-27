import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { useGetVideosQuery } from "../apis/videoApi";
import { Volume2, VolumeX, MessageSquare, Heart } from "lucide-react";
import throttle from "lodash.throttle";
import "./VideoFeed.css";
import { remove as removeDiacritics } from "diacritics";
import { useNavigate } from "react-router-dom";
import { useCreateCommentMutation, useGetCommentsForVideoQuery } from "../apis/commentApi";
import { useDispatch, useSelector } from "react-redux";
import { useLikeVideoMutation } from "../apis/videoApi"; // Giả định rằng likeVideo đã được thêm vào videoApi
import { UserIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import Loading from "../components/shared/Loading";

const VideoFeed = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [suggestions, setSuggestions] = useState([
        "Khao Lao",
        "Sườn Mười",
        "Cơm niêu Sài Gòn",
        "Nhà hàng Pendolasco",
        // Các gợi ý khác
    ]);
    const { data: videosData = [], isLoading: isLoadingVideos, isError } = useGetVideosQuery({ restaurantName });
    const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
    const [likeVideo, { isLoading: isLiking }] = useLikeVideoMutation();

    // Để lưu trạng thái like của các video
    const [likedVideos, setLikedVideos] = useState({});

    // Tạo mảng video vô hạn bằng cách nhân bản các video hiện có
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        if (videosData.length > 0) {
            // Tạo mảng video vô hạn bằng cách nhân bản mảng video gốc nhiều lần
            const repeatedVideos = Array(10).fill().flatMap(() => [...videosData]);
            setVideos(repeatedVideos);

            // Khởi tạo trạng thái like từ dữ liệu video
            const initialLikedState = {};
            videosData.forEach(video => {
                initialLikedState[video._id] = video.isLiked || false;
            });
            setLikedVideos(initialLikedState);
        }
    }, [videosData]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [progress, setProgress] = useState(0);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showSeekbar, setShowSeekbar] = useState(false);
    const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
    const hideIconTimerRef = useRef(null);

    const navigate = useNavigate();

    // Đảm bảo sử dụng videoId từ video hiện tại để lấy comments
    const currentVideoId = videos[currentIndex]?._id;
    const originalVideoIndex = videosData.findIndex(v => v._id === currentVideoId);
    const originalVideoId = originalVideoIndex >= 0 ? videosData[originalVideoIndex]._id : null;

    const { data: commentsData, isFetching } = useGetCommentsForVideoQuery(originalVideoId, {
        skip: !originalVideoId,
    });

    const handleScroll = useCallback(throttle(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const viewportHeight = container.clientHeight;

        const newIndex = Math.floor((scrollPosition + viewportHeight / 2) / viewportHeight);
        if (newIndex !== currentIndex && newIndex < videos.length) {
            setCurrentIndex(newIndex);
            setIsPaused(false); // Auto play khi cuộn đến video mới
        }

        // Kiểm tra nếu đã cuộn gần đến cuối để tải thêm video
        if (scrollPosition + viewportHeight > container.scrollHeight - viewportHeight * 2) {
            // Load more videos by duplicating existing ones
            setVideos(prevVideos => {
                if (videosData.length > 0) {
                    return [...prevVideos, ...videosData];
                }
                return prevVideos;
            });
        }
    }, 200), [currentIndex, videos.length, videosData]);

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
                    if (!isPaused) {
                        player.getInternalPlayer().play();
                    } else {
                        player.getInternalPlayer().pause();
                    }
                } else {
                    player.getInternalPlayer().pause();
                    player.seekTo(0);
                }
            }
        });
    }, [currentIndex, isPaused]);

    useEffect(() => {
        if (videoRefs.current[currentIndex]) {
            const interval = setInterval(() => {
                // Chỉ cập nhật progress khi video đang phát và không bị tạm dừng
                if (videoRefs.current[currentIndex] &&
                    videoRefs.current[currentIndex].getInternalPlayer() &&
                    !isPaused) {
                    setProgress(videoRefs.current[currentIndex]?.getCurrentTime() || 0);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [currentIndex, isPaused]);

    // Hiệu ứng khi thay đổi trạng thái phát/dừng để hiển thị biểu tượng tạm thời
    useEffect(() => {
        // Xóa bộ đếm thời gian cũ nếu có
        if (hideIconTimerRef.current) {
            clearTimeout(hideIconTimerRef.current);
        }

        // Hiển thị biểu tượng
        setShowPlayPauseIcon(true);

        // Thiết lập bộ đếm thời gian mới để ẩn biểu tượng sau 2 giây
        hideIconTimerRef.current = setTimeout(() => {
            setShowPlayPauseIcon(false);
        }, 2000);

        // Xóa bộ đếm thời gian khi component unmount
        return () => {
            if (hideIconTimerRef.current) {
                clearTimeout(hideIconTimerRef.current);
            }
        };
    }, [isPaused, currentIndex]);

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
        setIsMuted(!isMuted);
    };

    const togglePlayPause = () => {
        setIsPaused(!isPaused);
        const player = videoRefs.current[currentIndex];
        if (player) {
            if (!isPaused) {
                player.getInternalPlayer().pause();
            } else {
                player.getInternalPlayer().play();
            }
        }
    };

    const handleSearch = () => {
        setRestaurantName(searchTerm);
    };

    const handleVideoClick = () => {
        togglePlayPause();
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        handleSearch();
    };

    // Xử lý like video
    const handleLikeVideo = async (videoId) => {
        try {
            // Thực hiện like API call
            await likeVideo(videoId).unwrap();

            // Cập nhật trạng thái like cho video này
            setLikedVideos(prev => ({
                ...prev,
                [videoId]: !prev[videoId]
            }));

        } catch (error) {
            console.error("Không thể like video:", error);
        }
    };

    // Kiểm tra xem video hiện tại đã được like chưa
    const isCurrentVideoLiked = (videoId) => {
        return likedVideos[videoId] || false;
    };

    if (isLoadingVideos) return <Loading />;
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

    return (
        <>
            <div className="inset-0 bg-transparent flex justify-center">
                {!showComments && (
                    <div className="col-span-1 p-4 bg-gray-100 rounded-lg shadow-md">
                        {/* Ô tìm kiếm */}
                        <div className="flex w-full bg-white rounded-lg shadow-md overflow-hidden mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nhập tên nhà hàng..."
                                className="flex-1 border-none px-4 py-2 focus:outline-none"
                            />
                            <button
                                onClick={handleSearch}
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
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="flex items-center w-full p-2 rounded-lg bg-white hover:bg-gray-200 transition-all"
                                    >
                                        <span className="text-base font-thin text-black">{suggestion}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className={`${showComments ? "h-[70vh]" : "h-[70vh]"} 
                        ${showComments ? "w-[90vw]" : "w-[60vw]"} 
                        ${showComments ? "mt-8" : "mt-2"}
                        overflow-y-scroll snap-y snap-mandatory scrollbar-hide rounded-lg shadow-lg mx-auto`}
                    style={{ scrollBehavior: "smooth" }}
                >
                    {videos.map((video, index) => {
                        // Lấy ID gốc của video để kiểm tra trạng thái like
                        const originalVideoId = video._id;
                        const isLiked = isCurrentVideoLiked(originalVideoId);

                        return (
                            <div
                                key={`${video._id}-${index}`}
                                className="h-[70vh] snap-start relative flex transition-all duration-300"
                                onMouseEnter={() => setShowSeekbar(true)}
                                onMouseLeave={() => setShowSeekbar(false)}
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

                                        <div onClick={handleVideoClick} className="w-full h-full cursor-pointer">
                                            <ReactPlayer
                                                ref={(el) => (videoRefs.current[index] = el)}
                                                url={video.videoUrl}
                                                playing={index === currentIndex && !isPaused}
                                                controls={false}
                                                width="100%"
                                                height="100%"
                                                muted={isMuted}
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
                                        </div>

                                        {/* Play/Pause Button Overlay - Chỉ hiện trong 2 giây sau khi trạng thái thay đổi */}
                                        {index === currentIndex && showPlayPauseIcon && (
                                            <div
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
                                            bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all"
                                            >
                                                {isPaused ? (
                                                    <span className="block w-8 h-8 text-white justify-center text-center">▶</span>
                                                ) : (
                                                    <span className="block w-8 h-8 text-white text-center">⏸</span>
                                                )}
                                            </div>
                                        )}

                                        {showSeekbar && (
                                            <div className="absolute bottom-0 w-full bg-opacity-50 bg-black">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={videoRefs.current[index]?.getDuration() || 100}
                                                    value={index === currentIndex ? progress : 0}
                                                    onChange={(e) => handleSeekbarChange(e, index)}
                                                    className="w-full h-2"
                                                />
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleLikeVideo(originalVideoId)}
                                            className="absolute bottom-40 right-4 z-10 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                            disabled={isLiking}
                                        >
                                            <Heart
                                                className={`w-6 h-6 ${isLiked ? 'fill-current text-red-500' : 'fill-transparent text-white'}`}
                                            />
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
                                                <VolumeX className="w-6 h-6 text-white" />
                                            ) : (
                                                <Volume2 className="w-6 h-6 text-white" />
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
                                                                <UserIcon className="h-8 w-8 mb-1 text-gray-500 mr-2 border-2 border-gray-300 rounded-full p-1" />
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
                                                onSubmit={(e) => handleCommentSubmit(e, originalVideoId)}
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
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default VideoFeed;