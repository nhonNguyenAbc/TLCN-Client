// src/components/shared/SearchBarComponent.js
import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../../features/slices/searchSlice'; // Import hành động

const SearchBarComponent = () => {
  const dispatch = useDispatch(); // Khởi tạo useDispatch
  const [inputValue, setInputValue] = useState(''); // Trạng thái cho input

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Cập nhật trạng thái inputValue
  };

  const handleSearch = () => {
    dispatch(setSearchTerm(inputValue)); // Gọi hành động để cập nhật searchTerm
  };

  return (
    <div className="relative flex w-full max-w-[24rem]">
      <Input
        type="text"
        label="Search"
        value={inputValue} // Sử dụng giá trị từ state
        onChange={handleInputChange} // Gọi hàm khi người dùng nhập
        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{ className: "hidden" }}
        containerProps={{ className: "min-w-[100px]" }}
      />
      <Button
        size="sm"
        variant="outlined"
        color="white"
        className="!absolute right-1 top-1 rounded"
        onClick={handleSearch} // Gọi hàm khi nhấn nút
      >
          <svg
                  width="13"
                  height="14"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
                    fill="#CFD8DC"
                  />
                  <path
                    d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                    stroke="#CFD8DC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
      </Button>
    </div>
  );
};

export default SearchBarComponent;
