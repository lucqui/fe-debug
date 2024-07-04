import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { FaArrowDown, FaCheck, FaChevronDown } from "react-icons/fa6";

function Dropdown({ data, selected, setSelected, disabled, width }) {
  // const [selected, setSelected] = useState(data[0]);
  const [active, setActive] = useState(
    data.findIndex((e) => e?.name === selected?.name)
  );
  useEffect(() => {
    setActive(data.findIndex((e) => e?.name === selected?.name));
    console.log("selected", selected);
  }, [selected]);

  return (
    <Listbox
      as="div"
      value={selected}
      onChange={setSelected}
      className={`rounded-md relative ${width}`}
    >
      <Listbox.Button
        className={`${width} text-left flex items-center justify-between px-3 py-1 border border-slate-300 rounded-md text-slate-700`}
      >
        {selected?.name} <FaChevronDown />
      </Listbox.Button>
      <Listbox.Options
        className={`absolute bg-white z-30 ${width} text-left py-1 px-1 rounded-md border border-slate-300`}
      >
        {data.map((item, index) => (
          <Listbox.Option
            disabled={disabled}
            className={`py-2 px-3 hover:bg-slate-400 flex justify-between items-center hover:text-white rounded-md cursor-pointer ${
              active == index
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-600"
            } `}
            onClick={() => setActive(index)}
            key={index}
            value={item}
          >
            {item.name}
            {active == index && <FaCheck className="text-white" />}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
export default Dropdown;
