import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

interface Prop {
  show: boolean;
  item: string[];
}

export const Sidebar = ({ show, item }: Prop) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    if (show) {

      gsap.fromTo(
        sidebar,
        {
          y: -100,
          height: 0,
          opacity: 0,
          display: "none",
          visibility: "hidden",
        },
        {
          y: 0,
          height: 300,
          opacity: 1,
          display: "flex",
          visibility: "visible",
          duration: 0.3,
          ease: "power2.out",
          z : 10
        }
      );
    } else {
 
      gsap.to(sidebar, {
        y: -100,
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (sidebar) {
            gsap.set(sidebar, {
              display: "none",
              visibility: "hidden",
              z : 10
            });
          }
        },
      });
    }
  }, [show]);

  return (
    <div
      ref={sidebarRef}
      id="sideBar"
      className="w-38 z-100 flex lg:hidden h-70 bg-gray-500 border-1 border-pink-400 shadow-xs shadow-purple-300 absolute top-0 mt-25 right-0 rounded-3xl focus:outline-0"
      style={{
        display: "none",
        visibility: "hidden",
        opacity: 0,
      }}
    >
      <ul className="grid justify-center m-6 mx-4 grid-cols-1 text-purple-300 w-full">
        {item.map((it, i) => (
          <li
            key={i}
            className="hover:text-pink-400 hover:px-5 hover:mx-2 hover:bg-gray-600 hover:rounded-3xl transition-all duration-300 ease-in-out cursor-pointer my-4 p-1"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
};
