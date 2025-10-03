'use client';

import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Values = {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
};

type Props = {
  initialValues: Partial<Values>;
  onSubmit: (values: Values) => void;
  submitSignal: number;
};

const schema = Yup.object().shape({
  full_name: Yup.string(),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string(),
  address: Yup.string(),
});

const ProfileForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  submitSignal,
}) => {
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (submitSignal && submitRef.current) submitRef.current();
  }, [submitSignal]);

  const defaults: Values = {
    full_name: initialValues.full_name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    address: initialValues.address || '',
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(values)}
    >
      {(formik) => {
        submitRef.current = formik.submitForm;
        return (
          <Form>
            <div className='p-6 mb-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-[#000000]'>
                    Nombre Completo
                  </label>
                  <Field
                    name='full_name'
                    className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
                  />
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='full_name' />
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-[#000000]'>
                    Email
                  </label>
                  <Field
                    name='email'
                    type='email'
                    className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
                  />
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='email' />
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-[#000000]'>
                    Teléfono
                  </label>
                  <Field
                    name='phone'
                    className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-[#000000]'>
                    Dirección
                  </label>
                  <Field
                    name='address'
                    className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
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

export default ProfileForm;
