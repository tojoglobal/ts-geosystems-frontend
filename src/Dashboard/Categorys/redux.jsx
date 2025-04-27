import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../features/Counters/CounterSlice";

const Categor = () => {
  const count = useSelector((state) => state.counter);
  console.log("count", count);

  const dispatch = useDispatch();

  const handleIncrement = (id) => {
    console.log("increment", id);
    dispatch(increment(id));
  };
  return (
    <div className=" min-h-screen bg-[#f1f4ff] dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100">
      add-categorys
      {count.value}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleIncrement(count.value)}
      >
        handleIncrement
      </button>
    </div>
  );
};

export default Categor;
