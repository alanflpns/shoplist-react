export const removeNoNumeric = (val: string) => {
  if (val === undefined || val === null) return val;
  return val.toString().replace(/[^\d]+/g, "");
};

export const moneyInputFormat = (inputText: string) => {
  try {
    if (inputText === null || inputText === undefined || inputText === "")
      return "";
    // eslint-disable-next-line prefer-template
    let tmp: any = parseFloat(removeNoNumeric(inputText) + "");

    // eslint-disable-next-line prefer-template
    tmp = removeNoNumeric((tmp / 100).toFixed(2) + "");

    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;
  } catch (ex) {
    return "";
  }
};
export const moneyInputFormatToFloat = (inputText: string) => {
  try {
    const valor = inputText.replace("R$", "");
    const result =
      valor !== " "
        ? parseFloat(
            parseFloat(
              valor
                .split("")
                .filter((char) => char !== ".")
                .join("")
                .replace(",", ".")
            ).toFixed(2)
          )
        : "";
    return result;
  } catch (ex) {
    return "";
  }
};
