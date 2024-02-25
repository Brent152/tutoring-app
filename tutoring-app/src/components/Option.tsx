import React, { FC, useState } from 'react';

interface OptionProps {
  option: string;
}

const Option: FC<OptionProps> = ({ option }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className={`w-5 h-5 rounded-full border-2 ${isChecked ? 'border-blue-500' : 'border-gray-300'}`}>
        {isChecked && <span className="block w-3 h-3 bg-blue-500 rounded-full m-auto mt-0.5"></span>}
      </div>
      <input type="checkbox" id={option} checked={isChecked} onChange={toggleCheck} className="hidden" />
      <span className="text-sm text-gray-500">{option}</span>
    </label>
  );
}

export default Option;