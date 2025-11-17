import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '../../context/ThemeContext';
import './DatePicker.css';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'Select date',
  required = false,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`date-picker-wrapper ${theme}`}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MMM dd, yyyy"
        placeholderText={placeholder}
        required={required}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        className="date-picker-input"
        wrapperClassName="date-picker-wrapper-class"
        calendarClassName={`date-picker-calendar ${theme}`}
        showPopperArrow={false}
        popperPlacement="bottom-start"
      />
    </div>
  );
};

export default CustomDatePicker;

