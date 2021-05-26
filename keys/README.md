These are keys to enable SSL on the websocket end of things.

I generated them using the following commands:

```
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365000 -in csr.pem -signkey key.pem -out server.crt
```

I have put this idea on hold, as I'm running into too many issues I do not understand.
