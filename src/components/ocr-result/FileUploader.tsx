import React from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
  fileName?: string | null;
  onChange: (f: File | null) => void;
};

const FileUploader: React.FC<Props> = ({ fileName, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-medium text-black">
        {t('ocr.fileUploader.selectDocument')}
      </label>
      <div className="p-6 text-center transition-colors duration-300 border-2 border-dashed rounded-lg border-[#888888] md:p-8 hover:border-[#888888]">
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
          onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div>
            <Upload
              size={48}
              className="mb-4 animate-bounce text-[#F88612] mx-auto"
            />
            <p className="text-base font-medium md:text-lg text-[#888888]">
              {fileName
                ? `${t('ocr.fileUploader.selected')}: ${fileName}`
                : t('ocr.fileUploader.selectFile')}
            </p>
            <p className="mt-2 text-xs md:text-sm text-[#888888]">
              {t('ocr.fileUploader.formats')}
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
