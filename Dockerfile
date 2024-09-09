# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine as base
WORKDIR /user/app

# install dependencies into temp folder
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --verbose --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

RUN mkdir /temp/ui
COPY ./ui /temp/ui
RUN cd /temp/ui && bun install --verbose
RUN cd /temp/ui && bun run build

# copy node_modules from temp folder
# then copy all (non-ignored) project files into the image
# FROM install AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .

# [optional] tests & build
# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
RUN ls && mkdir -p public
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
COPY --from=install /temp/ui/build/* public/

# run the app
USER bun
EXPOSE 5555/tcp
CMD ["bun", "run", "start"]