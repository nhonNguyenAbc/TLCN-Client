import { ArrowLeftIcon, ArrowRightIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const MAX_VISIBLE = 5; // Số lượng nút trang hiển thị tối đa

const Pagination = ({ page, active, setActive }) => {
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
    className: "transition-all duration-200",
  });

  const next = () => {
    if (active < page) setActive(active + 1);
  };

  const prev = () => {
    if (active > 1) setActive(active - 1);
  };

  const renderPageNumbers = () => {
    let pages = [];

    // Hiển thị toàn bộ nếu số trang ít hơn MAX_VISIBLE
    if (page <= MAX_VISIBLE) {
      for (let i = 1; i <= page; i++) {
        pages.push(i);
      }
    } else {
      pages = [1];

      if (active > 3) {
        pages.push("...");
      }

      const start = Math.max(2, active - 1);
      const end = Math.min(page - 1, active + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (active < page - 2) {
        pages.push("...");
      }

      pages.push(page);
    }

    return pages.map((item, index) =>
      item === "..." ? (
         <EllipsisHorizontalIcon key={`dots-${index}`} className="h-5 w-5 text-gray-500" />

      ) : (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <Button {...getItemProps(item)}>{item}</Button>
        </motion.div>
      )
    );
  };

  return (
    <>
      {page > 1 && (
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={prev}
              disabled={active === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </Button>

            <AnimatePresence mode="wait">
              <div className="flex items-center gap-2">
                {renderPageNumbers()}
              </div>
            </AnimatePresence>

            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={next}
              disabled={active === page}
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
};

export default Pagination;
