import React from "react";

interface Props {
  existingCategories: string[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

const Categorization: React.FC<Props> = ({
  existingCategories,
  selectedCategories,
  onToggle,
}) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
      <h3 className="mb-4 text-lg font-medium text-[#000000]">
        Categorization
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-3 text-sm font-medium text-[#000000]">
            Existing categories
          </label>
          <div className="space-y-2">
            {existingCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={isSelected}
                    onChange={() => onToggle(category)}
                    className="
                  w-4 h-4 rounded border border-[#767676] bg-white
                  appearance-none
                  checked:bg-[#EEB131]
                  focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]
                "
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className={`text-sm ${
                      isSelected ? "text-[#000000]" : "text-[#888888]"
                    }`}
                  >
                    {category}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorization;
