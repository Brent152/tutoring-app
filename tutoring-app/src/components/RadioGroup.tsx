import React, { FC, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface RadioGroupProps {
  options: string[];
}

const RadioGroup: FC<RadioGroupProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const groupId = uuidv4();

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={option} className="flex items-center space-x-2">
          <input 
            type="radio" 
            id={`${groupId}-${index}-${option}`}
            checked={option === selectedOption} 
            onChange={() => handleOptionChange(option)} 
            className="form-radio h-5 w-5 text-blue-600" 
          />
          <label htmlFor={`${groupId}-${index}-${option}`} className="text-sm text-gray-500 cursor-pointer">{option}</label>
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;