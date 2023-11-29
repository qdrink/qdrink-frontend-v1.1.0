#build imagen 
docker build -t medeldiego/v1.1.0_qdrink-frontend . 
#levantar contenedor (--name no acepta caracteres '_ ')
docker run -d -it -p 80:80/tcp --name v1.1.0-qdrink-frontend  medeldiego/v1.1.0_qdrink-frontend:latest
