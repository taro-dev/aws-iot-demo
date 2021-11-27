const awsIot = require("aws-iot-device-sdk");
const gpio = require("rpi-gpio");

const PIN = 8; // 8番ピン(GPIO14)

let LED = true;

const device = awsIot.device({
  keyPath: "./config/XXX-private.pem.key", // 秘密鍵
  certPath: "./config/XXX-certificate.pem.crt", // 証明書
  caPath: "./config/XXX.pem", // CA証明書
  clientId: "XXX", // ClientID
  host: "XXX-ats.iot.us-east-2.amazonaws.com", // エンドポイント
});

device.on("connect", function () {
  console.log("connect");

  device.subscribe("$aws/things/XXX/shadow/update/delta");

  device.publish(
    "$aws/things/XXX/shadow/update",
    JSON.stringify({
      state: {
        reported: {
          led: "off",
        },
      },
    })
  );

  gpio.setup(PIN, gpio.DIR_OUT, () => {
    console.log("connect-PIN操作", PIN);
    gpio.write(PIN, true); // true=消灯
  });
});

device.on("message", function (topic, payload) {
  console.log("message", topic, payload.toString());

  const shadow = JSON.parse(payload.toString());
  console.log("shadow", shadow);
  console.log("shadow.state.led", shadow.state.led);

  if (shadow.state && shadow.state.led) {
    const led = shadow.state.led !== "on";
    console.log("led no ON?", shadow.state.led, led);

    gpio.setup(PIN, gpio.DIR_OUT, () => {
      console.log("PIN操作", PIN, led);
      gpio.write(PIN, led);
    });

    device.publish(
      "$aws/things/XXX/shadow/update",
      JSON.stringify({
        state: {
          reported: {
            led: shadow.state.led,
          },
        },
      })
    );
  }
});

// gpio.setup(PIN, gpio.DIR_OUT, () => {
//   setInterval(() => {
//     if (LED) {
//       gpio.write(PIN, false);
//       LED = false;
//     } else {
//       gpio.write(PIN, true);
//       LED = true;
//     }
//   }, 1000);
// });
