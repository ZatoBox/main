"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";

type Props = {
  formik: any;
  existingCategories: string[];
};

const ProductInfoForm: React.FC<Props> = ({ formik, existingCategories }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 space-y-4 border rounded-lg shadow-sm  bg-white border-[#CBD5E1]">
        <div>
          <label className="block mb-2 text-sm font-medium text-black">
            Product Name *
          </label>
          <Field
            name="name"
            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
          />
          <div className="mt-1 text-xs text-red-500">
            <ErrorMessage name="name" />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-black">
            Description
          </label>
          <Field
            as="textarea"
            name="description"
            rows={3}
            className="w-full p-3 border rounded-lg resize-none border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]">
        <h3 className="mb-4 text-lg font-medium text-black">Categorization</h3>
        <div className="space-y-2">
          {existingCategories.map((category) => {
            const isSelected = formik.values.category === category;
            return (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={isSelected}
                  onChange={() => formik.setFieldValue("category", category)}
                  className="w-4 h-4 rounded-full border border-[#767676] appearance-none checked:bg-[#EEB131] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
                />
                <span
                  className={`text-sm ${
                    isSelected ? "text-black" : "text-gray-500"
                  }`}
                >
                  {category}
                </span>
              </label>
            );
          })}
          <div className="mt-1 text-xs text-red-500">
            <ErrorMessage name="category" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoForm;
