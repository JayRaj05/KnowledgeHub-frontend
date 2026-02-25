import React from 'react';
import ReactQuill from 'react-quill';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="quill-wrapper">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

