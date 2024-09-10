# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine as base
WORKDIR /user/app

# install dependencies into temp folder
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
RUN mkdir -p /temp/dev/patches
COPY package.json bunfig.toml /temp/dev/
COPY patches/* /temp/dev/patches/
RUN cd /temp/dev && bun install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
RUN mkdir -p /temp/dev/patches
COPY package.json bunfig.toml /temp/prod/
COPY patches/* /temp/prod/patches/
RUN cd /temp/prod && bun install --production

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
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
COPY ui/build public

# run the app
USER bun
EXPOSE 5555/tcp
CMD ["bun", "run", "start"]