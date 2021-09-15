# pocket-stars

See the [ADRs folder](_doc/adr) for important architectural notes.


## Development

#### Initial setup

```shell
$ cd pocket-stars
$ bundle install
$ rails webpacker:install
```

#### Database setup

You now need to setup a database. This app uses MySQL. You can use the docker-compose file in [_dev](_dev/docker-compose.yml):

```shell
$ cd pocket-stars/_dev
$ docker-compose up
```

For maintenance using a UI, you can open http://localhost:8888/ and use the credentials: `server=db`, `user=root` and `password=pass`.

#### Database migration

```shell
$ cd pocket-stars
$ rake db:create
```

#### Starting the app

```shell
$ cd pocket-stars
$ rails server
```

App should now be accessible on http://127.0.0.1:3000/.

## Running tests

```shell
$ cd pocket-stars
$ rails test
```