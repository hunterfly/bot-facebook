const request = require("request-promise");
const commaNumber = require("comma-number");

module.exports = async function App(context) {
  try {
    if (context.event.isText) {
      let find1 = context.event.text.includes("โควิท");
      let find2 = context.event.text.includes("covid");
      if (find1 || find2) {
        const options = {
          method: "GET",
          uri: "https://covid19.th-stat.com/json/covid19v2/getTodayCases.json",
          json: true, // Automatically stringifies the body to JSON
          timeout: 600000,
        };
        const response = await request(options);
        await context.sendText(
          `ติดเชื้อสะสม: ${commaNumber(response.Confirmed)} (+ ${commaNumber(
            response.NewConfirmed
          )})`
        );
        await context.sendText(
          `หายแล้ว: ${commaNumber(response.Recovered)} (+ ${commaNumber(
            response.NewRecovered
          )})`
        );
        await context.sendText(
          `รักษาอยู่ใน รพ.: ${commaNumber(response.Hospitalized)}`
        );
        await context.sendText(
          `เสียชีวิต: ${commaNumber(response.Deaths)} (+ ${commaNumber(
            response.NewDeaths
          )})`
        );
        await context.sendText(`ข้อมูลอัพเดท: ${response.UpdateDate}`);
      } else {
        await context.sendText("สวัสดีชาวโลก2");
      }
    } else {
      await context.sendText("สวัสดีชาวโลก1");
    }
  } catch (error) {
    console.log(error);
    await context.sendText("การดึงข้อมูลผิดพลาด กรุณาส่งมาใหม่อีกครั้ง");
  }
};
