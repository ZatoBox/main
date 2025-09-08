"use client";

import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

type Values = {
  productType: string;
  name: string;
  description: string;
  location: string;
  unit: string;
  weight: string;
  price: string;
  inventoryQuantity: string;
  lowStockAlert: string;
  sku: string;
  category: string;
};

type Option = { label: string; value: string };

type Props = {
  initialValues?: Partial<Values>;
  existingCategories: string[];
  unitOptions: Option[];
  productTypeOptions: Option[];
  onSubmit: (values: Values) => void;
  submitSignal: number;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  unit: Yup.string().required("Unit is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  inventoryQuantity: Yup.number()
    .typeError("Inventory must be a number")
    .integer("Inventory must be an integer")
    .min(0, "Inventory must be 0 or more")
    .required("Inventory is required"),
  category: Yup.string().required("Category is required"),
});

const NewProductForm: React.FC<Props> = ({
  initialValues,
  existingCategories,
  unitOptions,
  productTypeOptions,
  onSubmit,
  submitSignal,
}) => {
  const formikSubmitRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (submitSignal && formikSubmitRef.current) formikSubmitRef.current();
  }, [submitSignal]);

  const defaults: Values = {
    productType:
      (initialValues && initialValues.productType) || "Physical Product",
    name: (initialValues && initialValues.name) || "",
    description: (initialValues && initialValues.description) || "",
    location: (initialValues && initialValues.location) || "",
    unit: (initialValues && initialValues.unit) || "Per item",
    weight: (initialValues && initialValues.weight) || "",
    price: (initialValues && initialValues.price) || "",
    inventoryQuantity: (initialValues && initialValues.inventoryQuantity) || "",
    lowStockAlert: (initialValues && initialValues.lowStockAlert) || "",
    sku: (initialValues && initialValues.sku) || "",
    category: (initialValues && initialValues.category) || "",
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={validationSchema}
      onSubmit={(values: Values, helpers: FormikHelpers<Values>) => {
        onSubmit(values);
        helpers.setSubmitting(false);
      }}
    >
      {(formik) => {
        formikSubmitRef.current = formik.submitForm;
        return (
          <Form>
            <div className="p-6 space-y-4 border rounded-lg shadow-xl bg-zatobox-10 border-[#CBD5E1] ">
              <div>
                <label className="block mb-2 text-sm font-medium text-#000000">
                  Product Name *
                </label>
                <Field
                  name="name"
                  className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-#000000 focus:border-transparent bg-#FFFFFF text-#000000"
                />
                <div className="mt-1 text-xs text-red-500">
                  <ErrorMessage name="name" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-#000000">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none border-[#CBD5E1] focus:ring-2 focus:ring-#000000 focus:border-transparent bg-#FFFFFF text-#000000"
                />
              </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-#FFFFFF border-[#CBD5E1]">
              <label className="block mb-2 text-sm font-medium text-#000000">
                Locations
              </label>
              <Field
                name="location"
                className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-#000000 focus:border-transparent bg-#FFFFFF text-#000000"
              />
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]">
              <h3 className="mb-4 text-lg font-medium text-black">
                Categorization
              </h3>
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
                        onChange={() =>
                          formik.setFieldValue("category", category)
                        }
                        className={`w-4 h-4 rounded-full border border-[#CBD5E1] 
                        bg-white checked:bg-[#EEB131] checked:border-[#EEB131] 
                        focus:outline-none focus:ring-2 focus:ring-[#767676] appearance-none`}
                      />
                      <span
                        className={`text-sm ${
                          isSelected ? "text-[#000000]" : "text-[#888888]"
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

            <div className="p-6 border rounded-lg shadow-sm bg-#FFFFFF border-[#CBD5E1]">
              <h3 className="mb-4 text-lg font-medium text-#000000">Units</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-#000000">
                    Unit *
                  </label>
                  <Field
                    as="select"
                    name="unit"
                    className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-#FFFFFF text-#000000"
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                  <div className="mt-1 text-xs text-red-500">
                    <ErrorMessage name="unit" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Product Type
                  </label>
                  <Field
                    as="select"
                    name="productType"
                    className="w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  >
                    {productTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Weight (kg)
                  </label>
                  <Field
                    name="weight"
                    type="number"
                    step="0.01"
                    className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-#FFFFFF text-#000000"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Price (required)
                  </label>
                  <div className="relative">
                    <span className="absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary">
                      $
                    </span>
                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      className="w-full py-3 pl-8 pr-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    />
                  </div>
                  <div className="mt-1 text-xs text-red-500">
                    <ErrorMessage name="price" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-#FFFFFF border-[#CBD5E1]">
              <h3 className="mb-4 text-lg font-medium text-#000000">
                Inventory
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Inventory quantity *
                  </label>
                  <Field
                    name="inventoryQuantity"
                    type="number"
                    className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-#FFFFFF text-#000000"
                  />
                  <div className="mt-1 text-xs text-red-500">
                    <ErrorMessage name="inventoryQuantity" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Low stock alert
                  </label>
                  <Field
                    name="lowStockAlert"
                    type="number"
                    className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-#FFFFFF text-#000000"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    SKU
                  </label>
                  <Field
                    name="sku"
                    className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-#FFFFFF text-#000000"
                  />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewProductForm;
