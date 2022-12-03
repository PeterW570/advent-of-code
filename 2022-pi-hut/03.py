# Imports
from machine import Pin
import time

# Set up our button names and GPIO pin numbers
# Also set pins as inputs and use pull downs
button1 = Pin(13, Pin.IN, Pin.PULL_DOWN)
button2 = Pin(8, Pin.IN, Pin.PULL_DOWN)
button3 = Pin(3, Pin.IN, Pin.PULL_DOWN)

# Set up our LED names and GPIO pin numbers
red = Pin(18, Pin.OUT)
amber = Pin(19, Pin.OUT)
green = Pin(20, Pin.OUT)

while True: # Loop forever
    
    time.sleep(0.2) # Short Delay
    
    buttonsPressed = button1.value() + button2.value() + button3.value()
    
    if buttonsPressed == 1:
        
        if button1.value() == 1:
            green.value(1)
        elif button2.value() == 1:
            amber.value(1)
        elif button3.value() == 1:
            red.value(1)
        
    elif buttonsPressed > 1:
        
        if button1.value() == 1:
            green.toggle()
        if button2.value() == 1:
            amber.toggle()
        if button3.value() == 1:
            red.toggle()
        
    else: # no buttons being pressed
        
        red.value(0) # red LED off
        amber.value(0) # amber LED off
        green.value(0) # green LED off

