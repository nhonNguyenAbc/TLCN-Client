import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
const Pagination = ({ page, active, setActive }) => {
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });
  const next = () => {
    if (active === page) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };
  return (
    <>
      {page > 1 && (
        <div className="flex items-center justify-between border-blue-gray-50 p-4">
          <div></div>
          <div className="flex items-center">
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={prev}
              disabled={active === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: page }, (_, index) => (
                <Button key={index} {...getItemProps(index + 1)}>
                  {index + 1}
                </Button>
              ))}
            </div>

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
