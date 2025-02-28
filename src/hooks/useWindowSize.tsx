import { useEffect, useState } from "react";

type windowsizeType = {
  width: number;
  height: number;
};

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<windowsizeType>({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default useWindowSize;
