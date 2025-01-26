# import http.client

# conn = http.client.HTTPSConnection("openl-translate.p.rapidapi.com")

# payload = "{\"target_lang\":\"fr\",\"text\":\"I love you\"}"

# headers = {
#     'x-rapidapi-key': "4256c7a201mshb8e6abb767a57fcp183b37jsn37f1174f33ec",
#     'x-rapidapi-host': "openl-translate.p.rapidapi.com",
#     'Content-Type': "application/json"
# }

# conn.request("POST", "/translate", payload, headers)

# res = conn.getresponse()
# data = res.read()

# print(data.decode("utf-8"))
import http.client
import json  # Import json module

conn = http.client.HTTPSConnection("openl-translate.p.rapidapi.com")

s = "I love you"  # Your string variable

payload = json.dumps({  # Convert dictionary to JSON string
    "target_lang": "fr",
    "text": s
})

headers = {
    'x-rapidapi-key': "4256c7a201mshb8e6abb767a57fcp183b37jsn37f1174f33ec",
    'x-rapidapi-host': "openl-translate.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("POST", "/translate", body=payload, headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
