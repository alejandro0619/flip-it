"use client";
import { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/react";
const ColorModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Recupera la preferencia del usuario del localStorage
    const darkModePreference = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModePreference);
    document.body.classList.toggle("dark", darkModePreference);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Actualiza el estado en el localStorage
      localStorage.setItem("darkMode", newMode.toString());
      // Aplica o quita la clase 'dark' en el body
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <Tooltip
      label={isDarkMode ? "😴" : "😉"}
      bg={isDarkMode ? '#bc96e6' : '#210b2c'} // #bc96e6 #210b2c
      placement="left"
      size={'sm'}
      hasArrow
    >
      <button
        onClick={toggleDarkMode}
        className={`p-2 ${
          isDarkMode ? "bg-custom-light" : "bg-custom-dark"
        } text-white rounded text-2xl`}
      >
        {isDarkMode ? "🌞" : "🌙"}
      </button>
    </Tooltip>
  );
};

export default ColorModeToggle;
