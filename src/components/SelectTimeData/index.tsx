function getNextTwentyDays(): string[] {
  let result: string[] = [];
  let currentDate = new Date();

  // Move to the next day from current
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 0; i < 20; i++) {
    let yyyy = currentDate.getFullYear();
    let mm = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JS
    let dd = String(currentDate.getDate()).padStart(2, "0");

    result.push(`${yyyy}-${mm}-${dd}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

export const options = [
  // 第一列
  [
    {
      text: "2023-08-24",
      value: "2023-08-24",
    },
    ...getNextTwentyDays()?.map((item) => {
      return {
        text: item,
        value: item,
      };
    }),
  ],
  [
    { text: "8:00-10:00", value: "8:00-10:00" },
    { text: "10:00-12:00", value: "10:00-12:00" },
    { text: "13:00-15:00", value: "13:00-15:00" },
    { text: "15:00-17:00", value: "15:00-17:00" },
    { text: "17:00-19:00", value: "17:00-19:00" },
  ],
];
