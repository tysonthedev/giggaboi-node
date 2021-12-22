//this file just gets all of the command objects in an array
import Command from './types/Command';
import test from './commands/test';
import connect from './commands/connect';
import play from './commands/play';
import pause from './commands/pause';
import unpause from './commands/unpause';
import queue from './commands/queue';
import skip from './commands/skip';
import stop from './commands/stop';

const allCommands: Array<Command> = [test, connect, play, pause, unpause, queue, skip, stop];

export default allCommands;
