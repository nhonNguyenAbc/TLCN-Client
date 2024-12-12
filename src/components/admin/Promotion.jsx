import AdminLayout from '../../layouts/AdminLayout';
import { useCreatePromotionMutation, useDeletePromotionMutation, useGetAllPromotionQuery, useUpdatePromotionMutation } from '../../apis/promotionApi';
import React, { useEffect, useState } from 'react'
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import Loading from '../shared/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { promotion } from "../../constants/table_head";
import { FormControl, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Button, Input, Typography, IconButton } from '@material-tailwind/react';
import CloseIcon from "@mui/icons-material/Close";

const Promotion = () => {
    const [active, setActive] = useState(1);
    const selectedId = useSelector((state) => state.selectedId.value);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [startDate, setStartDate] = useState("");  // New state for start date
    const [endDate, setEndDate] = useState("");      // New state for end date
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateDiscountValue, setUpdateDiscountValue] = useState(0);
    const [updateStartDate, setUpdateStartDate] = useState("");
    const [updateEndDate, setUpdateEndDate] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateCode, setUpdateCode] = useState("");
    const dispatch = useDispatch();

    const {
        data: promotions,
        isLoading,
        error,
    } = useGetAllPromotionQuery();
    const [createPromotion, { isLoading: isAdded, error: addError }] = useCreatePromotionMutation();
    const [updatePromotion, { isLoading: isUpdated, error: updatedError }] = useUpdatePromotionMutation();
    const [deletePromotion, { isLoading: isDeleted, error: deleteError }] =
        useDeletePromotionMutation();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateSubmit = async () => {
        const result = await updatePromotion({
            id: selectedId,
            updatedPromotionData: {
                name: updateName,
                description: updateDescription,
                code: updateCode,
                endDate: updateEndDate,
                startDate: updateStartDate,
                discountValue: updateDiscountValue
            },
        });
        return result;
    };
    const handleDeleteSubmit = async () => {
        try {
            const result = await deletePromotion(selectedId);
            Toast.fire({
                icon: "success",
                title: "Xóa thành công",
            }).then(() => {

            });
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Xóa thất bại",
            });
        }
    };
    useEffect(() => {
        if (!promotions?.data?.find((promotion) => promotion._id === selectedId)) {
            dispatch(resetSelectedId());
        } else {
            const promotion = promotions?.data?.find((promotion) => promotion._id === selectedId);
            setUpdateCode(promotion?.code);
            setUpdateDescription(promotion?.description);
            setUpdateDiscountValue(promotion?.discountValue);
            setUpdateName(promotion?.name);
            setUpdateStartDate(promotion?.startDate),
                setUpdateEndDate(promotion?.endDate)
        }
    }, [promotions, selectedId, dispatch]);
    const handleAddSubmit = async () => {
        try {
            const result = await createPromotion({
                code,
                name,
                description,
                discountValue,
                startDate,
                endDate,
            });

            if (result?.data?.status === 201) {
                Toast.fire({
                    icon: "success",
                    title: "Thêm chương trình khuyến mãi thành công",
                }).then(() => {
                    handleClose();
                    setCode("");
                    setName("");
                    setDescription("");
                    setDiscountValue(0);
                    setStartDate("");
                    setEndDate("");
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: result?.error?.data?.message || "Thêm chương trình khuyến mãi thất bại",
                });
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Đã xảy ra lỗi, vui lòng thử lại",
            });
        }
    };


    if (isLoading) return <Loading />;
    if (error) return <div>Error</div>;
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const list_promotion = promotions?.data.map((promotion) => ({
        id: promotion._id,
        name: promotion.name,
        discountValue: `${promotion.discountValue}%`,
        startDate: promotion.startDate ? formatDate(promotion.startDate) : null,
        endDate: promotion.endDate ? formatDate(promotion.endDate) : null,
        status: promotion.status
    }));

    return (
        <>
            <AdminLayout
                name="Chương trình khuyến mãi"
                TABLE_ROWS={list_promotion}
                TABLE_HEAD={promotion}
                pagination={promotions?.info}
                page={active}
                setPage={setActive}
                updateContent="Chỉnh sửa"
                deleteContent="Xóa khuyến mãi"
                size="md"
                headerDetail="Chi tiết Khuyến mãi"
                bodyDetail={
                    <Container>
                    <div className="grid grid-cols-3 gap-4">
                    <Typography variant="h6">Khuyến mãi: </Typography>
                      <Typography className="col-span-2">
                        {promotions?.data.find((promotion) => promotion._id === selectedId)?.name}
                      </Typography>
                      <Typography variant="h6">Mô tả: </Typography>
                      <Typography className="col-span-2">
                      {promotions?.data.find((promotion) => promotion._id === selectedId)?.description}
                      </Typography>
                      <Typography variant="h6">Giảm giá: </Typography>
                      <Typography className="col-span-2">
                        {promotions?.data.find((promotion) => promotion._id === selectedId)?.discountValue}%
                      </Typography>
                      <Typography variant="h6">Ngày bắt đầu: </Typography>
                      <Typography className="col-span-2">
                      {formatDate(promotions?.data.find((promotion) => promotion._id === selectedId)?.startDate)}
                      </Typography>
                      <Typography variant="h6">Ngày kết thúc: </Typography>
                      <Typography className="col-span-2">
                        {formatDate(promotions?.data.find((promotion) => promotion._id === selectedId)?.endDate)}
                      </Typography>
          
                    </div>
                  </Container>
                }
                headerUpdate="Chỉnh sửa khuyến mãi"
                sizeUpdate="md"
                bodyUpdate={
                    <Container>
                        <div className="grid grid-cols-5 gap-4 mt-2">
                            <FormControl fullWidth className="col-span-2">
                                <Typography variant="h6" className="my-auto">Mã khuyến mãi:</Typography>
                                <TextField
                                    label="Mã"
                                    value={updateCode}
                                    onChange={(e) => setUpdateCode(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth className="col-span-2">
                                <Typography variant="h6" className="my-auto">
                                    Tên chương trình:
                                </Typography>
                                <TextField
                                    label="Tên"
                                    placeholder="Tên chương trình"
                                    value={updateName}
                                    onChange={(e) => setUpdateName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth className="col-span-2">
                                <Typography variant="h6" className="my-auto">Mô tả:</Typography>
                                <TextField
                                    label="Mô tả"
                                    value={updateDescription}
                                    onChange={(e) => setUpdateDescription(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth className="col-span-2 mt-5">
                                <Typography variant="h6" className="my-auto">
                                    Giảm giá (%):
                                </Typography>
                                <TextField
                                    size="sm"
                                    placeholder="Giảm giá (%)"
                                    value={updateDiscountValue}
                                    onChange={(e) =>
                                        setUpdateDiscountValue(
                                            isNaN(e.target.value)
                                                ? 0
                                                : e.target.value < 0
                                                    ? 0
                                                    : e.target.value
                                        )
                                    }
                                />
                            </FormControl>

                            {/* Start Date */}
                            <FormControl fullWidth className="col-span-2 mt-5">
                                <Typography variant="h6" className="my-auto">
                                    Ngày bắt đầu:
                                </Typography>
                                <TextField
                                    type="date"
                                    value={updateStartDate}
                                    onChange={(e) => setUpdateStartDate(e.target.value)}
                                />
                            </FormControl>

                            {/* End Date */}
                            <FormControl fullWidth className="col-span-2 mt-5">
                                <Typography variant="h6" className="my-auto">
                                    Ngày kết thúc:
                                </Typography>
                                <TextField
                                    type="date"
                                    value={updateEndDate}
                                    onChange={(e) => setUpdateEndDate(e.target.value)}
                                />
                            </FormControl>
                        </div>
                    </Container>
                }
                updateSubmit={updateSubmit}
                isUpdated={isUpdated}
                handleDeleteSubmit={handleDeleteSubmit}

            >
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outlined"
                        className="w-full"
                        size="regular"
                        onClick={handleOpen}
                    >
                        Thêm mới
                    </Button>
                    <Input
                        size="sm"
                        label="Tìm kiếm"
                        iconFamily="material-icons"
                        iconName="search"
                        placeholder="Tìm kiếm sản phẩm"
                    />
                </div>
                <Dialog maxWidth="md" open={open} onClose={handleClose} fullWidth>
                    <DialogTitle className="pb-0 flex justify-between">
                        <Typography variant="h4">Thêm chương trình khuyến mãi</Typography>
                        <IconButton
                            className="border-none"
                            variant="outlined"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Container>
                            <div className="grid grid-cols-5 gap-4 mt-2">
                                <FormControl fullWidth className="col-span-2">
                                    <Typography variant="h6" className="my-auto">Mã khuyến mãi:</Typography>
                                    <TextField
                                        label="Mã"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth className="col-span-2">
                                    <Typography variant="h6" className="my-auto">
                                        Tên chương trình:
                                    </Typography>
                                    <TextField
                                        label="Tên"
                                        placeholder="Tên chương trình"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth className="col-span-2">
                                    <Typography variant="h6" className="my-auto">Mô tả:</Typography>
                                    <TextField
                                        label="Mô tả"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth className="col-span-2 mt-5">
                                    <Typography variant="h6" className="my-auto">
                                        Giảm giá (%):
                                    </Typography>
                                    <TextField
                                        size="sm"
                                        placeholder="Giảm giá (%)"
                                        value={discountValue}
                                        onChange={(e) =>
                                            setDiscountValue(
                                                isNaN(e.target.value)
                                                    ? 0
                                                    : e.target.value < 0
                                                        ? 0
                                                        : e.target.value
                                            )
                                        }
                                    />
                                </FormControl>

                                {/* Start Date */}
                                <FormControl fullWidth className="col-span-2 mt-5">
                                    <Typography variant="h6" className="my-auto">
                                        Ngày bắt đầu:
                                    </Typography>
                                    <TextField
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </FormControl>

                                {/* End Date */}
                                <FormControl fullWidth className="col-span-2 mt-5">
                                    <Typography variant="h6" className="my-auto">
                                        Ngày kết thúc:
                                    </Typography>
                                    <TextField
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}

                                    />
                                </FormControl>
                            </div>
                        </Container>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="gradient" color="green" onClick={handleAddSubmit}>
                            <span>Thêm Mới</span>
                        </Button>
                    </DialogActions>
                </Dialog>
            </AdminLayout>
        </>
    )
}

export default Promotion;
