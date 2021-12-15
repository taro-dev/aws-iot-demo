# coding:utf-8
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import RPi.GPIO as GPIO
import json
import time
import sys

# MQTT Client
myMQTTClient = AWSIoTMQTTClient("raspi")

# MQTT Settings
myMQTTClient.configureEndpoint("XXX-ats.iot.us-east-2.amazonaws.com", 443)
myMQTTClient.configureCredentials("./certs/XXX.pem", "./certs/XXX-private.pem.key", "./certs/XXX-certificate.pem.crt")
myMQTTClient.configureOfflinePublishQueueing(-1)
myMQTTClient.configureDrainingFrequency(2)
myMQTTClient.configureConnectDisconnectTimeout(10)
myMQTTClient.configureMQTTOperationTimeout(5)

# Connect to AWS IoT
myMQTTClient.connect()
print ("Connected to AWS IoT")

# pin is 21
pin = 21

print("Setting: ",pin)

# GPIO mode is GPIO.BCM
GPIO.setmode(GPIO.BCM)
# GPIO21 pulldown on
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

print ("SetUp to GPIO")

now_value = GPIO.input(pin)
while True:
    try:
        value = GPIO.input(pin)

        if now_value != value:
            message = {}
            message['value'] = now_value
            message['message'] = "Open" if value == 0 else "Close"
            messageJson = json.dumps(message)
            myMQTTClient.publish("data/sensor", messageJson, 1)
            print ("data/sensor send:%s" % (messageJson))
            now_value = value
        
        time.sleep(1)
    except KeyboardInterrupt:
        GPIO.cleanup()
        myMQTTClient.disconnect()
        sys.exit()
