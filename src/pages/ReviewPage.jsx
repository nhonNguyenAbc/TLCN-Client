import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useGetVideosQuery } from "../apis/videoApi";
import { Volume2, VolumeX, MessageSquare } from "lucide-react";
import throttle from "lodash.throttle";
import { NavbarWithSublist } from "../components/shared/NavbarWithSublist";
import { Banner } from "../components/shared/Banner";
import "./VideoFeed.css";

const VideoFeed = () => {
    const { data: videos = [], isLoading, isError } = useGetVideosQuery();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [newComment, setNewComment] = useState(""); // state for new comment
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

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

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleCommentSubmit = (e, videoId) => {
        e.preventDefault();
        if (newComment.trim()) {
            // Logic to add comment to the video (e.g., API call)
            // For now, just logging the comment
            console.log(`Comment on video ${videoId}: ${newComment}`);
            setNewComment(""); // Clear the input after submitting
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (isError) return <div className="h-screen flex items-center justify-center">Error loading videos.</div>;
    if (!videos.length) return null;

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
                        >
                            <div
                                className={`h-full pt-2 ${showComments ? "w-[60vw]" : "w-full"} transition-all duration-300 border-r-4 border-gray-300 ${showComments ? "border-solid" : ""}`}
                            >
                                <div className="h-full w-full rounded-lg overflow-hidden relative shadow-lg">
                                    {!showComments && (
                                        <div className="absolute bottom-14 left-0 z-10 bg-opacity-50 p-2 rounded-lg text-white w-full">
                                            <h2
                                                className={`text-base font-normal ${expanded ? "line-clamp-none" : "line-clamp-2"}`}
                                            >
                                                {expanded || video.title.length <= 84
                                                    ? video.title
                                                    : `${video.title.substring(0, 84)}...`}
                                            </h2>
                                            {video.title.length > 84 && (
                                                <button
                                                    className="text-sm text-blue-400 mt-2"
                                                    onClick={toggleExpand}
                                                >
                                                    {expanded ? "Thu gọn" : "Xem thêm"}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <ReactPlayer
                                        ref={(el) => (videoRefs.current[index] = el)}
                                        url={video.videoUrl}
                                        playing={index === currentIndex}
                                        controls={true}
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

                                    <button
                                        onClick={toggleComments}
                                        className="absolute bottom-28 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Phần bình luận */}
                            {showComments && (
                                <div className="h-full w-[40vw] bg-white p-4 overflow-y-auto shadow-lg relative flex flex-col justify-between">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold mb-4">{video.title}</h2>
                                        <p className="border-b-2 border-gray-300">Comments</p>

                                        {video.comments && video.comments.length > 0 ? (
                                            <div className="mb-24">
                                                {video.comments.map((comment, index) => (
                                                    <div key={index} className="mb-4">
                                                        <p className="font-semibold">{comment.user?.name || 'Unknown User'}</p>
                                                        <p className="text-gray-600">{comment.content}</p>
                                                        <p className="text-sm text-gray-400">Likes: {comment.likes}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No comments yet.</p>
                                        )}
                                    </div>

                                    {/* Cố định form bình luận */}
                                    <div className="sticky bottom-0 left-0 w-full bg-white p-4 shadow-lg">
                                        <form
                                            onSubmit={(e) => handleCommentSubmit(e, video._id)}
                                            className="flex items-center space-x-2"
                                        >
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="flex-1 border rounded-lg p-2 resize-none"
                                                rows={3} // Set initial height
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white p-2 rounded-lg"
                                            >
                                                Post
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
