import React from "react";
import { FaRegFolder } from "react-icons/fa6";

type Props = {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  error?: string | null;
};

const Header: React.FC<Props> = ({ onBack, onSave, saving, error }) => {
  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-[#CBD5E1] bg-[#FFFFFF]">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 transition-colors rounded-full hover:bg-gray-50 md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zatobox-900"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-zatobox-900 md:hidden">
          New Product
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-[158px] h-[40px] flex items-center justify-center bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] gap-2">
          <span className="text-[#000000] font-medium">Status:</span>
          <span className="text-[#F88612] font-medium">Active</span>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          onClick={() => console.log("Delete pressed")}
          className="bg-[#A94D14] hover:bg-[#8A3D16] text-[#FFFFFF] font-semibold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>Delete</span>
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className={`bg-[#F88612] hover:bg-[#D9740F] text-[#FFFFFF] font-semibold 
              rounded-lg transition-colors flex items-center justify-center space-x-1
              w-[82px] h-[40px] ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
        >
          {saving ? (
            <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
          ) : (
            <>
              <FaRegFolder className="w-4 h-4 self-center" />
              <span >Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
