#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server = ESP8266WebServer(80);

#include <WebSocketsClient.h>
WebSocketsClient webSocket;

#include <ArduinoJson.h>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(4); //OLED_RST

#include <Servo.h>
Servo servo;
const uint8_t servoPin = 4;
const uint8_t closedAngle = 50;
const uint8_t openAngle = 130;

#include <NeoPixelBus.h>
NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(1, 3);
const uint8_t pixel = 0;

const int buttonPin = 13;

String ws = "192.168.0.103";

void setup(void){

  servo.attach(servoPin);
  servo.write(closedAngle);
  delay(300);
  servo.detach();

  strip.Begin();
  setLed(RgbColor(64,0,64));
  
  pinMode(buttonPin, INPUT_PULLUP);

  Wire.begin(14,12);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3c);  // initialize with the I2C addr 0x3D (for the 128x64)
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println("Set WsIp at: ");
  display.println("192.168.4.1/set?ws=IP");
  display.println("SSID: MedBox");
  display.display();

  WiFi.mode(WIFI_AP);
  WiFi.softAP("MedBox", "hier1234");

  server.on("/set", []() {
    if(server.args() == 1){
      if(server.argName(0) == "ws"){ws = String(server.arg(0));}
      }
    server.send(200, "text/html", "Set WsIP to: " + server.arg(0));   
  });
  server.begin();

  // Wait for button press
  while(digitalRead(buttonPin) == 1){delay(100);server.handleClient();}
  WiFi.mode(WIFI_STA);

  display.setCursor(0,0);
  display.clearDisplay();
  display.print("Connecting");
  display.display();

  WiFiMulti.addAP("huawei", "12345678");
  WiFiMulti.addAP("TP-LINK_8B1E", "94077278");

    uint8_t i = 0;
  // Wait for connection
  while ((WiFiMulti.run() != WL_CONNECTED) && (i<10)) {
    delay(1000);
    display.print(".");
    display.display();
    i++;
  }

  display.println("");
  display.print("My IP:");
  display.println(WiFi.localIP());
  display.print("WsIP:");
  display.println(ws);
  display.display();

  webSocket.begin(ws, 8085, "/");

  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  // Wait for button press
  while(digitalRead(buttonPin) == 1){delay(100);webSocket.loop();}

  display.clearDisplay();
  display.display();
  setLed(RgbColor(0,0,0));
  delay(1000);
}

void dispense(){
  servo.attach(servoPin);
  servo.write(openAngle);
  delay(300);
  servo.write(closedAngle);
  delay(300);
  servo.detach();
}

void buttonhandler(){
  static uint32_t now = 0;
  static uint8_t bPushed = 0;
  if(millis() - now >= 50){ 
    now = millis();
    if(digitalRead(buttonPin) == 0 && bPushed == 0){
      bPushed = 1;
      webSocket.sendTXT("{\"event\":\"button_push\"}");
    }
    else if(digitalRead(buttonPin) == 1 && bPushed == 1){
      bPushed = 0; 
    }
  }
}

void setLed(RgbColor rgb){
    strip.SetPixelColor(pixel, rgb);
    strip.Show();
}

void ledAnimator(uint16_t setAnimi = 0, RgbColor rgb1i = RgbColor(0,0,0), RgbColor rgb2i = RgbColor(0,0,0), uint16_t intervali = 0){
  static uint32_t now = 0;
  static uint8_t ledOn = 0;
  static RgbColor rgb1 = RgbColor(0,0,0);
  static RgbColor rgb2 = RgbColor(0,0,0);
  static uint16_t interval = 0;
  
  if(setAnimi == 1){
    rgb1 = rgb1i;
    rgb2 = rgb2i;
    interval = intervali;
    return;
  }

  if(interval == 0){
    setLed(RgbColor(0,0,0));
    return;
  }

  if(millis() - now >= interval){ 
    now = millis();
    if(ledOn == 0){
      ledOn = 1;
      setLed(rgb1);
    }
    else{
      ledOn = 0;
      setLed(rgb2);
    }
  }
}

void displ(String str, uint8_t clearScr = 0, uint8_t tSize = 1){
  display.setTextSize(tSize);
  if(clearScr == 1){
    display.clearDisplay();
    display.setCursor(0,0);
    }
  display.print(str);
  display.display(); 
}

void handleJson(char* json){
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, json);
  if (error) {
    displ(error.c_str());
    return;
  }
  JsonObject& root = doc.as<JsonObject>();
  if(root["act"] == "dispense"){
    dispense();
  }
  else if(root["act"] == "led"){
    uint8_t led1[3];
    led1[0] = root["led1"][0];
    led1[1] = root["led1"][1];
    led1[2] = root["led1"][2];
    uint8_t led2[3];
    led2[0] = root["led2"][0];
    led2[1] = root["led2"][1];
    led2[2] = root["led2"][2];
    uint16_t interv = root["time"];
    ledAnimator(1, RgbColor(led1[0],led1[1],led1[2]), RgbColor(led2[0],led2[1],led2[2]), interv);
  }
  else if(root["act"] == "display"){
    String content = root["content"];
    uint8_t tSize = root["size"];
    uint8_t dClear = root["clear"];
    displ(content, dClear, tSize);
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {
    case WStype_DISCONNECTED:
      displ("websocket disconnected",1); 
      break;
    case WStype_CONNECTED: {
      displ("websocket connected",1);
      webSocket.sendTXT("Hi from Medbox");
    }
      break;
    case WStype_TEXT:
      handleJson((char*) payload);
      break;
  }
}

void loop(void){
  webSocket.loop();
  buttonhandler();
  ledAnimator();
}
