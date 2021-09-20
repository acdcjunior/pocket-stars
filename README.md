# pocket-stars

A very simple realtime review+rating app powered by Rails and React/jQuery.

Demo:
- https://pocket-stars-mvp.herokuapp.com/ (MVP, jQuery)
- https://pocket-stars-v2.herokuapp.com/ (realtime, half-star support, React)

See the [ADRs folder](_doc/adr) for important architectural notes.


## Development

#### Initial setup

```shell
$ cd pocket-stars # go to project root
$ bundle install
$ rails webpacker:install
```

#### Database setup

You now need to setup a database. This app uses MySQL. You can use the docker-compose file in [`_dev`](_dev/docker-compose.yml):

```shell
$ cd pocket-stars # go to project root
$ cd _dev
$ docker-compose up
```

For maintenance using a UI, you can open http://localhost:8888/ and use the credentials: `server=db`, `user=root` and `password=pass`.

#### Database migration

```shell
$ cd pocket-stars # go to project root
$ rake db:create
$ rake db:migrate
```

#### Starting the app

```shell
$ cd pocket-stars # go to project root
$ rails server
```

App should now be accessible on http://127.0.0.1:3000/.

## Running tests

```shell
$ cd pocket-stars # go to project root
$ rake db:create RAILS_ENV=test # if you haven't already
$ rake db:migrate  # if you haven't already
$ rails test # all but system tests
$ rails test:system # system tests
$ rails test:all # ALL tests
```

Troubleshooting: if you tests fail randomly due to parallel execution (e.g. file locking, streams closing),
try disabling it at [`test_helper.rb`](test/test_helper.rb#L7).
