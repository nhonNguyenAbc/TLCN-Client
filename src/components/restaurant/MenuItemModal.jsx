import { useGetReviewsByDishQuery } from '../../apis/dishReviewApi.js';
import { Button, Dialog, DialogBody, DialogFooter } from '@material-tailwind/react'
import React from 'react'
import StarRatings from 'react-star-ratings'

const MenuItemModal = ({ isDialogOpen, handleCloseDialog, item }) => {
    const { data, error, isLoading } = useGetReviewsByDishQuery(item?._id, {
        skip: !isDialogOpen || !item?._id,
    });

    { isLoading && <p>Đang tải đánh giá...</p> }
    { error && <p className="text-red-500">Lỗi: {error.message}</p> }

    return (
        <Dialog open={isDialogOpen} handler={handleCloseDialog} className="max-h-[90vh]">
            <DialogBody className="max-h-[90vh] overflow-y-auto">
                <img
                    src={item?.image?.url}
                    alt="Larger View"
                    className="w-full max-h-80 object-cover"  // Đảm bảo ảnh vừa với khung dialog, có thể cắt nếu cần
                />
                <div className="text-center text-xl font-bold text-black m-2">
                    {item?.name}
                </div>

                <div className="flex justify-center mb-2">
                    {/* Hiển thị sao bằng react-star-ratings */}
                    <StarRatings
                        rating={data?.info} // Giá trị rating
                        starRatedColor="#FFCC00" // Màu sao
                        starEmptyColor="#ddd" // Màu sao trống
                        starDimension="24px" // Kích thước sao
                        starSpacing="4px" // Khoảng cách giữa các sao
                        numberOfStars={5} // Tổng số sao
                        name="rating"
                    />
                </div>
                <div>
                    {data?.data?.length > 0 ? (
                        data.data.map((review) => (
                            <div key={review._id} className="border-b py-2 flex items-center gap-3">
                                {/* Avatar mặc định nếu không có ảnh */}
                                <img
                                    src="https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">{review.user.name || 'Người dùng'}</p>
                                    <p><strong>{review.content}</strong></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-center'>Chưa có đánh giá nào.</p>
                    )}
                </div>

            </DialogBody>
            <DialogFooter>
                {/* <Button
                    variant="outlined"
                    color="red"
                    onClick={handleCloseDialog}
                    className="mt-4"
                >
                    Đóng
                </Button> */}
            </DialogFooter>
        </Dialog>
    )
}

export default MenuItemModal