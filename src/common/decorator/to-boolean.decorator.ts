import { Transform } from "class-transformer";

export const TransformToBoolean = () => {
  return Transform(({ value }) => {
    console.log("value", value);

    if (typeof value === "string") {
      console.log("value", value);
      if (value === "true") {
        return true;
      } else {
        return false;
      }
    }
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    return false;
  });
};
