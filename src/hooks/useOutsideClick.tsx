import { useEffect } from "react";
import { useOutsideClickProps } from "../utils/types/types";

const useOutsideClick = (dropdowns: useOutsideClickProps[]) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      dropdowns.forEach(({ id, state, setState }) => {
        if (state && !target.closest(`#${id}`)) {
          setState(false);
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdowns]);
};

export default useOutsideClick;
