# First stage: Clone the repository
FROM alpine/git as clone
ARG REPO_URL
ARG GIT_USERNAME
ARG GIT_PASSWORD
WORKDIR /app
RUN git clone https://kristofer@constaq.se:-5dg\2Y`D)D,eW%ZPP@https://extgit.constaq.se/kristofer/nodejs-app.git .

# Second stage: Set up the application
FROM node:14
WORKDIR /usr/src/app

# Copy files from the cloned repository
COPY --from=clone /app .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

