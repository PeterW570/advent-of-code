# Imports
from machine import Pin, PWM
import time

# Set up the Buzzer pin as PWM
buzzer = PWM(Pin(13)) # Set the buzzer to PWM mode

# Create our library of tone variables for "Jingle Bells"
C = 523
D = 587
E = 659
G = 784

# Create volume variable (Duty cycle)
volume = 32768

# Create our function with arguments
def playtone(note,vol,delay1,delay2):
    buzzer.duty_u16(vol)
    buzzer.freq(note)
    time.sleep(delay1)
    buzzer.duty_u16(0)
    time.sleep(delay2)
    
# Play the tune
playtone(E,volume,0.1,0.2)
playtone(E,volume,0.1,0.2)
playtone(E,volume,0.1,0.5) #Longer second delay

playtone(E,volume,0.1,0.2)
playtone(E,volume,0.1,0.2)
playtone(E,volume,0.1,0.5) #Longer second delay

playtone(E,volume,0.1,0.2)
playtone(G,volume,0.1,0.2)
playtone(C,volume,0.1,0.2)
playtone(D,volume,0.1,0.2)
playtone(E,volume,0.1,0.2)

# Duty to 0 to turn the buzzer off
buzzer.duty_u16(0)
