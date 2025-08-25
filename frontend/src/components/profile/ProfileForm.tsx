'use client';

import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Values = {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  twoFactorEnabled: boolean;
};

type Props = {
  initialValues: Partial<Values>;
  onSubmit: (values: Values) => void;
  submitSignal: number;
};

const schema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
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
    language: (initialValues.language as string) || 'en',
    timezone: (initialValues.timezone as string) || 'America/New_York',
    dateFormat: (initialValues.dateFormat as string) || 'MM/DD/YYYY',
    currency: (initialValues.currency as string) || 'USD',
    twoFactorEnabled: !!initialValues.twoFactorEnabled,
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
            <div className='p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Full Name
                  </label>
                  <Field
                    name='full_name'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  />
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='full_name' />
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Email
                  </label>
                  <Field
                    name='email'
                    type='email'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  />
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='email' />
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Phone
                  </label>
                  <Field
                    name='phone'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Address
                  </label>
                  <Field
                    name='address'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  />
                </div>
              </div>
            </div>

            <div className='p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Language
                  </label>
                  <Field
                    as='select'
                    name='language'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='en'>English</option>
                    <option value='es'>Spanish</option>
                    <option value='fr'>French</option>
                    <option value='pt'>Português</option>
                  </Field>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Timezone
                  </label>
                  <Field
                    as='select'
                    name='timezone'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='America/Mexico_City'>
                      Mexico City (GMT-6)
                    </option>
                    <option value='America/New_York'>New York (GMT-5)</option>
                    <option value='America/Los_Angeles'>
                      Los Angeles (GMT-8)
                    </option>
                    <option value='Europe/Madrid'>Madrid (GMT+1)</option>
                  </Field>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Date Format
                  </label>
                  <Field
                    as='select'
                    name='dateFormat'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                    <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
                    <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
                  </Field>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Currency
                  </label>
                  <Field
                    as='select'
                    name='currency'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='USD'>USD - US Dollar</option>
                    <option value='MXN'>MXN - Mexican Peso</option>
                    <option value='EUR'>EUR - Euro</option>
                    <option value='GBP'>GBP - British Pound</option>
                  </Field>
                </div>

                <div>
                  <label className='flex items-center space-x-2'>
                    <Field type='checkbox' name='twoFactorEnabled' />
                    <span className='text-sm text-text-primary'>
                      Two-factor authentication
                    </span>
                  </label>
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
