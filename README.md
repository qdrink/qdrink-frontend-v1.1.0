#build imagen 
docker build -t qdrink/frontend .
#levantar contenedor
docker run -d -it -p 80:80/tcp --name qdrink-frontend qdrink/frontend:latest