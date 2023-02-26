# 'Crossword game'

The idea here is an implementation of a simple word game I played a bunch with 
my family as a kid. Never had a name for it other than as a 'crossword game', 
although it is not a _crossword_, clearly. I should probably come up with
something better.

## Short overview of the game idea

The 2-4 players each draw a 5x5 empty grid on their own (private) notebook. One
player starts by announcing a letter. Each player must place the announced
letter somewhere in their grid. Players then take turns announcing further
letters, with each player adding every letter to the grid, until the grid is
full.

The players' goal is to create as many words, vertically and horizontally, in
their grid as they can. Words are assigned a score based on length, with a
minimum of two letters in a word. For words of length one to four, their score
is their length. Words of length five are worth double (i.e. 10 points). A given
letter may be used for exactly one word in a given direction, i.e. you cannot
create words with overlapping letters, but you can use a letter vertically and
also horizontally.

Once the players' grids are full, they tally up their total score and the player
with the highest score wins.

A round of this will generally take 5-10 minutes depending on how quickly the 
players make their letter selections and grid placements.

There is some unfairness to the ruleset in that, being that the grid is 5x5,
with 2-4 players, some players will have more turns than others. Solving this is
not an initial design goal here, although grid size, player counts, multiple
rounds etc. could be ideas to experiment with.

## The core idea of this project

This is intended as a simple time-wasting personal project for when I feel like
coding outside of work, which is not often. It intends to be a straightforward
web implementation of the above game.

## Core design ideas

I intend to document the design in other documents here, but at least as of
starting out, my general idea of how to build this is:

* TS/Node/Express backend for ease of development
* Separate likely-TS/React frontend, although I'm focusing on the backend first
  * I would like to have the frontend in the same repo but my god frontend dev
    sucks
  * So for now I'm not going to bother with that / trying to share types between
    frontend and backend, though I may come back to that
* HTTP API for game management
* Websockets API for the lobby and in-game communications
  * WS because I expect the game logic to be event driven
  * I'm an absolute amateur in this regard though so it could turn out horribly
* Game state is driven by a backend state machine
* Game state to initially be stored in-memory but with a data interface
  * Likely would be turned into a Redis cache if this were ever productionised
  * To allow for stateless/12-factor deployment
  * Redis because a single game's data is relatively short-lived
* Initially, avoid a traditional database
  * If e.g. longer term player management were needed, probably add a Postgres
* I'm terrible with making code nice for personal projects, but...
  * I have set up eslint, prettier etc. including commit hooks out of the box
  * If I can be bothered I'll try and include some Jest tests for the game logic


## Do I know what I'm doing?

Nah not really. I'm fairly proficient in TS/Node from using it for work, but 
probably not in a way that fits modern 'standard' trendy Node usage. 

I'm an infastructure dev so frontend is very much not my wheelhouse, but I  have
done the odd small personal React project before.

I also am not a game designer or developer, but I have done game modding before,
albeit under very different conditions (read: C++ / Unreal Engine 3 nonsense).

Also I just don't feel like coding outside of work very often so any work on
this is entirely subject to me having time and motivation to care about it.