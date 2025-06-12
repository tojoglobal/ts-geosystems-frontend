import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Helpers for month navigation
  const prevPeriod = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else if (view === "week") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 7
        )
      );
    } else {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1
        )
      );
    }
  };

  const nextPeriod = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else if (view === "week") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 7
        )
      );
    } else {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        )
      );
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  // Helpers for rendering
  const renderWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekDays.map((day) => (
      <div
        key={day}
        className="text-center font-medium text-white py-2 border-b border-white/10"
      >
        {day}
      </div>
    ));
  };

  // Month view
  const renderMonth = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    const today = new Date();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 p-2 border border-white/10 bg-transparent"
        ></div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      days.push(
        <div
          key={`day-${i}`}
          className={`h-32 p-2 border border-white/10 ${
            isToday
              ? "bg-gray-300 text-black font-bold shadow"
              : "bg-transparent text-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{i}</span>
            {isToday && (
              <span className="text-xs font-bold text-blue-700">Today</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7">{renderWeekDays()}</div>
        <div className="grid grid-cols-7 auto-rows-fr">{days}</div>
      </>
    );
  };

  // Week view
  const renderWeek = () => {
    const today = new Date();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();
      days.push(
        <div
          key={i}
          className={`h-64 p-2 border border-white/10 ${
            isToday
              ? "bg-gray-300 text-black font-bold shadow"
              : "bg-transparent text-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{weekDays[i]}</span>
            <span>{date.getDate()}</span>
            {isToday && (
              <span className="text-xs font-bold text-blue-700">Today</span>
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="grid grid-cols-7">{renderWeekDays()}</div>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  // Day view
  const renderDay = () => {
    const date = currentDate;
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    return (
      <div className="flex flex-col items-center justify-center pt-12 px-2">
        <div
          className={`rounded-2xl border-4 ${
            isToday
              ? "border-blue-400 bg-white text-black font-bold shadow-xl"
              : "border-white/10 bg-transparent text-white"
          } p-8 text-center max-w-sm w-full`}
        >
          <div className="text-4xl mb-2">{date.getDate()}</div>
          <div className="text-lg">{weekDay}</div>
          <div className="mt-2 text-base font-medium">
            {date.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          {isToday && <div className="text-teal-700 font-bold mt-2">Today</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-transparent text-white p-2">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
      </div>
      {/* Calendar Controls */}
      <div className="flex justify-between items-center mb-4 bg-transparent">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevPeriod}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-300/10 border border-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 cursor-pointer py-2 rounded-lg bg-white text-black font-bold hover:bg-blue-100 border border-white/10"
          >
            Today
          </button>
          <button
            onClick={nextPeriod}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-300/10 border border-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {view === "day"
              ? currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })
              : currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
          </h2>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-transparent hover:bg-gray-300/10 border border-white/10 rounded-lg">
            <CalendarIcon className="h-5 w-5" />
            <span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
            <ChevronDown className="h-4 w-4" />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-black border border-white/10 rounded-lg shadow-lg z-10">
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setView("day")}
                      className={`${
                        active ? "bg-gray-300/10" : ""
                      } block cursor-pointer w-full text-left px-4 py-2 text-sm rounded-md`}
                    >
                      Day
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setView("week")}
                      className={`${
                        active ? "bg-gray-300/10" : ""
                      } block cursor-pointer w-full text-left px-4 py-2 text-sm rounded-md`}
                    >
                      Week
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setView("month")}
                      className={`${
                        active ? "bg-gray-300/10" : ""
                      } block cursor-pointer w-full text-left px-4 py-2 text-sm rounded-md`}
                    >
                      Month
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="flex-1 bg-transparent rounded-xl border-none overflow-hidden">
        {view === "month" && renderMonth()}
        {view === "week" && renderWeek()}
        {view === "day" && renderDay()}
      </div>
    </div>
  );
};

export default Calendar;
