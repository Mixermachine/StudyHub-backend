# Addapted from https://mherman.org/blog/dockerizing-a-react-app/
# base image
FROM node:12.3-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./ /app/
RUN npm install --silent

# start app
CMD ["npm", "start"]