import React, { FC, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

// styles
import { AddIconButton, StyledSelect } from "./GenericDropdown.style";

// components
import GenericInput from "components/genericInput/GenericInput.component";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  allowAddNew?: boolean;
  onAddNew?: (newCategory: string) => void;
}

const GenericDropdown: FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  allowAddNew = false,
  onAddNew,
}) => {
  const { t } = useTranslation();
  const [newOption, setNewOption] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleAddNew = () => {
    const trimmed = newOption.trim();
    if (onAddNew && trimmed !== "") {
      onAddNew(trimmed);
      setNewOption("");
    }
  };
  const translatedPlaceholder = placeholder || t("select_option");
  return (
    <>
      <StyledSelect value={value} onChange={handleChange}>
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>

      {allowAddNew && (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <GenericInput
            type="text"
            placeholder={translatedPlaceholder}
            value={newOption}
            onChange={(value: string) =>
            setNewOption(value)
            }
          />
          <AddIconButton type="button" onClick={handleAddNew}>
            <Plus size={18} />
          </AddIconButton>
        </div>
      )}
    </>
  );
};

export default GenericDropdown;
