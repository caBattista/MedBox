#include <Servo.h>

Servo s1;

void setup() {
  s1.attach(14);
  s1.write(50);
  delay(300);
  s1.detach();
  Serial.begin(115200);
  Serial.println("Ready");
}

void loop() {
  
  if ( Serial.available()) {
    char ch = Serial.read();

    switch(ch) {
      case '1':
        open(1);
        break;
      case '2':
        open(2);
        break;
      case '5':
        open(5);
        break;
    }
  }

}

void open(int j){
  s1.attach(14);
  for(int i = 0; i < j; i++){
    s1.write(130);
    delay(300);
    s1.write(50);
    delay(300);
    if(j > 1 && i < j){
      delay(1000);
      }
    
  }
  s1.detach();
}