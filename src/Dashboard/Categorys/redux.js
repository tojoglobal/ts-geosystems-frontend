import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import { incrementCounter } from "./actions/counterAction";

const Categor = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const handleIncrement = () => {
    console.log("increment");

    dispatch(incrementCounter());
  };
  return (
    <div className=" min-h-screen bg-[#f1f4ff] dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100">
      add-categorys
      {count}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleIncrement}
      >
        handleIncrement
      </button>
    </div>
  );
};

export default Categor;
