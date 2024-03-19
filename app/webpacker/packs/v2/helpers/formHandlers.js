export const handleInputChange = (setData, name, value, parent = null) => {
  setData((formData) => {
    if (parent) {
      return {
        ...formData,
        [parent]: {
          ...formData[parent],
          [name]: value
        }
      };
    }
    return { ...formData, [name]: value };
  });
};
