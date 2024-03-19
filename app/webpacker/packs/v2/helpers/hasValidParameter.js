const hasValidParameter = (param, validSections) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sectionValue = urlSearchParams.get(param);

  if (sectionValue) {
    if (validSections.includes(sectionValue) ) {
      return sectionValue;
    }
  }

  return false;
}

export default hasValidParameter;
