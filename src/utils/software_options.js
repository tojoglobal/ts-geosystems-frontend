export function parseSoftwareOptions(softwareOptions) {
  try {
    if (typeof softwareOptions === "string") {
      const parsed = JSON.parse(softwareOptions);
      // If the parsed data is an array, map through and parse nested JSON strings
      if (Array.isArray(parsed)) {
        return parsed.map((option) => {
          return {
            ...option,
            software: option.software ? JSON.parse(option.software) : null,
          };
        });
      }
      return parsed?.value ? parsed : { value: 0 };
    }
  } catch (error) {
    console.error("Error parsing software options:", error);
    return { value: 0 };
  }
}
