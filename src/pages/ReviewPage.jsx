import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useGetVideosQuery } from "../apis/videoApi";
import { Volume2, VolumeX, MessageSquare } from "lucide-react";
import throttle from "lodash.throttle";
import { NavbarWithSublist } from "../components/shared/NavbarWithSublist";
import { Banner } from "../components/shared/Banner";
import "./VideoFeed.css";
import { remove as removeDiacritics } from "diacritics";
import { useNavigate } from "react-router-dom";
import { useCreateCommentMutation, useGetCommentsForVideoQuery } from "../apis/commentApi";

const VideoFeed = () => {
    const { data: videos = [], isLoading, isError } = useGetVideosQuery();
    const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [progress, setProgress] = useState(0); // Trạng thái để theo dõi tiến trình
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showSeekbar, setShowSeekbar] = useState(false); // New state for showing seekbar

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


    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (isError) return <div className="h-screen flex items-center justify-center">Error loading videos.</div>;
    if (!videos.length) {
        return (
            <div>
                <div>
                    <Banner />
                    <NavbarWithSublist />
                </div>
                <div className="h-screen flex items-center justify-center">
                    <p className="text-xl text-gray-500">Không có video nào hiện tại.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="fixed inset-0 bg-transparent p-4">
                <div>
                    <Banner />
                    <NavbarWithSublist />
                </div>
                <div
                    ref={containerRef}
                    className={`h-[80vh] ${showComments ? "w-[100vw]" : "w-[60vw]"} overflow-y-scroll snap-y snap-mandatory scrollbar-hide rounded-lg shadow-lg mx-auto`}
                    style={{ scrollBehavior: "smooth" }}
                >
                    {videos.map((video, index) => (
                        <div
                            key={video._id}
                            className="h-[80vh] snap-start relative flex transition-all duration-300"
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

                                    {/* Custom Seekbar */}
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
                                        <p className="border-b-2 border-gray-300">Comments</p>

                                        {isFetching ? (
                                            <p>Loading comments...</p>
                                        ) : commentsData?.comments?.length > 0 ? (
                                            <div className="mb-24">
                                                {commentsData.comments.map((comment) => (
                                                    <div key={comment._id}>
                                                        <p className="font-semibold">{comment.user?.name || "Unknown User"}</p>
                                                        <p>{comment.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No comments yet.</p>
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
                                                placeholder="Write a comment..."
                                                className="flex-1 border rounded-lg p-2 resize-none"
                                                rows={3}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white p-2 rounded-lg"
                                                disabled={isCreatingComment}
                                            >
                                                {isCreatingComment ? "Posting..." : "Post"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default VideoFeed;