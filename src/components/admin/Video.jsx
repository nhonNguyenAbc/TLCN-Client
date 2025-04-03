import React, { useState, useEffect } from 'react';
import { useGetVideosByUserIdQuery, useAddVideoMutation, useUpdateVideoMutation, useDeleteVideoMutation } from '../../apis/videoApi';
import { Button } from '@material-tailwind/react';
import Pagination from '../shared/Pagination';
import { useGetAllRestaurantByUserIdQuery } from '../../apis/restaurantApi'; // Assuming you have a restaurantApi defined
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //
import Loading from '../shared/Loading';

const Video = ({ userId }) => {
    const [active, setActive] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [videoData, setVideoData] = useState({
        title: '', description: '', videoFile: null, videoId: '', restaurantId: ''
    });

    // Fetch videos by userId
    const { data, error, isLoading, refetch: refetchVideos } = useGetVideosByUserIdQuery({ userId, page: active });

    // Fetch all restaurants by userId
    const { data: dataRestaurant, isLoading: loadingRestaurants } = useGetAllRestaurantByUserIdQuery(userId);
    const restaurants = dataRestaurant?.data
    // Mutations for adding and updating videos
    const [addVideo,  {isLoading: isAdded, error: addedError }] = useAddVideoMutation();
    const [updateVideo,  {isLoading: isUpdated, error: updatedError }] = useUpdateVideoMutation();
    const [deleteVideo] = useDeleteVideoMutation();


    // Open modal for adding or editing video
    const handleOpenModal = (video = null) => {
        setIsEditMode(video !== null);
        if (video) {
            setVideoData({
                title: video.title,
                description: video.description,
                videoFile: null,
                videoId: video._id,
                restaurantId: video.restaurantId || '',
            });
        } else {
            setVideoData({ title: '', description: '', videoFile: null, videoId: '', restaurantId: '' });
        }
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVideoData((prev) => ({
            ...prev,
            videoFile: file
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", videoData.title);
        formData.append("description", videoData.description);
        formData.append("restaurant", videoData.restaurantId); // Keep the current restaurantId

        try {
            if (isEditMode) {
                const updatedData = new FormData();
                updatedData.append("title", videoData.title);
                updatedData.append("description", videoData.description);
                updatedData.append("restaurant", videoData.restaurantId); // Don't change restaurantId

                if (videoData.videoFile) {
                    updatedData.append("videoUrl", videoData.videoFile);
                }

                const response = await updateVideo({
                    videoId: videoData.videoId,
                    updatedData: updatedData
                });

                if (response?.data) {
                    setShowModal(false);
                    setVideoData({ title: '', description: '', videoFile: null, videoId: '', restaurantId: '' });
                    refetchVideos();
                    toast.success('Video đã được cập nhật thành công!');
                }
            } else {
                if (videoData.videoFile) {
                    formData.append("videoUrl", videoData.videoFile);
                }

                const response = await addVideo(formData);
                if (response?.data) {
                    setShowModal(false);
                    setVideoData({ title: '', description: '', videoFile: null, videoId: '', restaurantId: '' });
                    refetchVideos();
                    toast.success('Video đã được thêm thành công!');
                }
            }
        } catch (err) {
            console.error("Error adding/updating video:", err);
            toast.error('Đã có lỗi xảy ra!'); // Thông báo lỗi
        }
    };


    const handleShowDeleteDialog = (video) => {
        setVideoToDelete(video);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (videoToDelete) {
                const response = await deleteVideo(videoToDelete._id);
                if (response?.data) {
                    refetchVideos();
                }
                toast.success('Video đã được xóa thành công!');

            }
        } catch (err) {
            console.error("Error deleting video:", err);
        } finally {
            setShowDeleteDialog(false);
            setVideoToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setVideoToDelete(null);
    };

    if (isLoading || loadingRestaurants) return <p>Đang tải video và nhà hàng...</p>;
    if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

    return (
        <div className="m-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold mb-4">Danh sách Video</h1>
                <Button
                    variant="outlined"
                    className="w-auto"
                    size="regular"
                    onClick={() => handleOpenModal()}
                >
                    Thêm Video
                </Button>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa video</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa video "{videoToDelete?.title}"?
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                onClick={handleDeleteCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video List */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.videos?.map((video) => (
                    <div key={video._id} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-semibold text-lg text-center mb-2">{video.title}</h3>
                        <p className="text-gray-700 text-center mb-4 line-clamp-2">{video.description}</p>
                        <video
                            src={video.videoUrl}
                            controls
                            className="mt-auto"
                            style={{ width: '100%', height: '180px' }}
                        />
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleOpenModal(video)}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="red"
                                onClick={() => handleShowDeleteDialog(video)}
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                page={data?.totalPages || 1}
                active={active}
                setActive={setActive}
            />

            {/* Modal for add/edit video */}
            {showModal && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                   {(isUpdated || isAdded) ? (<Loading/>):( <div className="bg-white p-6 w-96 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">{isEditMode ? 'Sửa Video' : 'Thêm Video Mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Tiêu Đề</label>
                                <input
                                    type="text"
                                    value={videoData.title}
                                    onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Mô tả</label>
                                <textarea
                                    value={videoData.description}
                                    onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Chọn Nhà Hàng</label>
                                <select
                                    value={videoData.restaurantId}
                                    onChange={(e) => setVideoData({ ...videoData, restaurantId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    disabled={isEditMode} // Disable only when editing
                                    required
                                >
                                    {/* Hiển thị 'Chọn Nhà Hàng' nếu không có giá trị */}
                                    {!isEditMode && <option value="">Chọn Nhà Hàng</option>}

                                    {restaurants?.map((restaurant) => (
                                        <option key={restaurant._id} value={restaurant._id}>
                                            {/* Nếu đang ở chế độ chỉnh sửa, hiển thị tên nhà hàng */}
                                            {isEditMode && videoData.restaurantId === restaurant._id ? restaurant.name : restaurant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button variant="outlined" onClick={handleCloseModal}>Hủy</Button>
                                <Button variant="filled" type="submit">{isEditMode ? 'Cập nhật' : 'Thêm Video'}</Button>
                            </div>
                        </form>
                    </div>)}
                </div>
            )}
            <ToastContainer className="w-auto" /> 
        </div>
    );
};

export default Video;
