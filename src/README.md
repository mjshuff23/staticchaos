# Static Chaos src/ reference

This README is a quick map of where commands live in `src/` and what each
file is responsible for. Commands are listed without the `do_` prefix; the
handlers are functions named `do_<command>`.

Build:
- `make chaosium` (from `src/`)

Run:
- `./scripts/run-env.sh dev [port]`
- `./scripts/run-env.sh prod [port]`

## Command handlers by file

### act_comm.c
- Scope: communication, chat channels, social messaging, basic account actions.
- Commands: `auction`, `chat`, `music`, `question`, `answer`, `shout`, `yell`, `immtalk`
- Commands: `info`, `fatality`, `say`, `tell`, `reply`, `emote`, `pose`, `bug`
- Commands: `idea`, `typo`, `rent`, `qui`, `quit`, `save`, `follow`, `order`
- Commands: `group`, `split`, `gtell`, `ansi`, `mtalk`, `mname`, `mjoin`, `maccept`
- Commands: `mbanish`, `suicide`

### act_info.c
- Scope: look/help/who/status, config toggles, score/readouts.
- Commands: `look`, `examine`, `exits`, `score`, `old_score`, `time`, `weather`, `help`
- Commands: `who`, `inventory`, `equipment`, `compare`, `credits`, `where`, `consider`, `title`
- Commands: `description`, `report`, `practice`, `wimpy`, `password`, `socials`, `commands`, `channels`
- Commands: `config`, `wizlist`, `spells`, `slist`, `autoexit`, `autoloot`, `autosac`, `blank`
- Commands: `brief`, `pagelen`, `prompt`, `auto`, `level`, `scan`, `skills`, `timer`
- Commands: `finger`, `affects`, `leaderboards`, `lamerboards`, `loserboards`, `spend`, `dice`, `vote`
- Commands: `uniques`, `mlist`, `contracts`, `legend`, `cflag`, `pkstat`

### act_move.c
- Scope: movement, stance/posture, training, and movement-adjacent actions.
- Commands: `north`, `east`, `south`, `west`, `up`, `down`, `open`, `close`
- Commands: `lock`, `unlock`, `pick`, `stand`, `rest`, `sleep`, `wake`, `sneak`
- Commands: `hide`, `visible`, `recall`, `train`, `stance`, `autostance`, `finish`, `escape`
- Commands: `bandage`, `clearstats`, `home`, `untie`, `tie`, `flex`, `enter`, `dare`
- Commands: `reduction`, `humiliation`, `humiliate`, `rub`, `challenge`, `smother`

### act_obj.c
- Scope: object interaction, inventory, shops, and item abilities.
- Commands: `get`, `put`, `drop`, `give`, `fill`, `drink`, `eat`, `wear`
- Commands: `remove`, `sacrifice`, `junk`, `quaff`, `recite`, `brandish`, `zap`, `steal`
- Commands: `buy`, `list`, `sell`, `value`, `loot`, `claim`, `reclaim`, `gift`
- Commands: `preserve`, `auction`, `bounty`

### act_wiz.c
- Scope: immortal/admin utilities, moderation, world control, and debugging.
- Commands: `wizhelp`, `bamfin`, `lenter`, `bamfout`, `lexit`, `deny`, `disconnect`, `pardon`
- Commands: `echo`, `recho`, `transfer`, `at`, `goto`, `rstat`, `ostat`, `mstat`
- Commands: `mfind`, `ofind`, `mwhere`, `reboo`, `reboot`, `shutdow`, `shutdown`, `snoop`
- Commands: `switch`, `return`, `mload`, `oload`, `purge`, `apurge`, `advance`, `trust`
- Commands: `restore`, `freeze`, `log`, `noemote`, `nonote`, `notell`, `silence`, `peace`
- Commands: `ban`, `allow`, `wizlock`, `newlock`, `slookup`, `sset`, `mset`, `oset`
- Commands: `rset`, `users`, `force`, `invis`, `holylight`, `wizify`, `owhere`, `powerset`
- Commands: `extraset`, `cset`, `llbackup`, `llsave`, `withdraw`, `bits`, `voteset`, `copyover`
- Commands: `minionset`, `fightlist`, `tard`, `token`, `llsort`, `clanedit`, `send`, `squish`
- Commands: `buggedmob`, `swave`, `sblast`, `sbolt`, `sbomb`, `mburst`, `mplist`, `karma`
- Commands: `retir`, `retire`, `changeclass`

### board.c
- Scope: note board system.
- Commands: `note`, `board`

### clan.c
- Scope: clan membership, diplomacy, and clan banking.
- Commands: `induct`, `clantalk`, `accept`, `banish`, `clanrank`, `clanboards`, `clandeposit`, `clanbalance`
- Commands: `banis`, `diplomacy`

### db.c
- Scope: world database bootstrapping plus a couple of admin helpers.
- Commands: `areas`, `memory`

### fight.c
- Scope: combat actions.
- Commands: `kill`, `murde`, `murder`, `backstab`, `flee`, `rescue`, `kick`, `disarm`
- Commands: `sla`, `slay`, `whirl`, `retarget`, `sap`

### fist.c
- Scope: Fist class techniques and combos.
- Commands: `combo`, `shinkick`, `jab`, `spinkick`, `knee`, `elbow`, `uppercut`, `master`
- Commands: `bodytrain`, `discipline`, `eyesight`, `levitate`, `roundhouse`, `innerfire`, `phoenixaura`, `dim_mak`

### magic.c
- Scope: general spell casting.
- Commands: `cast`

### mazoku.c
- Scope: Mazoku class powers and transformations.
- Commands: `develop`, `form`, `morph`, `charge`, `release`, `reform`, `grow`, `astrike`
- Commands: `instantiate`, `imbue`, `teleport`, `rake`, `gouge`, `lash`

### mob_commands.c
- Scope: mobprog command handlers.
- Commands: `mpstat`, `mpasound`, `mpkill`, `mpdamage`, `mpjunk`, `mpechoaround`, `mpechoat`, `mpecho`
- Commands: `mpmload`, `mpoload`, `mppurge`, `mpgoto`, `mpat`, `mptransfer`, `mpforce`, `mpretarget`
- Commands: `mpareadam`, `mptransall`

### olc.c
- Scope: OLC entry points for area/room/object/mobile editing.
- Commands: `aedit`, `redit`, `oedit`, `medit`, `resets`, `alist`

### olc_save.c
- Scope: OLC save operations.
- Commands: `asave`

### patryn.c
- Scope: Patryn class rune magic and glyph systems.
- Commands: `learn`, `runeweave`, `tattoo`, `runestats`, `erase`, `runetrain`, `circle`, `defenses`

### quest.c
- Scope: quest system entry point.
- Commands: `quest`

### saiyan.c
- Scope: Saiyan class ki and combat techniques.
- Commands: `rage`, `focus`, `technique`, `kiblast`, `kibolt`, `kibomb`, `shunkanidou`, `kisense`
- Commands: `kiwall`, `kiwave`, `masenkouha`, `kikouhou`, `kamehameha`, `kaiouken`, `solarflare`, `hawkeyes`
- Commands: `flight`, `ryuken`, `battlesense`, `bigbang`

### sorcerer.c
- Scope: Sorcerer class chanting and spell prep.
- Commands: `chant`, `research`, `specialize`, `prepare`, `concentrate`

### suit.c
- Scope: suit/vehicle operation and weapon controls.
- Commands: `mount`, `leave`, `fly`, `status`, `load`, `ready`, `fire`, `shell`
- Commands: `punch`, `slash`, `install`, `wreck`, `salvo`

## Core engine and support modules (no direct do_* commands)

- `comm.c`: networking, descriptor handling, login flow, main loop.
- `interp.c`: command table and parser, dispatches to `do_*` handlers.
- `db.c`: database boot, area loading, reset logic (also has `areas`/`memory`).
- `save.c`: player/object save and load.
- `update.c`: world tick updates, area resets, regen.
- `handler.c`: affects, equipment, movement helpers, generic handlers.
- `fight.c`: combat engine internals (in addition to commands above).
- `olc_act.c`: OLC subcommands and edit helpers.
- `mob_prog.c`: mob program parser and execution.
- `special.c`: special procedures for mobs/objects/rooms.
- `envconfig.c`: runtime path overrides (`CHAOS_ENV_ROOT`, `CHAOS_*_DIR`).
- `mem.c`: memory allocation helpers and string pooling.
- `string.c`: string utilities and in-game text editor.
- `bit.c`: flag tables and bit helpers.
- `const.c`: constant tables (skills, spells, classes, etc).
- `memwatch.c`/`memwatch.h`: optional memory debugging hooks.
- `soldier.c`: soldier-class or NPC behaviors (no direct command entrypoints).
- `xrand.c`: custom RNG helper.
- `test.c`: scratch/testing code.

## Headers and data tables

- `merc.h`: core structs, globals, macros, and prototypes (the central include).
- `board.h`: note board structures and prototypes.
- `olc.h`: OLC structures and edit macros.
- `colordef.h`: color/ANSI definitions.
- `memwatch.h`: memory debug interface.

## Legacy builds and utilities

- `Makefile` and `Makefile.*`: platform-specific build targets.
- `startup`, `startupSH`, `mktrad`: startup/build helper scripts.
- `nowtime`, `showtime`: legacy 32-bit utilities.
- `readme.txt`: legacy note-board patch notes.
- `combo.txt`, `fuck`, `fuck.txt`: legacy notes/data.
- `name`, `type`: empty placeholders (unused).
