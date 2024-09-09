import React from 'react'

const CustomStyle = () => {
    const customStyle = {
        control: (provided, state) => ({
          ...provided,
          minHeight: '35px',
          height: '35px',
        }),
        valueContainer: (provided, state) => ({
          ...provided,
          height: '25px',
        }),
        input: (provided, state) => ({
          ...provided,
          margin: '0px',
          textAlign: 'left',
        }),
        indicatorSeparator: (provided, state) => ({
          ...provided,
          display: 'none', // Hide the indicator separator
        }),
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: '35px',
          width: '10px',
          padding: '0px !important',
        }),
        dropdownIndicator: (provided, state) => ({
          ...provided,
          padding: '0px',
          position: 'absolute',
          right: '0px',
          fontSize: '20px',
          width: '15px',
        }),
        menu: (provided, state) => ({
          ...provided,
          borderRadius: '5px',
          border: '1px solid #000',
          padding: '0',
          margin: '0',
          backgroundColor: '#fff'
        }),
        menuList: (provided, state) => ({
          ...provided,
          padding: '0',
          margin: '0',
          backgroundColor: '#fff',
          borderRadius: '5px'
        }),
        option: (provided, state) => ({
          ...provided,
          padding: '0px 16px',
          backgroundColor: state.isSelected ? '' : state.isFocused ? '#1865cd' : '#fff',
          color: state.isSelected ? '' : state.isFocused ? '#fff' : '',
        }),
        clearIndicator: (provided, state) => ({
          ...provided,
          display: 'none', // Hide the clear indicator (cross icon)
        }),
      };
  return {
    customStyle
  }
    
}

export default CustomStyle