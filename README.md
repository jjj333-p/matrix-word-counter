# matrix-word-counter

A simple matrix bot to count how frequently users use a word in your room.

![image](https://github.com/jjj333-p/matrix-word-counter/assets/94018608/fe532ec6-8521-4ab9-9a04-405e4f3aafc2)

# Usage

This bot is very simple, there is one command and for the most part it just sits in the background unnoticed. ~~You can invite my bot `@word-counter:pain.agency`~~(currently invites are broken and I dont know why) or host it yourself.

- The bot will count the last 1000 fetchable messages uppon joining and counts words from every message since
- The counts are on a per room basis, so you can see just how degenerate your room is!
- any word fitting the regex `/[^a-z0-9]/gi` will be counted