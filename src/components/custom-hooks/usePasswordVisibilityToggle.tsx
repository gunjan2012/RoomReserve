import React, { useState, MouseEvent } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export interface PasswordVisibility {
  showPassword: string | boolean;
  passwordInputProps: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const usePasswordVisibilityToggle = () => {
  const [showPassword, setShowPassword] = useState<string | boolean>(false);

  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const passwordInputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return { showPassword, passwordInputProps };
};

export default usePasswordVisibilityToggle;
