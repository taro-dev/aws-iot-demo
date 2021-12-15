# aws-iot-demo

GPIO の 21 ピンから磁気スイッチの状態を取得し、AWS IoT・SNS・Lambda を使用して Slack へ通知します。
See:https://ma-vericks.com/raspberry-pi-door-sensor/

## ファイル配置

AWS IoT から取得した証明書・鍵ファイルを certs 配下へ設置

```
XXX-certificate.pem.crt
XXX-private.pem
XXX-public.pem.key
AmazonRootCA1.pem
```

## ライブラリインストール

```
pip install AWSIoTPythonSDK
```

## 設定値書き換え

```
L9 : AWS IoTのモノで追加した名前を設定します。
myMQTTClient = AWSIoTMQTTClient("raspi")

L12 : AWS IoTで自動設定されるエンドポイントを設定します。
myMQTTClient.configureEndpoint("XXX-ats.iot.us-east-2.amazonaws.com", 443)

L13 : 証明書・鍵ファイルを設定します。
myMQTTClient.configureCredentials("./certs/XXX.pem", "./certs/XXX-private.pem.key", "./certs/XXX-certificate.pem.crt")
```

## 起動方法

```
python door-sensor.py
```

1 秒おきにセンサーの状態をチェックして
変更があった場合のみ AWS IoT へ publish する

## その他

Lambda へ連携する場合は

```
lambda-function.py
```

をご使用ください。
