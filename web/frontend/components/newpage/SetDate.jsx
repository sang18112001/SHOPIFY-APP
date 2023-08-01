import { Box, DatePicker, Icon, Popover, TextField } from "@shopify/polaris";
import { CalendarMinor } from "@shopify/polaris-icons";
import React, { useEffect, useRef, useState } from "react";

export function SetDate({setWillDate}) {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const parsedDate = new Date(selectedDate);
  const formattedDate = `${
    parsedDate.getMonth() + 1
  }/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose() {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
    
  }

  useEffect(() => {
    setWillDate(formattedDate)
  }, [selectedDate])

  return (
    <Box>
      <Popover
        active={visible}
        autofocusTarget="none"
        preferredAlignment="left"
        fullWidth
        preferInputActivator={false}
        preferredPosition="above"
        preventCloseOnChildOverlayClick
        onClose={handleOnClose}
        activator={
          <TextField
            role="combobox"
            label={"Visibility date"}
            prefix={<Icon source={CalendarMinor} />}
            value={formattedDate}
            onFocus={() => setVisible(true)}
            onChange={handleInputValueChange}
            autoComplete="off"
          />
        }
      >
        <div style={{ width: "100%", overflow: "hidden" }}>
          <DatePicker
            month={month}
            year={year}
            selected={selectedDate}
            onMonthChange={handleMonthChange}
            onChange={handleDateSelection}
          />
        </div>
      </Popover>
    </Box>
  );
}
