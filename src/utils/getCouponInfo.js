// utils/getCouponInfo.js
export const getCouponInfo = async (code_name) => {
  // console.log(code_name);

  try {
    const res = await fetch(
      `${import.meta.env.VITE_OPEN_APIURL}/api/promocode`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_name }),
      }
    );

    if (!res.ok) {
      console.warn("Coupon not valid or not found.");
      return null;
    }

    const data = await res.json();
    return data; // { code_name, type, discount }
  } catch (err) {
    console.error("Failed to fetch coupon:", err);
    return null;
  }
};
