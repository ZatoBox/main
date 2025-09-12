import React from "react";
import { FaRegFolder } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  error?: string | null;
};

const Header: React.FC<Props> = ({ onBack, onSave, saving, error }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-4 sm:px-6 py-4 sm:py-0 border-b border-[#CBD5E1] bg-white gap-4 sm:gap-0">
  <div className="flex items-center w-full sm:w-auto gap-2">
  <button
    onClick={onBack}
    className="p-2 transition-colors rounded-full hover:bg-gray-50 flex-shrink-0"
  >
    <IoMdArrowRoundBack className="w-6 h-6 text-[#F88612]" />
  </button>

  <h1 className="text-xl font-semibold text-[#F88612] ml-2 sm:ml-4 md:ml-0">
    New Product
  </h1>
</div>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <div className="w-full sm:w-[158px] h-[40px] flex items-center justify-center bg-white rounded-lg border border-[#CBD5E1] gap-2">
          <span className="text-black font-medium">Status:</span>
          <span className="text-[#F88612] font-medium">Active</span>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          onClick={() => console.log("Delete pressed")}
          className="bg-[#A94D14] hover:bg-[#8A3D16] text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          Delete
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className={`bg-[#F88612] hover:bg-[#D9740F] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 w-full sm:w-[82px] h-[40px] ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? (
            <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
          ) : (
            <>
              <FaRegFolder className="w-4 h-4 self-center" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
