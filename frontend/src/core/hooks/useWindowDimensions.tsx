/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect } from "react";

export interface Dimensions {
  width: number;
  height: number;
}

const getWindowDimensions = (): Dimensions => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<Dimensions>(
    getWindowDimensions
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};
