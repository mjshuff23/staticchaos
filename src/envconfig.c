/***************************************************************************
 *  Runtime configuration helpers for environment-specific paths.          *
 ***************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <unistd.h>

#include "merc.h"

#ifndef PATH_MAX
#define PATH_MAX 4096
#endif

static char player_dir_buf[PATH_MAX];
static char player_temp_dir_buf[PATH_MAX];
static char finger_dir_buf[PATH_MAX];
static char note_dir_buf[PATH_MAX];
static char area_dir_buf[PATH_MAX];
static char area_list_buf[PATH_MAX];
static char bug_file_buf[PATH_MAX];
static char idea_file_buf[PATH_MAX];
static char typo_file_buf[PATH_MAX];
static char note_file_buf[PATH_MAX];
static char shutdown_file_buf[PATH_MAX];
static char copyover_file_buf[PATH_MAX];
static char mobprog_dir_buf[PATH_MAX];

static const char *player_dir_value = "../player/";
static const char *player_temp_dir_value = "../player/temp";
static const char *finger_dir_value = "../finger/";
static const char *note_dir_value = "../notes/";
static const char *area_dir_value = "area";
static const char *area_list_value = "area/area.lst";
static const char *bug_file_value = "area/bugs.txt";
static const char *idea_file_value = "area/ideas.txt";
static const char *typo_file_value = "area/typos.txt";
static const char *note_file_value = "area/notes.txt";
static const char *shutdown_file_value = "area/shutdown.txt";
static const char *copyover_file_value = "area/copyover.txt";
static const char *mobprog_dir_value = "area/MOBProgs";

static char rotating_area_paths[4][PATH_MAX];
static int rotating_area_index = 0;

/*
 * Helper that prefers an explicit environment variable, otherwise falls
 * back to CHAOS_ENV_ROOT + suffix, and finally to the compiled default.
 */
static const char *resolve_path(const char *env_var,
				const char *root,
				const char *suffix,
				const char *compiled_default,
				char *buf,
				size_t buf_len)
{
    const char *override = getenv(env_var);

    if (override != NULL && override[0] != '\0')
	return override;

    if (root != NULL && root[0] != '\0' && suffix != NULL)
    {
	size_t root_len = strlen(root);
	int needs_slash = root[root_len - 1] != '/';
	snprintf(buf, buf_len, "%s%s%s",
	         root,
	         needs_slash ? "/" : "",
	         suffix);
	return buf;
    }

    return compiled_default;
}

static int path_exists(const char *path)
{
    return path != NULL && path[0] != '\0' && access(path, F_OK) == 0;
}

static const char *join_path(const char *dir,
			     const char *suffix,
			     char *buf,
			     size_t buf_len)
{
    if (dir == NULL || dir[0] == '\0')
    {
	snprintf(buf, buf_len, "%s", suffix != NULL ? suffix : "");
	return buf;
    }

    if (suffix == NULL || suffix[0] == '\0')
    {
	snprintf(buf, buf_len, "%s", dir);
	return buf;
    }

    size_t need_slash = dir[strlen(dir) - 1] == '/' ? 0 : 1;
    if (need_slash)
	snprintf(buf, buf_len, "%s/%s", dir, suffix);
    else
	snprintf(buf, buf_len, "%s%s", dir, suffix);
    return buf;
}

static void ensure_trailing_slash(char *path, size_t buf_len)
{
    size_t len;

    if (path == NULL)
	return;

    len = strlen(path);
    if (len == 0 || path[len - 1] == '/')
	return;

    if (len + 1 >= buf_len)
	return;

    path[len] = '/';
    path[len + 1] = '\0';
}

static void configure_area_paths(const char *root)
{
    const char *explicit_dir = getenv("CHAOS_AREA_DIR");

    if (explicit_dir != NULL && explicit_dir[0] != '\0')
    {
	snprintf(area_dir_buf, sizeof(area_dir_buf), "%s", explicit_dir);
    }
    else if (root != NULL && root[0] != '\0')
    {
	join_path(root, "area", area_dir_buf, sizeof(area_dir_buf));
    }
    else if (path_exists("area"))
    {
	snprintf(area_dir_buf, sizeof(area_dir_buf), "%s", "area");
    }
    else
    {
	snprintf(area_dir_buf, sizeof(area_dir_buf), "%s", ".");
    }

    area_dir_value = area_dir_buf;
    area_list_value = join_path(area_dir_value, "area.lst",
				area_list_buf, sizeof(area_list_buf));
    bug_file_value = join_path(area_dir_value, "bugs.txt",
			       bug_file_buf, sizeof(bug_file_buf));
    idea_file_value = join_path(area_dir_value, "ideas.txt",
				idea_file_buf, sizeof(idea_file_buf));
    typo_file_value = join_path(area_dir_value, "typos.txt",
				typo_file_buf, sizeof(typo_file_buf));
    note_file_value = join_path(area_dir_value, "notes.txt",
				note_file_buf, sizeof(note_file_buf));
    shutdown_file_value = join_path(area_dir_value, "shutdown.txt",
				    shutdown_file_buf, sizeof(shutdown_file_buf));
    copyover_file_value = join_path(area_dir_value, "copyover.txt",
				    copyover_file_buf, sizeof(copyover_file_buf));
    mobprog_dir_value = join_path(area_dir_value, "MOBProgs",
				  mobprog_dir_buf, sizeof(mobprog_dir_buf));
}

static void configure_misc_dirs(const char *root)
{
    const char *finger_override = getenv("CHAOS_FINGER_DIR");
    const char *notes_override = getenv("CHAOS_NOTES_DIR");

    if (finger_override != NULL && finger_override[0] != '\0')
	snprintf(finger_dir_buf, sizeof(finger_dir_buf), "%s", finger_override);
    else if (root != NULL && root[0] != '\0')
	join_path(root, "finger", finger_dir_buf, sizeof(finger_dir_buf));
    else if (path_exists("finger"))
	snprintf(finger_dir_buf, sizeof(finger_dir_buf), "%s", "finger");
    else if (path_exists("../finger"))
	snprintf(finger_dir_buf, sizeof(finger_dir_buf), "%s", "../finger");
    else
	snprintf(finger_dir_buf, sizeof(finger_dir_buf), "%s", "../finger");

    if (notes_override != NULL && notes_override[0] != '\0')
	snprintf(note_dir_buf, sizeof(note_dir_buf), "%s", notes_override);
    else if (root != NULL && root[0] != '\0')
	join_path(root, "notes", note_dir_buf, sizeof(note_dir_buf));
    else if (path_exists("notes"))
	snprintf(note_dir_buf, sizeof(note_dir_buf), "%s", "notes");
    else if (path_exists("../notes"))
	snprintf(note_dir_buf, sizeof(note_dir_buf), "%s", "../notes");
    else
	snprintf(note_dir_buf, sizeof(note_dir_buf), "%s", "../notes");

    ensure_trailing_slash(finger_dir_buf, sizeof(finger_dir_buf));
    ensure_trailing_slash(note_dir_buf, sizeof(note_dir_buf));

    finger_dir_value = finger_dir_buf;
    note_dir_value = note_dir_buf;
}

void init_path_overrides(void)
{
    const char *root = getenv("CHAOS_ENV_ROOT");
    const char *player_override = getenv("CHAOS_PLAYER_DIR");
    const char *player_temp_override = getenv("CHAOS_PLAYER_TEMP_DIR");

    if (player_override != NULL && player_override[0] != '\0')
    {
	snprintf(player_dir_buf, sizeof(player_dir_buf), "%s", player_override);
	ensure_trailing_slash(player_dir_buf, sizeof(player_dir_buf));
	player_dir_value = player_dir_buf;
    }
    else
    {
	player_dir_value = resolve_path("CHAOS_PLAYER_DIR",
					root,
					"player/",
					"../player/",
					player_dir_buf,
					sizeof(player_dir_buf));
    }
    if (player_override == NULL && (root == NULL || root[0] == '\0') &&
	!path_exists(player_dir_value) && path_exists("player"))
    {
	snprintf(player_dir_buf, sizeof(player_dir_buf), "%s", "player/");
	player_dir_value = player_dir_buf;
    }

    if (player_temp_override != NULL && player_temp_override[0] != '\0')
    {
	snprintf(player_temp_dir_buf, sizeof(player_temp_dir_buf), "%s",
		 player_temp_override);
	player_temp_dir_value = player_temp_dir_buf;
    }
    else
    {
	player_temp_dir_value = resolve_path("CHAOS_PLAYER_TEMP_DIR",
					     root,
					     "player/temp",
					     "../player/temp",
					     player_temp_dir_buf,
					     sizeof(player_temp_dir_buf));
    }
    if (player_temp_override == NULL && (root == NULL || root[0] == '\0') &&
	!path_exists(player_temp_dir_value) && path_exists("player/temp"))
    {
	snprintf(player_temp_dir_buf, sizeof(player_temp_dir_buf), "%s", "player/temp");
	player_temp_dir_value = player_temp_dir_buf;
    }

    configure_area_paths(root);
    configure_misc_dirs(root);
}

const char *get_player_dir(void)
{
    return player_dir_value;
}

const char *get_player_temp_dir(void)
{
    return player_temp_dir_value;
}

const char *get_area_dir(void)
{
    return area_dir_value;
}

const char *get_area_list_path(void)
{
    return area_list_value;
}

const char *get_bug_file_path(void)
{
    return bug_file_value;
}

const char *get_idea_file_path(void)
{
    return idea_file_value;
}

const char *get_typo_file_path(void)
{
    return typo_file_value;
}

const char *get_note_file_path(void)
{
    return note_file_value;
}

const char *get_shutdown_file_path(void)
{
    return shutdown_file_value;
}

const char *get_copyover_file_path(void)
{
    return copyover_file_value;
}

const char *get_mobprog_dir(void)
{
    return mobprog_dir_value;
}

const char *get_finger_dir(void)
{
    return finger_dir_value;
}

const char *get_note_dir(void)
{
    return note_dir_value;
}

const char *area_file_path(const char *filename)
{
    if (filename == NULL || filename[0] == '\0')
	return area_dir_value;

    rotating_area_index = (rotating_area_index + 1) % 4;
    join_path(area_dir_value,
	      filename,
	      rotating_area_paths[rotating_area_index],
	      sizeof(rotating_area_paths[rotating_area_index]));
    return rotating_area_paths[rotating_area_index];
}
