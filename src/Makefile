CC      = gcc
NOCRYPT =
DEBUG  ?= 1

OPT_FLAGS = -O2
DBG_FLAGS =
ifeq ($(DEBUG),1)
OPT_FLAGS = -O0 -fno-omit-frame-pointer
DBG_FLAGS = -g3
endif

C_FLAGS = $(OPT_FLAGS) -Wall $(DBG_FLAGS) $(NOCRYPT) -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=0 -fno-stack-protector
L_FLAGS = $(OPT_FLAGS) $(DBG_FLAGS)
LIBS   = -lcrypt -lm

O_FILES = act_comm.o act_info.o act_move.o act_obj.o act_wiz.o bit.o board.o clan.o  \
          comm.o const.o db.o envconfig.o fight.o fist.o handler.o interp.o mazoku.o \
	  magic.o mem.o mob_commands.o mob_prog.o olc.o olc_act.o olc_save.o patryn.o \
	  quest.o saiyan.o save.o special.o soldier.o sorcerer.o string.o suit.o     \
	  update.o 

chaosium: $(O_FILES)
	rm -f chaosium 
	$(CC) $(L_FLAGS) -o chaosium $(O_FILES) $(LIBS)

.c.o: merc.h
	$(CC) -c $(C_FLAGS) $<

clean:
	rm -f *.o chaosium
