import { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Rating, Textarea } from "@material-tailwind/react";
import { useCreateReviewMutation } from "../../apis/dishReviewApi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toastify

const DishReviewModal = ({ open, handleClose, dish }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [createReview, { isLoading }] = useCreateReviewMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dish?._id) return toast.error("Lỗi: Không có thông tin món ăn.");

        try {
            await createReview({ menuItem: dish._id, content: comment, rating }).unwrap();
            console.log('ratig', rating)
            toast.success('Đánh giá đã được gửi thành công!');
            setRating(0);
            setComment("");
            handleClose();
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error('Đã có lỗi xảy ra!');
        }
    };

    return (
        <>
            <Dialog open={open} handler={handleClose} >
                <DialogHeader>
                   <span className="font-bold">{dish?.name}</span>
                </DialogHeader>
                <div className="flex justify-center items-center">
                    <img
                        src={dish?.image?.url}
                        alt={dish?.name}
                        className="h-72 w-96 object-cover rounded-lg"
                    />
                </div>
                <DialogBody >
                    <div className="flex flex-col items-center ">
                        <p className="mb-2 font-medium">Chấm điểm:</p>
                        <Rating
                            value={rating}
                            onChange={(newRating) => setRating(newRating)}
                            unratedColor="gray"
                            ratedColor="yellow"
                        />
                    </div>

                    <div className="mt-4">
                        <p className="font-medium">Viết nhận xét (không bắt buộc):</p>
                        <Textarea
                            label="Nhận xét của bạn..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="gradient" color="blue" onClick={handleSubmit} disabled={rating === 0 || isLoading}>
                        {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                </DialogFooter>
            </Dialog>
            <ToastContainer autoClose={3000} /> {/* Hiển thị thông báo */}
        </>
    );
};

export default DishReviewModal;
