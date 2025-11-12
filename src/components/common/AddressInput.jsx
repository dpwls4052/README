import React from 'react';

const AddressInput = ({
  postcode,
  address,
  detailAddress,
  onDetailAddressChange,
  onPostcodeSearch,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input 
          placeholder="우편번호" 
          value={postcode} 
          readOnly 
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-100"
        />
        <button 
          onClick={onPostcodeSearch} 
          className="px-4 py-2 bg-(--main-color) text-white rounded-lg hover:bg-(--sub-color) transition"
        >
          주소찾기
        </button>
      </div>
      <input 
        placeholder="주소" 
        value={address} 
        readOnly 
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100"
      />
      <input 
        id="detailAddress" 
        placeholder="상세주소" 
        value={detailAddress} 
        onChange={(e) => onDetailAddressChange(e.target.value)} 
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-(--main-color)"
      />
    </div>
  );
};

export default AddressInput;