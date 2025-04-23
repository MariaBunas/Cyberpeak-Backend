import gps
import requests
import json
import time
from picamera import PiCamera

SERVER_URL = "https://cyberpeak-server.onrender.com/upload"
camera = PiCamera()

def get_gps_data():
    session = gps.gps(mode=gps.WATCH_ENABLE)
    report = session.next()
    if report['class'] == 'TPV':
        lat = getattr(report, 'lat', None)
        lon = getattr(report, 'lon', None)
        return lat, lon
    return None, None

def capture_image():
    image_path = "/home/pi/image.jpg"
    camera.capture(image_path)
    return image_path

def send_data():
    lat, lon = get_gps_data()
    image_path = capture_image()

    if lat and lon:
        files = {'image': open(image_path, 'rb')}
        data = {"location": f"RaspberryPi-GPS,high,{lat},{lon}"}
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(SERVER_URL, data=json.dumps(data), files=files, headers=headers)
        
        if response.status_code == 200:
            print("Locație + imagine salvate cu succes!")
        else:
            print(f"Eroare la trimiterea datelor: {response.status_code}")

while True:
    send_data()
    time.sleep(300)  # 300 sec = 5 minute
