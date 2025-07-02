export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  // console.log(value);

  const parts = value.split(`; ${name}=`);
  // console.log(parts);

  if (parts.length === 2) return parts.pop().split(";").shift();
};
