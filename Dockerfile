FROM nginx:alpine
COPY index.html style.css app.js mission.json /usr/share/nginx/html/
