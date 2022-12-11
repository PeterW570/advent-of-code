# Imports (including PWM and ADC)
from machine import ADC, Pin, PWM
import time

# Set up the potentiometer on ADC pin 27
potentiometer = ADC(Pin(27))

# Set up the LED pin with PWM
led = PWM(Pin(18))

# Set the PWM Frequency
# Sets how often to switch the power between on and off for the LED
led.freq(1000)

# Create a variable for our reading
reading = 0

while True: # Run forever
    
    reading = potentiometer.read_u16() # Read the potentiometer value and set this as our reading variable value
    
    print(reading) # Print the reading
    
    # Set the LED PWM duty cycle to the potentiometer reading value
    # The duty cycle tells the LED for how long it should be on each time
    led.duty_u16(reading)
    
    time.sleep(0.0001) # A really short delay
