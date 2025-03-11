import React from "react";
import { LogBox } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface CustomDropDownPickerProps {
  open: boolean;
  value: string | null;
  items: { label: string; value: string }[];
  setOpen: (open: boolean) => void;
  setValue: (value: string | null) => void;
  placeholder?: string;
  multiple?: boolean;
  mode?: string;
  search?: boolean;
  zIndex?: number;
}

const CustomDropDownPicker: React.FC<CustomDropDownPickerProps> = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  placeholder = "",
  multiple = false,
  mode = "SIMPLE",
  search = false,
  zIndex
}) => {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews", // Mensaje exacto
  ]);
  
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      placeholder={placeholder}
      placeholderStyle={{
        color: "#fff",
        fontFamily: "LeagueSpartan-Bold",
        fontSize: 14,
      }}
      selectedItemContainerStyle={{ backgroundColor: "#FE4949" }}
      selectedItemLabelStyle={{
        color: "#fff",
        fontFamily: "LeagueSpartan-Bold",
      }}
      labelStyle={{
        color: "#fff",
        fontFamily: "LeagueSpartan-Bold",
        fontSize: 14,
      }}
      containerStyle={{ backgroundColor: "#0a0a0a" }}
      listItemLabelStyle={{
        color: "#fff",
        fontFamily: "LeagueSpartan-Bold",
      }}
      dropDownContainerStyle={{ backgroundColor: "#121212" }}
      style={{ backgroundColor: "#121212", borderWidth: 0, paddingLeft: 10 }}
      badgeDotColors={["#FE4949"]}
      theme="DARK"
      multiple={multiple}
      mode={mode}
      searchable={search}
      searchPlaceholder="Buscar..."
      zIndex={zIndex}
    />
  );
};

export default CustomDropDownPicker;
