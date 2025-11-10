import { USER_TAB } from "@/constants/userMenu";

const SideBar = ({ tabIndex, handleClickTab }) => {
  return (
    <aside className="w-[240px] h-full bg-[#0A400C] sticky top-0 rounded-xl">
      <div className="flex flex-col p-2.5 space-y-2">
        {USER_TAB.map((tab, idx) => (
          <div
            key={tab.value}
            onClick={() => handleClickTab(idx)}
            className={`
              flex items-center justify-center 
              w-full h-[50px] text-white rounded-lg
              ${tabIndex === idx ? "font-bold bg-white/30" : "font-normal"}
              hover:cursor-pointer hover:bg-white/20
              transition-colors duration-200
            `}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
