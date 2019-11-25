# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.3.4 (2019-11-25)


### Bug Fixes

* do not depend on playerIdConn; update meteor version ([cf75d01](https://github.com/empiricaly/meteor-empirica-core/commit/cf75d01))

### 1.3.3 (2019-11-25)

### 1.3.2 (2019-11-25)

### 1.3.1 (2019-11-23)


### Bug Fixes

* remove unnecessary player connection check on player.exit method ([f2cb4e6](https://github.com/empiricaly/meteor-empirica-core/commit/f2cb4e6)), closes [#73](https://github.com/empiricaly/meteor-empirica-core/issues/73)

## 1.3.0 (2019-11-05)


### Features

* **admin:** add batch games collapse and players overflow ([817ea8f](https://github.com/empiricaly/meteor-empirica-core/commit/817ea8f))
* add player logs features ([65f975d](https://github.com/empiricaly/meteor-empirica-core/commit/65f975d))
* new batch ui with games details ([19a4c35](https://github.com/empiricaly/meteor-empirica-core/commit/19a4c35))

## 1.2.0 (2019-10-10)


### Bug Fixes

* can only check conn on server ([d334c6f](https://github.com/empiricaly/meteor-empirica-core/commit/d334c6f))


### Features

* add way to force a player to exit ([6334223](https://github.com/empiricaly/meteor-empirica-core/commit/6334223))

## 1.1.0 (2019-08-12)


### Features

* minor first use improvements ([aba3a40](https://github.com/empiricaly/meteor-empirica-core/commit/aba3a40))

## 1.0.0 (2019-06-19)


### Bug Fixes

* **bots:** ensure bot field is available on client ([cb94771](https://github.com/empiricaly/meteor-empirica-core/commit/cb94771)), closes [#65](https://github.com/empiricaly/meteor-empirica-core/issues/65)


### Features

* **bots:** throw error when creating batch without bots defined ([646a9a9](https://github.com/empiricaly/meteor-empirica-core/commit/646a9a9)), closes [#65](https://github.com/empiricaly/meteor-empirica-core/issues/65)

## 0.14.0 (2019-05-09)


### Bug Fixes

* **export:** ensure data fields on Games are exported ([7f2b2df](https://github.com/empiricaly/meteor-empirica-core/commit/7f2b2df))

## 0.13.0 (2019-05-09)


### ⚠ BREAKING CHANGES

* Experiments depending on all rounds/stages being loaded in browser during a game
will break. It is no longer possible to have such access in the browser, but it remains available in
the server callbacks, where any logic depending on rounds/stages other than the current ones is
recommended to move.

* improve performance issues on games with many rounds/stages ([7da56f8](https://github.com/empiricaly/meteor-empirica-core/commit/7da56f8)), closes [#62](https://github.com/empiricaly/meteor-empirica-core/issues/62)

## 0.12.0 (2019-04-05)


### Features

* **about:** expose about text to api ([859084c](https://github.com/empiricaly/meteor-empirica-core/commit/859084c)), closes [#56](https://github.com/empiricaly/meteor-empirica-core/issues/56)

## 0.11.0 (2019-04-05)


### Bug Fixes

* **exitsteps:** avoid throwing if onSubmit is called without data ([3186962](https://github.com/empiricaly/meteor-empirica-core/commit/3186962))
* **introsteps:** disable automatic focus on first input in intro steps ([e868005](https://github.com/empiricaly/meteor-empirica-core/commit/e868005)), closes [#59](https://github.com/empiricaly/meteor-empirica-core/issues/59)

## 0.10.0 (2019-03-26)


### Bug Fixes

* **getset:** allow set() to save empty string ("") values ([9ce3dbd](https://github.com/empiricaly/meteor-empirica-core/commit/9ce3dbd)), closes [#54](https://github.com/empiricaly/meteor-empirica-core/issues/54)

## 0.9.0 (2019-03-18)


### Bug Fixes

* **batch:** attach valid lobby config to treatment by default ([6cf5907](https://github.com/empiricaly/meteor-empirica-core/commit/6cf5907)), closes [#40](https://github.com/empiricaly/meteor-empirica-core/issues/40)

## 0.8.0 (2019-03-03)


### Bug Fixes

* **getset:** ensure set() preserves leading and trailing whitespace ([f0a8ecd](https://github.com/empiricaly/meteor-empirica-core/commit/f0a8ecd)), closes [#51](https://github.com/empiricaly/meteor-empirica-core/issues/51)

## 0.7.0 (2019-02-27)


### Features

* **testing:** add playerIdParam to URL when required ([#50](https://github.com/empiricaly/meteor-empirica-core/issues/50)) ([e512a56](https://github.com/empiricaly/meteor-empirica-core/commit/e512a56))

## 0.6.0 (2019-02-10)


### Bug Fixes

* **game:** increase estimated game finshed time ([352176a](https://github.com/empiricaly/meteor-empirica-core/commit/352176a)), closes [#47](https://github.com/empiricaly/meteor-empirica-core/issues/47)

## 0.5.0 (2019-01-22)


### Bug Fixes

* **bots:** fix bots callback arguments ([4454e69](https://github.com/empiricaly/meteor-empirica-core/commit/4454e69)), closes [#44](https://github.com/empiricaly/meteor-empirica-core/issues/44)

## 0.4.0 (2019-01-18)


### Bug Fixes

* keep data set on players in intro steps on game creation ([4dd3223](https://github.com/empiricaly/meteor-empirica-core/commit/4dd3223)), closes [#37](https://github.com/empiricaly/meteor-empirica-core/issues/37)

## 0.3.0 (2018-11-27)


### Bug Fixes

* **admin:** add key to players list to avoid React warnings ([f955c90](https://github.com/empiricaly/meteor-empirica-core/commit/f955c90))
* **callbacks:** do not call onSubmit if not defined by game ([fb8a5cf](https://github.com/empiricaly/meteor-empirica-core/commit/fb8a5cf))
* **status:** stop cancelling idle computation on player id update ([c3d04d6](https://github.com/empiricaly/meteor-empirica-core/commit/c3d04d6)), closes [#35](https://github.com/empiricaly/meteor-empirica-core/issues/35)

## 0.2.0 (2018-11-25)


### Features

* **api:** add onSubmit support ([5f23912](https://github.com/empiricaly/meteor-empirica-core/commit/5f23912)), closes [#15](https://github.com/empiricaly/meteor-empirica-core/issues/15)
* **status:** add status to players (online, idle...) ([1512880](https://github.com/empiricaly/meteor-empirica-core/commit/1512880)), closes [#16](https://github.com/empiricaly/meteor-empirica-core/issues/16)

## 0.1.0 (2018-11-24)


### Bug Fixes

* **debugmode:** make debug mode work for all games in a batch ([18d2304](https://github.com/empiricaly/meteor-empirica-core/commit/18d2304)), closes [#12](https://github.com/empiricaly/meteor-empirica-core/issues/12)
* Minor API fixes and better warnings for bad game initialization ([89ae8be](https://github.com/empiricaly/meteor-empirica-core/commit/89ae8be))


### Features

* add `game.index`, `batch.index` and `player.index` ([b52ad4f](https://github.com/empiricaly/meteor-empirica-core/commit/b52ad4f)), closes [#14](https://github.com/empiricaly/meteor-empirica-core/issues/14)

### 0.0.9 (2018-11-06)


### Bug Fixes

* Stages are sometimes out of order in the breadcrumb ([#24](https://github.com/empiricaly/meteor-empirica-core/issues/24)) ([079339b](https://github.com/empiricaly/meteor-empirica-core/commit/079339b))

### 0.0.8 (2018-10-31)


### Bug Fixes

* content is longer than page ([#10](https://github.com/empiricaly/meteor-empirica-core/issues/10)) ([57f9a18](https://github.com/empiricaly/meteor-empirica-core/commit/57f9a18))


### Features

* add lobby component override support ([#6](https://github.com/empiricaly/meteor-empirica-core/issues/6)) ([93de827](https://github.com/empiricaly/meteor-empirica-core/commit/93de827))

### 0.0.7 (2018-10-31)


### Bug Fixes

* CSV exports all on one line ([#13](https://github.com/empiricaly/meteor-empirica-core/issues/13)) ([6fd070b](https://github.com/empiricaly/meteor-empirica-core/commit/6fd070b))

### 0.0.6 (2018-10-28)


### Bug Fixes

* cancelling not working as expected ([#2](https://github.com/empiricaly/meteor-empirica-core/issues/2)) and between init & round "no experiments" is shown ([#4](https://github.com/empiricaly/meteor-empirica-core/issues/4)) ([ba1a03e](https://github.com/empiricaly/meteor-empirica-core/commit/ba1a03e))

### 0.0.5 (2018-10-24)


### Bug Fixes

* cancel doesn't cancel before game started ([212ec05](https://github.com/empiricaly/meteor-empirica-core/commit/212ec05))
* **admin:** background is white when content longer than window ([6230c19](https://github.com/empiricaly/meteor-empirica-core/commit/6230c19))
* cancellation improvements ([f3319f2](https://github.com/empiricaly/meteor-empirica-core/commit/f3319f2))
* game.set() does not work in callbacks ([382cb87](https://github.com/empiricaly/meteor-empirica-core/commit/382cb87))


### Features

* updated to v0.0.5 ([963d45a](https://github.com/empiricaly/meteor-empirica-core/commit/963d45a))

### 0.0.4 (2018-10-07)

### 0.0.3 (2018-10-05)

### 0.0.2 (2018-10-02)
