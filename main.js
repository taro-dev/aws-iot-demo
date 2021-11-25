const gpio = require("rpi-gpio");

const PIN = 8; // 8番ピン(GPIO14)

let LED = true;

gpio.setup(PIN, gpio.DIR_OUT, () => {
  setInterval(() => {
    if (LED) {
      gpio.write(PIN, false);
      LED = false;
    } else {
      gpio.write(PIN, true);
      LED = true;
    }
  }, 1000);
});
