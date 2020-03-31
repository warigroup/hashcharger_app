export const capitalizeFirstLetter = (string) => {
    if (string !== undefined) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };