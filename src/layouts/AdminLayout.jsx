import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import useOpen from "../hooks/useOpen";
import Table from "../components/shared/Table";
import { Toast } from "../configs/SweetAlert2";
import Tablist from "../components/shared/Tablist";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { CloudCog } from "lucide-react";
const AdminLayout = ({
  children,
  name,
  tablist,
  TABLE_HEAD,
  TABLE_ROWS,
  noDelete,
  noUpdate,
  noDetail,
  updateContent,
  deleteContent,
  headerDetail,
  bodyDetail,
  headerUpdate,
  bodyUpdate,
  size,
  sizeUpdate,
  overflow,
  updateOverflow,
  updateSubmit,
  rejectSubmit,
  handleDeleteSubmit,
  isUpdated,
  isOrder,
  pagination,
  page,
  setPage,
  setStatus
}) => {
  const {
    detailOpen,
    updateOpen,
    deleteOpen,
    data,
    handleDetailOpen,
    handleUpdateOpen,
    handleDeleteOpen,
    handleDetailClose,
    handleUpdateClose,
    handleDeleteClose,
    handleData,
  } = useOpen();
  useEffect(() => {
    if (deleteOpen) {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#f50057",
        cancelButtonColor: "#2962ff",
      }).then((result) => {
        if (result.isConfirmed) {
          handleDeleteSubmit();
        }
        handleDeleteClose();
      });
    }
  }, [deleteOpen, handleDeleteOpen, handleDeleteClose, handleDeleteSubmit]);

  const handleUpdateSubmit = async () => {
    try {
      const message = await updateSubmit();
      if (message?.status === 200 || message?.data?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Cập nhật thành công",
        }).then(() => {
          handleUpdateClose();
        });
      }
    } catch (err) {
      console.log('error', err)
      Toast.fire({
        icon: "error",
        title: "Cập nhật thất bại",
      });
    }
  };
  const handleRejectOrder  = async () => {
    try {
      const message = await rejectSubmit();
      if (message?.status === 200 || message?.data?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Cập nhật thành công",
        }).then(() => {
          handleUpdateClose();
        });
      }
    } catch (err) {
      console.log('error', err)
      Toast.fire({
        icon: "error",
        title: "Cập nhật thất bại",
      });
    }
  };
  return (
    <>
      <Container className="mt-5">
        <div className="flex items-center justify-between mb-5">
          <Typography variant="h4" color="blue-gray" className="font-bold">
            {name}
          </Typography>
          {children}
        </div>

        {tablist && <Tablist TABS={tablist} setStatus={setStatus} />}

        {noDetail ? (
          <Table
            TABLE_HEAD={TABLE_HEAD}
            TABLE_ROWS={TABLE_ROWS}
            active={page}
            setActive={setPage}
            handleUpdateOpen={handleUpdateOpen}
            handleDeleteOpen={handleDeleteOpen}
            updateContent={updateContent}
            deleteContent={deleteContent}
            noDelete={noDelete}
            noUpdate={noUpdate}
            data={data}
            handleData={handleData}
            maxPage={pagination.number_of_pages}
          />
        ) : (
          <Table
            TABLE_HEAD={TABLE_HEAD}
            TABLE_ROWS={TABLE_ROWS}
            active={page}
            setActive={setPage}
            handleUpdateOpen={handleUpdateOpen}
            handleDeleteOpen={handleDeleteOpen}
            handleDetailOpen={handleDetailOpen}
            updateContent={updateContent}
            deleteContent={deleteContent}
            noDelete={noDelete}
            noUpdate={noUpdate}
            data={data}
            handleData={handleData}
            maxPage={pagination.number_of_pages}
          />
        )}
      </Container>
      <Dialog
        fullWidth
        open={detailOpen}
        onClose={handleDetailClose}
        maxWidth={size}
        className={overflow ? "h-[80vh] overflow-auto" : ""}
      >
        <DialogTitle className="pb-0 flex justify-between">
          <Typography variant="h4">{headerDetail}</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleDetailClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{bodyDetail}</DialogContent>
        <div className="flex items-center justify-end">
          {!noUpdate && (
            <DialogActions>
              <Button
                variant="gradient"
                color="green"
                onClick={() => {
                  handleDetailClose(), handleUpdateOpen();
                }}
              >
                <span>Cập nhật</span>
              </Button>
              
            </DialogActions>
          )}
          
          {!noDelete && (
            <DialogActions>
              <Button
                variant="gradient"
                color="red"
                onClick={() => {
                  handleDetailClose(), handleDeleteOpen();
                }}
              >
                <span>Xóa</span>
              </Button>
            </DialogActions>
          )}
          
        </div>
      </Dialog>
      <Dialog
        open={updateOpen}
        fullWidth
        onClose={handleUpdateClose}
        maxWidth={sizeUpdate}
        className={updateOverflow ? "h-[80vh] overflow-auto" : ""}
      >
        <DialogTitle className="pb-0 flex justify-between">
          <Typography variant="h4">{headerUpdate}</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleUpdateClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{bodyUpdate}</DialogContent>
        <DialogActions>
          <Button
            variant="gradient"
            color="green"
            onClick={handleUpdateSubmit}
            loading={isUpdated}
          >
            {!isUpdated && <span>Xác nhận</span>}
          </Button>
          {/* //Buton */}
         {isOrder && (<Button
            variant="gradient"
            color="red"
            onClick={handleRejectOrder}
            loading={isUpdated}
          >
            <span>Từ chối</span>
          </Button>)}
        </DialogActions>
      </Dialog>
    </>
  );
};
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  tablist: PropTypes.array,
  TABLE_HEAD: PropTypes.array.isRequired,
  TABLE_ROWS: PropTypes.array.isRequired,
  noDelete: PropTypes.bool,
  noUpdate: PropTypes.bool,
  updateContent: PropTypes.node.isRequired,
  deleteContent: PropTypes.node.isRequired,
  headerDetail: PropTypes.node.isRequired,
  bodyDetail: PropTypes.node.isRequired,
  headerUpdate: PropTypes.node.isRequired,
  bodyUpdate: PropTypes.node.isRequired,
  size: PropTypes.string.isRequired,
  sizeUpdate: PropTypes.string.isRequired,
  overflow: PropTypes.bool,
  updateOverflow: PropTypes.bool,
  noDetail: PropTypes.bool,
  isOrder: PropTypes.bool, // thêm prop isOrder

};
export default AdminLayout;
