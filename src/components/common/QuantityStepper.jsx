import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityStepper = ({
  value,
  onChange,
  max = 99999,
  isDisabled = false,
}) => {
  const minus = () => onChange(Math.max(1, value - 1));
  const plus = () => onChange(Math.min(max, value + 1));

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || 1;
    onChange(Math.max(1, Math.min(max, newValue)));
  };

  return (
    <div className="flex items-center justify-center gap-10">
      <button
        onClick={minus}
        className="p-4 bg-(--sub-color) text-white rounded-sm hover:opacity-90 hover:cursor-pointer"
      >
        <FaMinus />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min="1"
        max={max}
        className="h-full text-center min-w-5 outline-0"
        disabled={isDisabled}
      />
      <button
        onClick={plus}
        className="p-4 bg-(--sub-color) text-white rounded-sm hover:opacity-90 hover:cursor-pointer"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuantityStepper;
