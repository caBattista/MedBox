#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
ESP8266WebServer server(80);

const char* ssid = "TP-LINK_8B1E";
const char* password = "94077278";

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(4); //OLED_RST

#include <Servo.h>
Servo s1;
const int servoPin = 4;
const int servoClosed = 50;
const int servoOpen = 130;

#include <NeoPixelBus.h>
NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(1, 3);

int buttonPin = 13;

void setup(void){

  Serial.begin(74880);
  delay(500);

  strip.Begin();
  strip.SetPixelColor(0, RgbColor(64,0,64));
  strip.Show();
  
  door(servoClosed);
  
  pinMode(buttonPin, INPUT_PULLUP);

  Wire.begin(14,12);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3c);  // initialize with the I2C addr 0x3D (for the 128x64)
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println("Connecting");
  display.display();
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    //Serial.print(".");
    display.print(".");
    display.display();
  }

  display.println("");
  display.println("Connected to:");
  display.println(ssid);
  display.println("IP:");
  display.println(WiFi.localIP());
  display.display();

  server.on("/", [](){
    server.send(200, "text/plain", "hello from esp8266!");
    displ("/");
  });

  server.on("/inline", [](){
    server.send(200, "text/plain", "this works as well");
    displ("inline");
  });

  server.begin();
  display.println("HTTP server started");
  display.display();
  
  while(digitalRead(buttonPin) == 1){
    delay(100);
  }

  display.clearDisplay();
  display.display();
  strip.SetPixelColor(0, RgbColor(0,0,0));
  strip.Show();
  delay(1000);
}

void loop(void){
  server.handleClient();
  if(digitalRead(buttonPin) == 0){
    
    displ("dispensing");
    strip.SetPixelColor(0, RgbColor(0,64,0));
    strip.Show();
    
    door(servoOpen);
    door(servoClosed);
    
    displ("");
    strip.SetPixelColor(0, RgbColor(0,0,0));
    strip.Show();
  }
}

void displ(String str){
  display.clearDisplay();   // clears the screen and buffer  
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println(str);
  display.display();
}

void door(uint8_t pos){
  s1.attach(servoPin);
  s1.write(pos);
  delay(300);
  s1.detach();
}