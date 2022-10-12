# pull official base image
FROM python:3.10.7-slim-buster

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# install psycopg2 dependencies
RUN apt-get update \
  && apt-get -y install gcc postgresql \
  && apt-get clean

RUN apt-get install -y netcat

# install dependencies from requirements.txt
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .
