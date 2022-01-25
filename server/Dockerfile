FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
ARG APIKEY=your-api-key
RUN sed -i "s/XXAPIKEYXX/$APIKEY/g" /etc/nginx/conf.d/default.conf
