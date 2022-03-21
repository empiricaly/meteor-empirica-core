# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.17.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.16.3...v1.17.0) (2022-03-21)

### Features

* make submittedAt available on stage ([#266](https://github.com/empiricaly/meteor-empirica-core/issues/266)) ([00a5485](https://github.com/empiricaly/meteor-empirica-core/commit/00a54852e1e3f79bd6e8e4a6fdca2f1fccae3fed))



### [1.16.3](https://github.com/empiricaly/meteor-empirica-core/compare/v1.16.2...v1.16.3) (2021-11-25)

### Bug Fixes

* check for early exit player on submit stage [#261](https://github.com/empiricaly/meteor-empirica-core/issues/261) ([#262](https://github.com/empiricaly/meteor-empirica-core/issues/262)) ([71bc5dd](https://github.com/empiricaly/meteor-empirica-core/commit/71bc5dd503ca90a64ec2582bf6ceea217c449f39))


### [1.16.2](https://github.com/empiricaly/meteor-empirica-core/compare/v1.16.1...v1.16.2) (2021-07-14)

### Bug Fixes

* lock gameInit to avoid gameFull status on player [#255](https://github.com/empiricaly/meteor-empirica-core/issues/255) ([#257](https://github.com/empiricaly/meteor-empirica-core/issues/257)) ([993693e](https://github.com/empiricaly/meteor-empirica-core/commit/993693e0686e96336e542cf0502d08c89445b091))


### [1.16.1](https://github.com/empiricaly/meteor-empirica-core/compare/v1.16.0...v1.16.1) (2021-06-17)

### Bug Fixes

* fix reset games and entire app delete entire custom collections [#251](https://github.com/empiricaly/meteor-empirica-core/issues/251) ([#253](https://github.com/empiricaly/meteor-empirica-core/issues/253)) ([887455b](https://github.com/empiricaly/meteor-empirica-core/commit/887455b6376fb5bd8b4ba1ce9aaba107c017fb04))


## [1.16.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.15.4...v1.16.0) (2021-04-01)

### Features

* retire single player [#239](https://github.com/empiricaly/meteor-empirica-core/issues/239) ([#243](https://github.com/empiricaly/meteor-empirica-core/issues/243)) ([e17d8e7](https://github.com/empiricaly/meteor-empirica-core/commit/e17d8e75aaad01955129d72e7a096485914f2725))

### Bug Fixes

* fix game status on cancelled batch [#241](https://github.com/empiricaly/meteor-empirica-core/issues/241) ([#242](https://github.com/empiricaly/meteor-empirica-core/issues/242)) ([4e2e67f](https://github.com/empiricaly/meteor-empirica-core/commit/4e2e67fcc8890efee1c560469d2668f67572c9e7))
* fix new player form hangs [#225](https://github.com/empiricaly/meteor-empirica-core/issues/225) ([#242](https://github.com/empiricaly/meteor-empirica-core/issues/242)) ([4e2e67f](https://github.com/empiricaly/meteor-empirica-core/commit/4e2e67fcc8890efee1c560469d2668f67572c9e7))



### [1.15.4](https://github.com/empiricaly/meteor-empirica-core/compare/v1.15.3...v1.15.4) (2021-03-30)

### Bug Fixes

* send queued players to exit when batch is cancelled [#233](https://github.com/empiricaly/meteor-empirica-core/issues/233) ([#235](https://github.com/empiricaly/meteor-empirica-core/issues/235)) ([269d870](https://github.com/empiricaly/meteor-empirica-core/commit/269d870175acfce5063ae1cd529c64f4b93443a6))
* fix callback being called twice [#234](https://github.com/empiricaly/meteor-empirica-core/issues/234) ([#236](https://github.com/empiricaly/meteor-empirica-core/issues/236)) ([8e99245](https://github.com/empiricaly/meteor-empirica-core/commit/8e99245b39e0b5b8c2972e39057a580dbf64524c))


### [1.15.3](https://github.com/empiricaly/meteor-empirica-core/compare/v1.15.2...v1.15.3) (2021-03-16)

### Bug Fixes

* save intro states of each player [#230](https://github.com/empiricaly/meteor-empirica-core/issues/230) ([#231](https://github.com/empiricaly/meteor-empirica-core/issues/231)) ([0b55c98](https://github.com/empiricaly/meteor-empirica-core/commit/0b55c986200b798164398470e9d0b5e46e58f7c7))


### [1.15.2](https://github.com/empiricaly/meteor-empirica-core/compare/v1.15.1...v1.15.2) (2021-03-03)

### Bug Fixes

* add exitReason and fix CSV import [#223](https://github.com/empiricaly/meteor-empirica-core/issues/223) ([#226](https://github.com/empiricaly/meteor-empirica-core/issues/226)) ([7264f0f](https://github.com/empiricaly/meteor-empirica-core/commit/7264f0ff2625ea096bc3f47af90153d82bc88da9))


### [1.15.1](https://github.com/empiricaly/meteor-empirica-core/compare/v1.15.0...v1.15.1) (2021-02-08)

### Bug Fixes

* fix intro consent intro props rest ([4887dd](https://github.com/empiricaly/meteor-empirica-core/commit/4887dd0331f2c8073724ebe657e46627016d81d1))


## [1.15.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.14.0...v1.15.0) (2021-02-08)

### Features

* add admin debug params to consent, intro steps and lobby ([#218](https://github.com/empiricaly/meteor-empirica-core/issues/218)) ([934f238](https://github.com/empiricaly/meteor-empirica-core/commit/934f2383b1b4df89d7db5766083c7d87a16141e3))


### Bug Fixes

* fix remainingSeconds const ([a80ca1](https://github.com/empiricaly/meteor-empirica-core/commit/a80ca1e75575b3820610be70fe795b4e7d0b4de7))


## [1.14.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.13.0...v1.14.0) (2021-02-01)

### Features

* add remaining seconds in gameLobby [#210](https://github.com/empiricaly/meteor-empirica-core/issues/210) ([#214](https://github.com/empiricaly/meteor-empirica-core/issues/214)) ([c137673](https://github.com/empiricaly/meteor-empirica-core/commit/c13767323efdb55c2f5e892d393f98c1a466aa16))
* add cancel game from admin UI [#110](https://github.com/empiricaly/meteor-empirica-core/issues/196) ([#216](https://github.com/empiricaly/meteor-empirica-core/issues/216)) ([0266d8c](https://github.com/empiricaly/meteor-empirica-core/commit/0266d8ce9b3001872a4dee7323cb07549f0e0cb5))


### Bug Fixes

* override single player to waiting screen [#204](https://github.com/empiricaly/meteor-empirica-core/issues/204) ([#212](https://github.com/empiricaly/meteor-empirica-core/issues/212)) ([67764bf](https://github.com/empiricaly/meteor-empirica-core/commit/67764bf1c99f176677e8c93a7e24bfee0fd1193f))
* fix double public on debug_newPlayer [#205](https://github.com/empiricaly/meteor-empirica-core/issues/205) ([#213](https://github.com/empiricaly/meteor-empirica-core/issues/213)) ([5ea9430](https://github.com/empiricaly/meteor-empirica-core/commit/5ea9430c28c782832cbb843c41274fed49fada0a))
* remove game helpers [#211](https://github.com/empiricaly/meteor-empirica-core/issues/211) ([#215](https://github.com/empiricaly/meteor-empirica-core/issues/215)) ([1217991](https://github.com/empiricaly/meteor-empirica-core/commit/1217991da363e68881cf3e02fdb51995388946e9))


## [1.13.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.12.0...v1.13.0) (2021-01-20)


### Features

* add gameLobby in place of game for exit steps if player exited ([#208](https://github.com/empiricaly/meteor-empirica-core/issues/208)) ([d9b82fa](https://github.com/empiricaly/meteor-empirica-core/commit/d9b82fad916e8266da276a563c12cf8abd9ba90e))


## [1.12.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.11.1...v1.12.0) (2020-12-09)


### Features

* add exit status of player in admin [#187](https://github.com/empiricaly/meteor-empirica-core/issues/187) ([#193](https://github.com/empiricaly/meteor-empirica-core/issues/193)) ([277a47b](https://github.com/empiricaly/meteor-empirica-core/commit/277a47bc8f984a57f7ae5934f019348abc25ee44))
* added various quality of life improvements ([#199](https://github.com/empiricaly/meteor-empirica-core/issues/199)) ([8eec8f2](https://github.com/empiricaly/meteor-empirica-core/commit/8eec8f2ebedd7def7d059af0facadbd40f46a52e))
* show batch index on exported batches [#186](https://github.com/empiricaly/meteor-empirica-core/issues/186) ([#201](https://github.com/empiricaly/meteor-empirica-core/issues/201)) ([a371dc3](https://github.com/empiricaly/meteor-empirica-core/commit/a371dc3fcbc9b7fccf39c4ba132e8a391e539067))


### Bug Fixes

* fix error message when add factor value [#191](https://github.com/empiricaly/meteor-empirica-core/issues/191) ([#192](https://github.com/empiricaly/meteor-empirica-core/issues/192)) ([ed041cd](https://github.com/empiricaly/meteor-empirica-core/commit/ed041cdcd47e870f3b2fbb0528dc3a5793e7fa88))



### [1.11.1](https://github.com/empiricaly/meteor-empirica-core/compare/v1.11.0...v1.11.1) (2020-11-12)


### Bug Fixes

* fix empty id on newPlayerForm, fix requiredFactors exclude the archived ([c10168d](https://github.com/empiricaly/meteor-empirica-core/commit/c10168d884e26b3d04c605837a6f5d7c9cdb7437))


## [1.11.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.10.0...v1.11.0) (2020-11-09)


### Features

* add option for pii inside lastLogin player [#170](https://github.com/empiricaly/meteor-empirica-core/issues/170) ([#171](https://github.com/empiricaly/meteor-empirica-core/issues/171)) ([6b63641](https://github.com/empiricaly/meteor-empirica-core/commit/6b6364172a7db9bc843c000c5925eea378d2501a))


### Bug Fixes

* remove event from handleNewPlayer [#182](https://github.com/empiricaly/meteor-empirica-core/issues/182) ([#183](https://github.com/empiricaly/meteor-empirica-core/issues/183)) ([a9985ab](https://github.com/empiricaly/meteor-empirica-core/commit/a9985abf90bda695b9af4b00f7af418e6c75030b))
* reset new batch assignment value [#178](https://github.com/empiricaly/meteor-empirica-core/issues/178) ([#181](https://github.com/empiricaly/meteor-empirica-core/issues/181)) ([b3b026c](https://github.com/empiricaly/meteor-empirica-core/commit/b3b026cb1666d38e3b577335b15bad716a5176ad))


## [1.10.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.9.0...v1.10.0) (2020-11-04)


### Features


* add custom new player page [#165](https://github.com/empiricaly/meteor-empirica-core/issues/165) ([#169](https://github.com/empiricaly/meteor-empirica-core/issues/169)) ([74cc064](https://github.com/empiricaly/meteor-empirica-core/commit/74cc064d4288c69341662c2a246fab54e6679892))
* filter players from admin UI [#111](https://github.com/empiricaly/meteor-empirica-core/issues/111) ([#175](https://github.com/empiricaly/meteor-empirica-core/issues/175)) ([be096a9](https://github.com/empiricaly/meteor-empirica-core/commit/be096a957ba21b20282a37e367f40fcd388f2f61))


### Bug Fixes

* rework on custom newPlayer page [#173](https://github.com/empiricaly/meteor-empirica-core/issues/173) ([#174](https://github.com/empiricaly/meteor-empirica-core/issues/174)) ([0d0db40](https://github.com/empiricaly/meteor-empirica-core/commit/0d0db40db187e26ddee389eb62a15026d902a69a))
* sort batches and players based on index [#112](https://github.com/empiricaly/meteor-empirica-core/issues/112) ([#176](https://github.com/empiricaly/meteor-empirica-core/issues/176)) ([23e369d](https://github.com/empiricaly/meteor-empirica-core/commit/23e369d9c810ba8f359094cbd89b3994b3181c3f))


## [1.9.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.8.0...v1.9.0) (2020-11-03)


### Features

* add custom new player page [#165](https://github.com/empiricaly/meteor-empirica-core/issues/165) ([#169](https://github.com/empiricaly/meteor-empirica-core/issues/169)) ([74cc064](https://github.com/empiricaly/meteor-empirica-core/commit/74cc064d4288c69341662c2a246fab54e6679892))
* add option for pii inside lastLogin player [#170](https://github.com/empiricaly/meteor-empirica-core/issues/170) ([#171](https://github.com/empiricaly/meteor-empirica-core/issues/171)) ([6b63641](https://github.com/empiricaly/meteor-empirica-core/commit/6b6364172a7db9bc843c000c5925eea378d2501a))

### Bug Fixes


* change createdAt into runningAt on admin UI [#164](https://github.com/empiricaly/meteor-empirica-core/issues/164) ; sort batches in admin UI ([#168](https://github.com/empiricaly/meteor-empirica-core/issues/168)) ([a30b9f3](https://github.com/empiricaly/meteor-empirica-core/commit/a30b9f3aedc94f66d61fd117bdc11e969a24bc40))

### [1.8.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.7.0...v1.8.0) (2020-09-29)


### Features

* **export:** add checkbox to enable export of PII [#141](https://github.com/empiricaly/meteor-empirica-core/issues/141) ([#151](https://github.com/empiricaly/meteor-empirica-core/issues/151)) ([fb72e8c](https://github.com/empiricaly/meteor-empirica-core/commit/fb72e8cd9fb167179b1317f113021c1324b960db))


### Bug Fixes

* fix stage should not continue when all players exit [#158](https://github.com/empiricaly/meteor-empirica-core/issues/158) ([#161](https://github.com/empiricaly/meteor-empirica-core/issues/161)) ([ac409c9](https://github.com/empiricaly/meteor-empirica-core/commit/ac409c95448a71e6c8fff5633235eaa064e865b7))
* fix game.end() error [#159](https://github.com/empiricaly/meteor-empirica-core/issues/159) ([#160](https://github.com/empiricaly/meteor-empirica-core/issues/160)) ([fc07ace](https://github.com/empiricaly/meteor-empirica-core/commit/fc07ace05455d801712653ffafceffab88c69122))


## [1.7.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.6.0...v1.7.0) (2020-06-18)


### Bug Fixes

* missing roundIds on games [#146](https://github.com/empiricaly/meteor-empirica-core/issues/146) ([#148](https://github.com/empiricaly/meteor-empirica-core/issues/148)) ([62d584d](https://github.com/empiricaly/meteor-empirica-core/commit/62d584d))
* splitting params on callback [#142](https://github.com/empiricaly/meteor-empirica-core/issues/142) ([#143](https://github.com/empiricaly/meteor-empirica-core/issues/143)) ([03de6e6](https://github.com/empiricaly/meteor-empirica-core/commit/03de6e6))


### Features

* add  support for player.exit() before game start [#144](https://github.com/empiricaly/meteor-empirica-core/issues/144) ([#145](https://github.com/empiricaly/meteor-empirica-core/issues/145)) ([baa89b5](https://github.com/empiricaly/meteor-empirica-core/commit/baa89b5))


## [1.6.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.5.1...v1.6.0) (2020-06-02)


### Features

* upgrade npm and meteor package dependencies ([#138](https://github.com/empiricaly/meteor-empirica-core/issues/138)) ([d94b145](https://github.com/empiricaly/meteor-empirica-core/commit/d94b145629563862ea77c551b05da56d4cbd8b93))


### [1.5.1](https://github.com/empiricaly/meteor-empirica-core/compare/v1.5.0...v1.5.1) (2020-05-26)


* allow all-bot games ([6d43a6b](https://github.com/empiricaly/meteor-empirica-core/commit/6d43a6b300aaff90014eb6806fef0a58c328b1f4))
* bot callback passthrough ([#128](https://github.com/empiricaly/meteor-empirica-core/issues/128)) ([33fea16](https://github.com/empiricaly/meteor-empirica-core/commit/33fea16fd3571948000aee9d41a652785b3328f3))
* fail game with callback throw [#133](https://github.com/empiricaly/meteor-empirica-core/issues/133) ([#134](https://github.com/empiricaly/meteor-empirica-core/issues/134)) ([20491ba](https://github.com/empiricaly/meteor-empirica-core/commit/20491bad20b2a0343110fd4a3dc697671707628a))
* remove gameInit throw [#125](https://github.com/empiricaly/meteor-empirica-core/issues/125) ([#129](https://github.com/empiricaly/meteor-empirica-core/issues/129)) ([30636e5](https://github.com/empiricaly/meteor-empirica-core/commit/30636e56ef386d1b1ef175e41f6bddf693306aa9))
* return all players on lobby [#131](https://github.com/empiricaly/meteor-empirica-core/issues/131) ([#135](https://github.com/empiricaly/meteor-empirica-core/issues/135)) ([9f727be](https://github.com/empiricaly/meteor-empirica-core/commit/9f727be3f37c47cfdcf0799253de72067d6ac0be))
* undefined gameLobbyId onSub [#131](https://github.com/empiricaly/meteor-empirica-core/issues/131) ([#136](https://github.com/empiricaly/meteor-empirica-core/issues/136)) ([67fdfff](https://github.com/empiricaly/meteor-empirica-core/commit/67fdfffe3b3f69963ab37aa641e24226c58446ab))

## [1.5.0](https://github.com/empiricaly/meteor-empirica-core/compare/v1.4.3...v1.5.0) (2020-04-30)


### Features

* add elapsedTime output prop to StageTimeWrapper ([#116](https://github.com/empiricaly/meteor-empirica-core/issues/116)) ([44d1bfc](https://github.com/empiricaly/meteor-empirica-core/commit/44d1bfcde9ef4151b12b63b908c51418aa13b844)), closes [/github.com/amaatouq/guess-the-correlation/blob/master/client/game/TaskResponse.jsx#L24](https://github.com/empiricaly//github.com/amaatouq/guess-the-correlation/blob/master/client/game/TaskResponse.jsx/issues/L24)
* add export of stage.submittedAt ([#117](https://github.com/empiricaly/meteor-empirica-core/issues/117)) ([9290325](https://github.com/empiricaly/meteor-empirica-core/commit/92903252bdda34ddd62aade459a580517dc87565))


### Bug Fixes

* empty arguments on game hooks [#119](https://github.com/empiricaly/meteor-empirica-core/issues/119) ([#121](https://github.com/empiricaly/meteor-empirica-core/issues/121)) ([0f89874](https://github.com/empiricaly/meteor-empirica-core/commit/0f89874f019d74b952ceb48126afc39cab743964))
* try catch index creation [#118](https://github.com/empiricaly/meteor-empirica-core/issues/118) ([#122](https://github.com/empiricaly/meteor-empirica-core/issues/122)) ([3fc63f5](https://github.com/empiricaly/meteor-empirica-core/commit/3fc63f5f67cf853e1644bdadda20f522db5493b5))


### [1.4.3](https://github.com/empiricaly/meteor-empirica-core/compare/v1.4.1...v1.4.3) (2020-04-07)


### Features

* add chat in lobby ([#87](https://github.com/empiricaly/meteor-empirica-core/issues/87)) ([b1b74be](https://github.com/empiricaly/meteor-empirica-core/commit/b1b74be6e6829812bdef1f3e773e82225f619222))
* add game helpers [#94](https://github.com/empiricaly/meteor-empirica-core/issues/94) ([#103](https://github.com/empiricaly/meteor-empirica-core/issues/103)) ([4ca78b3](https://github.com/empiricaly/meteor-empirica-core/commit/4ca78b376513c419dc01059ca295891ff1aab495))
* add game.end() method [#75](https://github.com/empiricaly/meteor-empirica-core/issues/75) ([#99](https://github.com/empiricaly/meteor-empirica-core/issues/99)) ([6a7f1ec](https://github.com/empiricaly/meteor-empirica-core/commit/6a7f1ec21a7fe3b95e826d493da451f5a77e7219))
* custom no batch component [#38](https://github.com/empiricaly/meteor-empirica-core/issues/38) ([#101](https://github.com/empiricaly/meteor-empirica-core/issues/101)) ([33248bb](https://github.com/empiricaly/meteor-empirica-core/commit/33248bbf0890bce707dc3c203d9ff0f3fd831c11))


### Bug Fixes

* catch error on game cb [#106](https://github.com/empiricaly/meteor-empirica-core/issues/106) ([#108](https://github.com/empiricaly/meteor-empirica-core/issues/108)) ([3e89595](https://github.com/empiricaly/meteor-empirica-core/commit/3e89595f8c12485deb41714aa81415f71f19e5cb))
* game end when last player exit [#74](https://github.com/empiricaly/meteor-empirica-core/issues/74) ([#100](https://github.com/empiricaly/meteor-empirica-core/issues/100)) ([f36a629](https://github.com/empiricaly/meteor-empirica-core/commit/f36a629af85e96775976953a062086fcb35af4f9))
* improve json export [#21](https://github.com/empiricaly/meteor-empirica-core/issues/21) ([#102](https://github.com/empiricaly/meteor-empirica-core/issues/102)) ([c70d50c](https://github.com/empiricaly/meteor-empirica-core/commit/c70d50ca3fac0b8e14f11a22351f2b8d9bbb99ec))
* make sure automatic factor names aren't too long ([3263bd8](https://github.com/empiricaly/meteor-empirica-core/commit/3263bd879c41b2d3bcfd8ab2010d5b4d16c34970))
* remove throw on stage submitted twice [#68](https://github.com/empiricaly/meteor-empirica-core/issues/68) ([#98](https://github.com/empiricaly/meteor-empirica-core/issues/98)) ([f015343](https://github.com/empiricaly/meteor-empirica-core/commit/f01534363748d403d55c5a6ad28d67bb7fddc145))


### 1.4.1 (2020-03-05)


### Bug Fixes

* add missing player attribute onSubmit [#93](https://github.com/empiricaly/meteor-empirica-core/issues/93) ([#97](https://github.com/empiricaly/meteor-empirica-core/issues/97)) ([5657c21](https://github.com/empiricaly/meteor-empirica-core/commit/5657c21))
* do not depend on playerIdConn; update meteor version ([cf75d01](https://github.com/empiricaly/meteor-empirica-core/commit/cf75d01))
* ensure stage is created with a seconds as a number ([6b3a7af](https://github.com/empiricaly/meteor-empirica-core/commit/6b3a7af))
* fixed exitSteps undefined (fixes [#85](https://github.com/empiricaly/meteor-empirica-core/issues/85)) ([f01ca69](https://github.com/empiricaly/meteor-empirica-core/commit/f01ca69))
* Include logged variable name in export ([3b79b7c](https://github.com/empiricaly/meteor-empirica-core/commit/3b79b7c)), closes [#78](https://github.com/empiricaly/meteor-empirica-core/issues/78)
* remove unnecessary player connection check on player.exit method ([f2cb4e6](https://github.com/empiricaly/meteor-empirica-core/commit/f2cb4e6)), closes [#73](https://github.com/empiricaly/meteor-empirica-core/issues/73)


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