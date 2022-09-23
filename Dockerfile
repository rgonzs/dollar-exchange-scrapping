FROM node:16-alpine as builder


COPY . /build

WORKDIR /build

RUN yarn install && \
    yarn build


FROM amazon/aws-lambda-nodejs:16
COPY --from=builder /build/dist ./
COPY --from=builder /build/package.json ./
RUN npm install --production
CMD [ "/dist/index.handler" ]